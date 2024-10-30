import { error, json } from '@sveltejs/kit';
import { z } from "zod";
import { sql } from "$lib/db";
import { permission } from '$lib/auth.js';

const schema = {
  body: z.object({
    ticketId: z.number(),
    statusId: z.number(),
    priority: z.number(),
    risk: z.number(),
  })
}

export async function POST({ request, locals }) {
  permission(locals.session)
  let body = schema.body.parse(await request.json());
  try {
    const ticket = await sql.set(`
      UPDATE ticket SET 
      statusId = :statusId,
      priority = :priority,
      risk = :risk
      WHERE ticketId = :ticketId`, body)

    return json({})
  } catch (e) {
    console.log(e)
    throw error(500)
  }
};
