import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sql } from '$lib/db';
import { permission } from '$lib/auth';
import { z } from 'zod';

const schema = {
	body: z.object({
		searchText: z.string(),
	}),
};

export const POST: RequestHandler = async ({ request, locals }) => {
	permission(locals.session, ['admin']);
	let body = schema.body.parse(await request.json());
	body.searchText = `%${body.searchText}%`;
	let res = sql.get(
		`SELECT * FROM user
    WHERE fn LIKE :searchText
    OR ln LIKE :searchText`,
		body,
	);

	return json(res);
};
