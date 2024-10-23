import { permission } from '$lib/auth';
import { sql } from '$lib/db';
import type { DbTeam, DbTicketStatus, DbTicketType } from '$lib/types/db';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  permission(locals.session);
  const ticketTypes = await sql.get<DbTicketType>('SELECT * FROM ticket_type')
  const teams = await sql.get<DbTeam>('SELECT * FROM team')
  const ticketStatuses = await sql.get<DbTicketStatus>('SELECT * FROM ticket_status')
  return { 
    session: locals.session,
    ticketTypes,
    teams,
    ticketStatuses,
  }
};