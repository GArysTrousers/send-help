import { error, json } from '@sveltejs/kit';
import { z } from "zod";
import { sql } from "$lib/db";
import { permission } from '$lib/auth.js';

const schema = {
  body: z.object({
    teamId: z.number(),
    typeId: z.number(),
    subject: z.string(),
    message: z.string(),
    priority: z.number(),
    risk: z.number(),
  })
}

export async function POST({ request, locals }) {
  permission(locals.session)
  let body = schema.body.parse(await request.json());
  try {
    await sql.set(`
      INSERT INTO ticket (teamId, typeId, subject, message, priority, risk, statusId, owner) 
      VALUES (:teamId, :typeId, :subject, :message, :priority, :risk, 1, :owner)`, {
        ...body,
        owner: locals.session.data.user.userId
      })
  } catch (error) {
    console.log(error)
  }

  return json({});
};
