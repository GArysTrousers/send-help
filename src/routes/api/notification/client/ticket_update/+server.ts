import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sendEmail } from '$lib/email';
import { z } from 'zod';
import { permission } from '$lib/auth';
import { sql } from '$lib/db';
import type { DbTicket, DbUser } from '$lib/types/db';
import { URL } from '$env/static/private';

const schema = {
	body: z.object({
		ticketId: z.number()
	})
};

export const POST: RequestHandler = async ({ request, locals }) => {
	permission(locals.session, ['admin']);
	let body = schema.body.parse(await request.json());

	let ticket = sql.getOne<DbTicket & DbUser>(
		`SELECT * FROM ticket t 
    INNER JOIN user u ON u.userId = t.owner
    WHERE ticketId = :ticketId`,
		{ ticketId: body.ticketId }
	);

	if (ticket === null) error(400, 'Ticket not found');

	await sendEmail({
		to: ticket.email,
		subject: `Ticket Updated: #${ticket.ticketId}`,
		html: `Your ticket has been updated. <a href="${URL}/my?=${ticket.ticketId}">Click here to go to your ticket</a>`
	});
	return json({});
};
