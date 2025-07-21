
INSERT INTO `team` (`teamId`, `name`) VALUES
	(1, 'ICT'),
	(2, 'Maintenance');

INSERT INTO `ticket_status` (`ticketStatusId`, `name`) VALUES
	(1, 'Open'),
	(2, 'In Progress'),
	(3, 'On Hold'),
	(4, 'Completed');

INSERT INTO `ticket_type` (`ticketTypeId`, `name`, `teamId`) VALUES
	(1, 'Issue', 1),
	(2, 'Request', 1),
  (3, 'Buildings & Grounds', 2),
	(4, 'Health & Safety', 2);

INSERT INTO `user` (`userId`, `passhash`, `fn`, `ln`, `email`, `permissions`, `src`) VALUES
	('admin', '', 'Mr', 'Manager', '', 0, 'local');

INSERT INTO `user_team` (`userId`, `teamId`) VALUES
	('admin', 1);

