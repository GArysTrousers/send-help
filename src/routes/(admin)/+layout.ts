import { teams, ticketStatuses, ticketTypes, user } from '$lib/stores';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data }) => {
  teams.set(data.teams)
  ticketTypes.set(data.ticketTypes)
  ticketStatuses.set(data.ticketStatuses)
  user.set(data.session.data.user)
  return {
    orgName: data.orgName,
    user: data.session.data.user
  }
};