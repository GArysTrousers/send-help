import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sql } from '$lib/db';
import { permission } from '$lib/auth';

export const POST: RequestHandler = async ({ request, locals }) => {
	permission(locals.session);

	let res = sql.get(
		`SELECT * FROM ticket
    WHERE owner = :userId`,
		{ userId: locals.session.data.user.userId },
	);

	return json(res);
};
