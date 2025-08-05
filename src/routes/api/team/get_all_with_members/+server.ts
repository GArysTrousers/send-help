import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sql } from '$lib/db';
import { permission } from '$lib/auth';
import type { DbTeam, DbUserTeam, DbUser } from '$lib/types/db';

export const POST: RequestHandler = async ({ request, locals }) => {
	permission(locals.session, ['admin']);

	let teams = sql.get<DbTeam>(`SELECT * FROM team`);
	let members = sql.get<DbUserTeam & DbUser>(`
    SELECT * FROM user_team u_t
    INNER JOIN user u ON u.userId = u_t.userId`);

	let res = teams.map((team) => ({
		...team,
		members: members.filter((user) => user.teamId === team.teamId),
	}));

	return json(res);
};

export type ResponseType = {
	members: (DbUserTeam & DbUser)[];
	name: string;
	teamId: number;
}[];
