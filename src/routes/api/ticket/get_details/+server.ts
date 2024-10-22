import { error, json } from '@sveltejs/kit';
import { z } from "zod";
import { sql } from "$lib/db";
import { permission } from '$lib/auth.js';
import type { DbTicket, DbUser } from '$lib/types/db';

const schema = {
  body: z.object({
    ticketId: z.number(),
  })
}

export async function POST({ request, locals }) {
  permission(locals.session)
  let body = schema.body.parse(await request.json());
  try {
    const ticket = await sql.getOne(`
      SELECT * FROM ticket
      WHERE ticketId = :ticketId`, body)
    const user = await sql.getOne(`
      SELECT * FROM user
      WHERE userId = :userId`, { userId: ticket.owner })

    return json({ ticket, user })
  } catch (e) {
    console.log(e)
    throw error(500)
  }
};

export type TicketDetails = {
  ticket: DbTicket;
  user: DbUser;
};