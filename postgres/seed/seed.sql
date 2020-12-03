-- Seed data with a fake user for testing

insert into users (name, email, entries, joined, phone, age) values ('mog', 'a@a.com', 4, '2021-01-01','054332152', 23 );
insert into users (name, email, entries, joined, phone, age) values ('avishai', 'avishai@a.com', 5, '2021-01-01','054332152', 23 );
insert into users (name, email, entries, joined, phone, age) values ('mor', 'mor@a.com', 7, '2021-01-01','054332152', 23 );
insert into users (name, email, entries, joined, phone, age) values ('candy', 'candy@a.com', 3, '2021-01-01','054332152', 23 );
insert into users (name, email, entries, joined, phone, age) values ('nir', 'nir@a.com', 2, '2021-01-01','054332152', 23 );
insert into users (name, email, entries, joined, phone, age) values ('gal', 'gal@a.com', 1, '2021-01-01','054332152', 23 );

insert into login (hash, email) values ('$2a$10$WAK21U0LWl7C//jJ.DOB2uPP1DJQh7KUDgasdyQeGzkop2Pzl8W7u', 'a@a.com');

COMMIT;