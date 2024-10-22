import { writable, type Writable } from "svelte/store";
import type { DbTeam, DbTicketStatus, DbTicketType } from "./types/db";

export const teams: Writable<DbTeam[]> = writable([])
export const ticketTypes: Writable<DbTicketType[]>  = writable([])
export const ticketStatuses: Writable<DbTicketStatus[]>  = writable([])