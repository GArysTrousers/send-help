
import { stores } from '$lib/stores.svelte';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data }) => {
  stores.user = data.session.data.user
  stores.teams = data.teams;
  stores.ticketTypes = data.ticketTypes
  stores.ticketStatuses = data.ticketStatuses
  return {
    orgName: data.orgName,
    user: data.session.data.user
  }
};