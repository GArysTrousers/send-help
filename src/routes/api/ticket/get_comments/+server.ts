import { error, json } from '@sveltejs/kit';
import { z } from "zod";
import { sql } from "$lib/db";
import { permission } from '$lib/auth.js';
import type { DbComment, DbFile } from '$lib/types/db.js';

const schema = {
  body: z.object({
    ticketId: z.number(),
  })
}

export async function POST({ request, locals }) {
  permission(locals.session)
  let body = schema.body.parse(await request.json());
  try {
    const comments = await sql.get<CommentWithFile>(`
      SELECT * FROM comment c
      LEFT JOIN file f on f.commentId = c.commentId
      WHERE ticketId = :ticketId`, body)

    return json(comments)
  } catch (e) {
    console.log(e)
    throw error(500)
  }
};

export interface CommentWithFile extends DbComment, DbFile {

}