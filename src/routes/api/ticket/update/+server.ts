import { error, json } from '@sveltejs/kit';
import { z } from "zod";
import { sql } from "$lib/db";
import { permission } from '$lib/auth.js';
import { sendEvent } from '$lib/notify.js';

const schema = {
  body: z.object({
    ticketId: z.number(),
    statusId: z.number(),
    priority: z.number(),
    risk: z.number(),
    owner: z.string(),
  })
}

export async function POST({ request, locals }) {
  permission(locals.session, ['admin'])
  let body = schema.body.parse(await request.json());
  try {
    const ticket = sql.set(`
      UPDATE ticket SET 
      statusId = :statusId,
      priority = :priority,
      risk = :risk,
      owner = :owner
      WHERE ticketId = :ticketId`, body)
      sendEvent('ticket-update', {
        updater: locals.session.data.user.userId,
        ticketId: body.ticketId
      })
    return json({})
  } catch (e) {
    console.log(e)
    throw error(500)
  }
};
