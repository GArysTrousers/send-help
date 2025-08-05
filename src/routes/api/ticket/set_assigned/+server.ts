import { error, json } from '@sveltejs/kit';
import { z } from 'zod';
import { sql } from '$lib/db';
import { permission } from '$lib/auth.js';
import { notifyTeamTicketAssigned, sendEvent } from '$lib/notify.js';

const schema = {
	body: z.object({
		ticketId: z.number(),
		assigned: z.array(z.string()),
	}),
};

export async function POST({ request, locals }) {
	permission(locals.session, ['admin']);
	let body = schema.body.parse(await request.json());
  let newMembers: string[] = []
	try {
		const current = sql.get('SELECT * FROM user_assigned WHERE ticketId = :ticketId', {ticketId: body.ticketId}).map((v) => v.userId);
    for (const c of current) {
      if (!body.assigned.includes(c)) {
        sql.set('DELETE FROM user_assigned WHERE ticketId = :ticketId AND userId = :userId', {ticketId: body.ticketId, userId: c})
      }
    }
    for (const a of body.assigned) {
      if (!current.includes(a)) {
        sql.set('INSERT INTO user_assigned (ticketId, userId) VALUES (:ticketId, :userId)', {ticketId: body.ticketId, userId: a})
        newMembers.push(a)
      }
    }
    await notifyTeamTicketAssigned(body.ticketId, newMembers);
		return json({});
	} catch (e) {
		console.log(e);
		throw error(500);
	}
}
