/*
* This file was generated by a tool.
* Rerun sql-ts to regenerate this file.
*/
export interface DbComment {
  'commentId': number;
  'created': Date;
  'message': string;
  'ticketId': number;
  'userId': string;
}
export interface DbFile {
  'commentId': number;
  'fileId': number;
  'filename': string | null;
  'mime': string | null;
  'name': string | null;
  'thumb': string | null;
}
export interface DbTeam {
  'name': string;
  'teamId': number;
}
export interface DbTicket {
  'created': Date;
  'message': string;
  'owner': string;
  'statusId': number | null;
  'subject': string;
  'teamId': number;
  'ticketId': number;
  'typeId': number;
}
export interface DbTicketStatus {
  'name': string;
  'ticketStatusId': number;
}
export interface DbTicketType {
  'name': string;
  'ticketTypeId': number;
}
export interface DbUser {
  'fn': string;
  'ln': string;
  'permissions': number;
  'userId': string;
}
export interface DbUserTeam {
  'teamId': number;
  'userId': string;
}
