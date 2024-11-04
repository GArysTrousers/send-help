import { writable, type Writable } from "svelte/store";
import type { DbTeam, DbTicketStatus, DbTicketType, DbUser } from "./types/db";

export const user: Writable<DbUser | null> = writable(null)

export const teams: Writable<DbTeam[]> = writable([])
export const ticketTypes: Writable<DbTicketType[]>  = writable([])
export const ticketStatuses: Writable<DbTicketStatus[]>  = writable([])