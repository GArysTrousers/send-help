import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { readFile } from "node:fs/promises";
import { CONTENT_DIR } from '$env/static/private';
import { sql } from '$lib/db';
import type { DbFile } from '$lib/types/db';

export const GET: RequestHandler = async ({ params }) => {
  const { fileId } = params
  const file = sql.getOne<DbFile>('SELECT * FROM file WHERE fileId = :fileId', { fileId })
  if (file === null) throw error(404)

  if (file.filename && file.mime) {
    try {
      let data = await readFile(`${CONTENT_DIR}/files/${file.filename}`)
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