import { building } from '$app/environment';
import { DB_FILE, SESSION_LENGTH } from '$env/static/private';
import { checkDb, sql } from '$lib/db';
import { testMailer } from '$lib/email';
import { NodeSqliteProvider } from '$lib/node-sqlite-provider';
import type { Handle } from '@sveltejs/kit';
import { SessionManager } from 'mega-session';

if (!building) checkDb(DB_FILE, 'migrate');
let sm = new SessionManager(new NodeSqliteProvider(sql.db), {
	cookieName: 'send_help_session_id',
	version: '1',
	timeoutMillis: Number(SESSION_LENGTH),
});
await sm.init();
await testMailer();

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.session = await sm.startSession(event.cookies.get(sm.options.cookieName));

	const response = await resolve(event);

	response.headers.set('set-cookie', await sm.saveSession(event.locals.session));

	return response;
};
