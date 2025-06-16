import { permission } from '$lib/auth';
import { sql } from '$lib/db';
import type { DbTeam, DbTicketStatus, DbTicketType } from '$lib/types/db';
import type { LayoutServerLoad } from './$types';
import { CUSTOM_ORG_NAME } from '$env/static/private';

export const load: LayoutServerLoad = async ({ locals }) => {
  permission(locals.session);
  const ticketTypes = sql.get<DbTicketType>('SELECT * FROM ticket_type')
  const teams = sql.get<DbTeam>('SELECT * FROM team')
  const ticketStatuses = sql.get<DbTicketStatus>('SELECT * FROM ticket_status')
  return { 
    orgName: CUSTOM_ORG_NAME,
    session: locals.session,
    ticketTypes,
    teams,
    ticketStatuses,
  }
};