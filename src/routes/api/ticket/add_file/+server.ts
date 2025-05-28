import { error, json, type RequestHandler } from '@sveltejs/kit';
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

export const POST: RequestHandler = async ({ request, locals }) => {
  let body = schema.body.parse(await request.json());
  try {
    let file = decode(body.data)
    const ext = extname(body.name)

    let commentInsert = sql.set(`INSERT comment (message, userId, ticketId)
      VALUES (:message, :userId, :ticketId)`, {
      message: '',
      userId: locals.session.data.user.userId,
      ticketId: body.ticketId,
    })
    let fileInsert = sql.set(`INSERT INTO file (commentId) VALUES (:commentId)`, {
      commentId: commentInsert.lastInsertRowid
    });

    if (fileInsert.changes === 0) return error(500, "Couldn't record file")

    let newObj: DbFile = {
      mime: file.mime,
      name: basename(body.name),
      filename: `${fileInsert.lastInsertRowid}${ext}`,
      thumb: null,
      commentId: Number(commentInsert.lastInsertRowid),
      fileId: Number(fileInsert.lastInsertRowid),
    }
    try {
      if (file.mime.match('image/.*')) {
        await sharp(file.buffer)
          .webp()
          .toFile(`${CONTENT_DIR}/files/${fileInsert.lastInsertRowid}.webp`);
        await sharp(file.buffer)
          .resize(300, 300, { fit: 'outside' })
          .webp()
          .toFile(`${CONTENT_DIR}/files/${fileInsert.lastInsertRowid}-thumb.webp`);
        newObj.mime = 'image/webp';
        newObj.filename = `${fileInsert.lastInsertRowid}.webp`;
        newObj.thumb = `${fileInsert.lastInsertRowid}-thumb.webp`;
      } else {
        await writeFile(`${CONTENT_DIR}/files/${fileInsert.lastInsertRowid}${ext}`, file.buffer)
      }
    } catch (e) {
      console.log(e)
      sql.set(`DELETE FROM file WHERE fileId = :id`, { id: fileInsert.lastInsertRowid })
      return error(500, "Failed to write to disk, removed record");
    }

    sql.set(`UPDATE file SET
      mime = :mime,
      name = :name,
      filename = :filename,
      thumb = :thumb
      WHERE fileId = :fileId`, newObj);

    return json({});

  } catch (e) {
    console.log(e);
  }
  return error(500)
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