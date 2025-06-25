import { error, redirect } from '@sveltejs/kit';
import { ZodError, z } from "zod";
import type { RequestHandler } from './$types';
import { readFile } from "node:fs/promises";
import { CONTENT_DIR } from '$env/static/private';


export const GET: RequestHandler = async ({ params, request, locals, url }) => {
  const { filename } = params

  try {
    let data = await readFile(`${CONTENT_DIR}/portraits/${filename}`)
    return new Response(data, {
      headers: {
        'Content-Type': 'img/*'
      }
    })
  } catch (e) {
    redirect(307, '/no_portrait.jpg');
  }
};