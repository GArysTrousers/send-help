import { error, json, type RequestHandler } from '@sveltejs/kit';
import { z } from "zod";
import { sql } from "$lib/db";
import { permission } from '$lib/auth.js';

const schema = {
  body: z.object({
    message: z.string(),
    ticketId: z.number(),
  })
}

export const POST: RequestHandler = async ({ request, locals }) => {
  permission(locals.session)
  let body = schema.body.parse(await request.json());
  try {
    sql.set(`
      INSERT INTO comment (message, ticketId, userId, created) 
      VALUES (:message, :ticketId, :userId, :created)`, {
        ...body,
        userId: locals.session.data.user.userId,
        created: Date.now()
      })
  } catch (e) {
    console.log(e)
  }

  return json({});
};
