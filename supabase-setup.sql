-- =============================================
-- Orbit: Supabase Setup
-- Run this in the Supabase SQL Editor
-- =============================================

-- 1. Create the events table
create table events (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  image         text not null default '/images/home-card-others.svg',
  event_date    timestamptz not null,
  upload_date   timestamptz not null default now(),
  district      text not null,
  people        integer not null default 2,
  views         integer not null default 0,
  rewards       integer,
  featured      boolean not null default false,
  category      text,
  subcategory   text,
  gender        text default 'anyone',
  age_from      integer,
  age_to        integer,
  time_from     text,
  time_to       text,
  location      text,
  max_people    integer default 2,
  description   text
);

-- 2. Disable RLS for prototype (no auth)
alter table events disable row level security;

-- 3. Seed data (the 18 original activities)
insert into events (title, image, event_date, upload_date, district, people, views, rewards, featured) values
  ('Dragon''s Back Hiking',            '/images/home-card-hiking.jpg',    '2025-01-10T19:00:00Z', '2025-01-05T10:00:00Z', 'Southern',           2,  342,  300,  true),
  ('Kayaking to Sharp Island',         '/images/home-card-hiking.jpg',    '2025-01-11T18:00:00Z', '2025-01-04T14:30:00Z', 'Sai Kung',           4,  518,  1000, false),
  ('Sunset Yoga at Repulse Bay',       '/images/home-card-yoga.jpg',      '2025-01-12T17:30:00Z', '2025-01-06T11:00:00Z', 'Southern',           8,  621,  400,  false),
  ('Anyone down for Running?',         '/images/home-card-racket.jpg',    '2025-01-10T13:00:00Z', '2025-01-07T20:15:00Z', 'Kwun Tong',          10, 83,   250,  false),
  ('Morning Tai Chi at Victoria Park', '/images/home-card-yoga.jpg',      '2025-01-09T07:00:00Z', '2025-01-03T15:00:00Z', 'Wan Chai',           15, 204,  500,  false),
  ('Kowloon City Book Club',           '/images/home-card-bookclub.jpg',  '2025-01-13T19:30:00Z', '2025-01-06T09:00:00Z', 'Kowloon City',       6,  175,  350,  false),
  ('Jazz Night at Fringe Club',        '/images/home-card-jazz.jpg',      '2025-01-11T20:00:00Z', '2025-01-04T18:00:00Z', 'Central & Western',  12, 489,  500,  true),
  ('Architecture Walk: Central Heritage', '/images/home-card-jazz.jpg',   '2025-01-14T10:00:00Z', '2025-01-07T12:00:00Z', 'Central & Western',  8,  231,  300,  false),
  ('Pottery Workshop at PMQ',          '/images/home-card-pottery.jpg',   '2025-01-12T14:00:00Z', '2025-01-05T20:00:00Z', 'Central & Western',  6,  312,  400,  false),
  ('Hackathon: Build for Good',        '/images/home-card-hackathon.jpg', '2025-01-18T09:00:00Z', '2025-01-06T14:00:00Z', 'Sha Tin',            20, 754,  800,  false),
  ('Photography Walk: Neon Signs',     '/images/home-card-pottery.jpg',   '2025-01-11T19:00:00Z', '2025-01-07T16:30:00Z', 'Yau Tsim Mong',      5,  267,  200,  true),
  ('Cooking Class: Dim Sum 101',       '/images/home-card-pottery.jpg',   '2025-01-15T11:00:00Z', '2025-01-08T10:00:00Z', 'Wan Chai',           8,  398,  450,  false),
  ('Open Mic & Jam Session',           '/images/home-card-pottery.jpg',   '2025-01-16T20:00:00Z', '2025-01-09T11:00:00Z', 'Yau Tsim Mong',      15, 445,  500,  false),
  ('Board Games Night',                '/images/home-card-language.jpg',  '2025-01-10T18:30:00Z', '2025-01-06T19:00:00Z', 'Yau Tsim Mong',      10, 192,  350,  false),
  ('Beach Clean-up at Shek O',         '/images/home-card-cleanup.jpg',   '2025-01-13T08:00:00Z', '2025-01-07T08:00:00Z', 'Southern',           25, 530,  1200, true),
  ('Language Exchange Café',           '/images/home-card-language.jpg',  '2025-01-12T15:00:00Z', '2025-01-05T13:00:00Z', 'Wan Chai',           12, 318,  600,  false),
  ('City Walk: Hidden Temples',        '/images/home-card-language.jpg',  '2025-01-14T14:00:00Z', '2025-01-08T17:00:00Z', 'Sham Shui Po',       7,  143,  250,  false),
  ('Stargazing Night at Sai Kung',     '/planet-heart.svg',               '2025-01-17T20:00:00Z', '2025-01-09T22:00:00Z', 'Sai Kung',           10, 687,  150,  false);
