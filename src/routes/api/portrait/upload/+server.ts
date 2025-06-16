import { error, json, type RequestHandler } from '@sveltejs/kit';
import { z } from "zod";
import { CONTENT_DIR } from '$env/static/private';
import sharp from "sharp";
import { parse } from "node:path";

const schema = {
  body: z.object({
    data: z.string(),
    name: z.string(),
  })
}

export const POST: RequestHandler = async ({ request, url }) => {
  let body = schema.body.parse(await request.json());
  try {
    let filename = parse(body.name);
    let image = decode(body.data);
    try {
      await sharp(image.buffer)
        .resize(200, 200, { fit: 'outside' })
        .webp()
        .toFile(`${CONTENT_DIR}/portraits/${filename.name.toLowerCase()}.webp`)
      return json({});
    } catch (e) {
      console.log(e)
      error(500, "Failed to write image to disk");
    }
  } catch (error) { console.log(error) }
  error(500)
};


function decode(dataURI: string) {
  if (!/data:image\//.test(dataURI))
    throw 'Not an image'

  let res = dataURI.match('data:(image/.*);base64,(.*)');
  if (res && res.length > 2)
    return {
      filetype: res[1].split('/')[1],
      data: res[2],
      buffer: Buffer.from(res[2], 'base64')
    };
  else throw "nah she's fucked ay"
}