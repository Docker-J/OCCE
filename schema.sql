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

CREATE TABLE IF NOT EXISTS fcm_tokens (
  token TEXT PRIMARY KEY,
  sub TEXT,
  roles TEXT DEFAULT '[]',
  expires_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_fcm_tokens_sub ON fcm_tokens(sub);
CREATE INDEX IF NOT EXISTS idx_fcm_tokens_expires ON fcm_tokens(expires_at);

CREATE INDEX IF NOT EXISTS idx_announcements_pin_timestamp ON Announcements(pin, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_timestamp ON Announcements(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_columns_timestamp ON Columns(timestamp DESC);

CREATE TABLE IF NOT EXISTS Albums (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  cover TEXT NOT NULL,
  images TEXT NOT NULL,
  year INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_albums_year_timestamp ON Albums(year, timestamp DESC, id DESC);
CREATE INDEX IF NOT EXISTS idx_albums_timestamp ON Albums(timestamp DESC, id DESC);

CREATE TABLE IF NOT EXISTS MeditationON (
  id TEXT PRIMARY KEY,
  timestamp TEXT NOT NULL,
  cover TEXT NOT NULL,
  images TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_meditationon_timestamp ON MeditationON(timestamp DESC, id DESC);


