
import { sql } from '$lib/db';
import type { DbTicket } from '$lib/types/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const tickets = sql.get<DbTicket>(`SELECT * FROM ticket WHERE statusId < 4`)
  return { 
    tickets,
  }
};