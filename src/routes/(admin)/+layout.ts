import { teams, ticketStatuses, ticketTypes } from '$lib/stores';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data }) => {
  teams.set(data.teams)
  ticketTypes.set(data.ticketTypes)
  ticketStatuses.set(data.ticketStatuses)
  return {
    orgName: data.orgName,
    user: data.session.data.user
  }
};