CREATE DATABASE lexorank;

USE lexorank;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS characters;

CREATE TABLE characters (
  id            uuid            DEFAULT     gen_random_uuid() NOT NULL PRIMARY KEY UNIQUE,
  name          varchar(256)    NOT NULL,
  rankorder     varchar(30)     NOT NULL,
  dateCreated   timestamptz     DEFAULT     NOW()
);
