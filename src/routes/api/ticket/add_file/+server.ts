import { error, json } from '@sveltejs/kit';
import { z } from "zod";
import { sql } from "$lib/db";
import { CONTENT_DIR } from '$env/static/private';
import sharp from "sharp";

const schema = {
  body: z.object({
    data: z.string(),
    name: z.string(),
  })
}

export async function POST({ request }) {
  let body = schema.body.parse(await request.json());
  try {
    let file = decode(body.data)
    let res = await sql.set(`INSERT INTO file () VALUES ()`)
    if (res.affectedRows === 0) return error(500, "Couldn't record file")
    try {
      await sharp(file.buffer)
        .webp()
        .toFile(`${CONTENT_DIR}/${res.insertId}.webp`)
      await sharp(file.buffer)
        .resize(300, 300, { fit: 'outside' })
        .webp()
        .toFile(`${CONTENT_DIR}/${res.insertId}-thumb.webp`)
      let newObj = {
        fileId: res.insertId,
        mime: `image/webp`,
        name: `${res.insertId}.webp`,
        thumb: `${res.insertId}-thumb.webp`,
      }
      await sql.set(`UPDATE file SET
        mime = :mime, 
        name = :name, 
        thumb = :thumb
        WHERE fileId = :fileId`, newObj)
      return json(newObj);
    } catch (e) {
      console.log(e)
      await sql.set(`DELETE FROM file WHERE fileId = :id`, { id: res.insertId })
      return error(500, "Failed to write to disk, removed record");
    }
  } catch (error) { console.log(error) }

};


function decode(dataURI: string) {
  console.log(dataURI.substring(0, 50));
  if (!/data:image\//.test(dataURI))
    throw 'Not an image'

  let res = dataURI.match('data:(image/.*);base64,(.*)');
  if (res && res.length > 2)
    return {
      mime: res[1],
      buffer: Buffer.from(res[2], 'base64')
    };
  else throw "nah she's fucked ay"
}