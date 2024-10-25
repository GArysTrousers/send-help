import { error, json, redirect } from '@sveltejs/kit';
import { ZodError, z } from "zod";
import type { RequestHandler } from './$types';
import { readFile } from "node:fs/promises";
import { CONTENT_DIR } from '$env/static/private';
import { sql } from '$lib/db';
import type { DbFile } from '$lib/types/db';

const schema = {
  params: z.object({
    filename: z.string()
  }),
  body: z.object({})
}

export const GET: RequestHandler = async ({ params, request, locals, url }) => {
  const { fileId } = params
  const file = await sql.getOne<DbFile>('SELECT * FROM file WHERE fileId = :fileId', { fileId })
  if (file === null) throw error(404)

  if (file.filename && file.mime) {
    try {
      let data = await readFile(`${CONTENT_DIR}/${file.filename}`)
      return new Response(data, {
        headers: {
          'Content-Type': file.mime
        }
      })
    } catch (e) {
      console.log(e);
      throw error(500)
    }
  } else {
    throw error(500)
  }
};