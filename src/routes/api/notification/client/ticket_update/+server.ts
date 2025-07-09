import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { z } from 'zod';
import { permission } from '$lib/auth';
import { notifyTicketUpdated } from '$lib/notify';

const schema = {
	body: z.object({
		ticketId: z.number()
	})
};

export const POST: RequestHandler = async ({ request, locals }) => {
	permission(locals.session, ['admin']);
	let body = schema.body.parse(await request.json());

	await notifyTicketUpdated(body.ticketId)

	return json({});
};
