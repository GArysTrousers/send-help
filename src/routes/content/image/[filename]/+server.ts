import { error, json, redirect } from '@sveltejs/kit';
import { ZodError, z } from "zod";
import type { RequestHandler } from './$types';
import { readFile } from "node:fs/promises";
import { CONTENT_DIR } from '$env/static/private';

const schema = {
  params: z.object({
    filename: z.string()
  }),
  body: z.object({})
}

export const GET: RequestHandler = async ({ params, request, locals, url }) => {
  let filename
  try {
    filename = schema.params.parse(params).filename
  } catch (e) {
    if (e instanceof ZodError)
      console.log("Zod Error @", url.pathname, ...e.errors);
    throw error(400);
  }

  try {
    let data = await readFile(`${CONTENT_DIR}/files/${filename}`)
    return new Response(data, {
      headers: {
        'Content-Type': 'image/*'
      }
    })
  } catch (e) {
    throw error(404);
  }
};