import { z } from 'zod';
import { sql } from './db';
import { sendEmail } from './email';
import type { DbTicket, DbUser } from './types/db';
import { SITE_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';
import type { Unsafe } from 'sveltekit-sse';

export const eventEmitters = new Set<(eventName: string, data: string) => Unsafe<void, Error>>();

export function sendEvent(eventName: string, data: object) {
	console.log(`clients:${eventEmitters.size} | event:${eventName} | data:${data}`);

	for (const emitter of eventEmitters.values()) {
		try {
			emitter(eventName, JSON.stringify({ ...data, time: Date.now() }));
		} catch (e) {
			console.log(e);
		}
	}
}

const email = z.string().email();

function isEmail(subject: string) {
	try {
		email.parse(subject);
		return true;
	} catch (e) {
		return false;
	}
}

export async function notifyTeamTicketCreated(ticketId: number) {
	const ticket = sql.getOne<DbTicket>(`SELECT * FROM ticket WHERE ticketId = :ticketId`, { ticketId });
	if (ticket === null) error(400, 'No ticket found');

	const teamMembers = sql.get<DbUser>(
		`SELECT u.* FROM user_team u_t
    INNER JOIN user u ON u.userId = u_t.userId
    WHERE u_t.teamId = :teamId`,
		{ teamId: ticket.teamId },
	);
	const toEmails = teamMembers.map((v) => v.email).filter(isEmail);

	const owner = sql.getOne<DbUser>(`SELECT * FROM user WHERE userId = :owner`, { owner: ticket.owner });
	if (owner === null) error(500, 'No owner found');

	if (toEmails.length > 0) {
		await sendEmail({
			to: toEmails.join(','),
			subject: `Ticket Created #${ticket.ticketId}: ${ticket.subject}`,
			html: `${owner.fn} ${owner.ln} created a ticket.<br><br><a href="${SITE_URL}/tickets?=${ticket.ticketId}">Click here to go to the ticket</a>`,
		});
	}
}

export async function notifyTeamTicketUpdated(ticketId: number) {
	const ticket = sql.getOne<DbTicket>(`SELECT * FROM ticket WHERE ticketId = :ticketId`, { ticketId });
	if (ticket === null) error(400, 'No ticket found');

	const teamMembers = sql.get<DbUser>(
		`SELECT u.* FROM user_team u_t
    INNER JOIN user u ON u.userId = u_t.userId
    WHERE u_t.teamId = :teamId`,
		{ teamId: ticket.teamId },
	);
	const toEmails = teamMembers.map((v) => v.email).filter(isEmail);

	const owner = sql.getOne<DbUser>(`SELECT * FROM user WHERE userId = :owner`, { owner: ticket.owner });
	if (owner === null) error(500, 'No owner found');

	if (toEmails.length > 0) {
		await sendEmail({
			to: toEmails.join(','),
			subject: `Comment Added #${ticket.ticketId}: ${ticket.subject}`,
			html: `${owner.fn} ${owner.ln} added a comment.<br><br><a href="${SITE_URL}/tickets?=${ticket.ticketId}">Click here to go to the ticket</a>`,
		});
	}
}

export async function notifyTicketUpdated(ticketId: number) {
	let ticket = sql.getOne<DbTicket & DbUser>(
		`SELECT * FROM ticket t 
    INNER JOIN user u ON u.userId = t.owner
    WHERE ticketId = :ticketId`,
		{ ticketId },
	);

	if (ticket === null) error(400, 'Ticket not found');

	await sendEmail({
		to: ticket.email,
		subject: `Ticket Updated: #${ticket.ticketId}`,
		html: `Your ticket has been updated.<br><br><a href="${SITE_URL}/my?=${ticket.ticketId}">Click here to go to your ticket</a>`,
	});
}
