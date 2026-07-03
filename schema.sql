-- Schema definition for D1 database local initialization

CREATE TABLE IF NOT EXISTS Announcements (
  id TEXT PRIMARY KEY,
  title TEXT,
  body TEXT,
  images TEXT,
  timestamp TEXT,
  video TEXT,
  pin INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS Columns (
  id TEXT PRIMARY KEY,
  title TEXT,
  body TEXT,
  images TEXT,
  timestamp TEXT
);
