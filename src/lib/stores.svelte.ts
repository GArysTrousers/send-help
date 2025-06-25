import { writable, type Writable } from "svelte/store";
import type { DbTeam, DbTicketStatus, DbTicketType, DbUser } from "./types/db";
import type { User } from "./types/session";

type AppStores = {
  user: User | null;
  teams: DbTeam[];
  ticketTypes: DbTicketType[];
  ticketStatuses: DbTicketStatus[];
}

export const stores: AppStores = $state({
  user: null,
  teams: [],
  ticketTypes: [],
  ticketStatuses: []
})