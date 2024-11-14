import { error, json } from '@sveltejs/kit';
import { z } from "zod";
import { sql } from "$lib/db";
import { CONTENT_DIR } from '$env/static/private';
import sharp from "sharp";
import { extname, basename } from "node:path";
import { writeFile } from "node:fs/promises";
import type { DbFile } from '$lib/types/db.js';

const schema = {
  body: z.object({
    data: z.string(),
    name: z.string(),
    ticketId: z.number(),
  })
}

export async function POST({ request, locals }) {
  let body = schema.body.parse(await request.json());
  try {
    let file = decode(body.data)
    const ext = extname(body.name)

    let commentInsert = await sql.set(`INSERT comment (message, userId, ticketId)
      VALUES (:message, :userId, :ticketId)`, {
      message: '',
      userId: locals.session.data.user.userId,
      ticketId: body.ticketId,
    })
    let fileInsert = await sql.set(`INSERT INTO file (commentId) VALUES (:commentId)`, {
      commentId: commentInsert.insertId
    });

    if (fileInsert.affectedRows === 0) return error(500, "Couldn't record file")

    let newObj: DbFile = {
      mime: file.mime,
      name: basename(body.name),
      filename: `${fileInsert.insertId}${ext}`,
      thumb: null,
      commentId: commentInsert.insertId,
      fileId: fileInsert.insertId,
    }
    try {
      if (file.mime.match('image/.*')) {
        await sharp(file.buffer)
          .webp()
          .toFile(`${CONTENT_DIR}/files/${fileInsert.insertId}.webp`);
        await sharp(file.buffer)
          .resize(300, 300, { fit: 'outside' })
          .webp()
          .toFile(`${CONTENT_DIR}/files/${fileInsert.insertId}-thumb.webp`);
        newObj.mime = 'image/webp';
        newObj.filename = `${fileInsert.insertId}.webp`;
        newObj.thumb = `${fileInsert.insertId}-thumb.webp`;
      } else {
        await writeFile(`${CONTENT_DIR}/files/${fileInsert.insertId}${ext}`, file.buffer)
      }
    } catch (e) {
      console.log(e)
      await sql.set(`DELETE FROM file WHERE fileId = :id`, { id: fileInsert.insertId })
      return error(500, "Failed to write to disk, removed record");
    }

    await sql.set(`UPDATE file SET
      mime = :mime,
      name = :name,
      filename = :filename,
      thumb = :thumb
      WHERE fileId = :fileId`, newObj);

    return json({});

  } catch (e) {
    console.log(e);
  }

};


function decode(dataURI: string) {
  let mimeSearch = dataURI.match(/^data:([\w]+\/[-+\w\d]+);base64,/);
  if (mimeSearch === null || mimeSearch.length < 2) throw "nah she's fucked ay"

  const data = dataURI.substring(dataURI.indexOf(',') + 1)

  return {
    mime: mimeSearch[1],
    buffer: Buffer.from(data, 'base64')
  };
}