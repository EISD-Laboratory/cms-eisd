# Organization Website — Headless CMS

## Purpose

This project is a **Headless CMS built specifically for a single organization's website**. It exists so an admin can manage dynamic content — starting with Events, Medium Articles, and member Achievements — without ever needing to touch or redeploy the public website's own codebase.

Before this CMS, any content update would mean a code change on the public site. This project separates "content" from "code": the admin manages content through a dedicated dashboard, and the public website simply reads Events, Articles, and Achievements through a read-only API.

## Overview

- **What it manages (V1):** Events (with images, dates, location, rich description), references to Medium articles (auto-populated from a pasted URL, no manual data entry), and member Achievements (competition records with category, level, result, and per-member assistant codes, summarized on the dashboard).
- **Who uses it:** a single admin (V1), managing content that then appears on the public-facing organization website.
- **What it deliberately avoids:**
  - The public website never scrapes Medium directly — the CMS fetches and caches article metadata once, at save time.
  - Images are never stored on the application server — they live in dedicated object storage, and the database only holds references to them.
  - Event status (Incoming / On Going / Finished) is never manually set — it's always computed from the event's start and end dates.

## High-Level Architecture (conceptual)

```
Admin
  │
  ▼
CMS Dashboard  ──▶  API layer  ──▶  Database
                        │
                        ▼
                 Object Storage (images)
                        │
                        ▼
              Public Website (read-only consumer)
```

The public website is a read-only consumer of published content — it has no write access and no scraping responsibility of its own.

## Project Status

Currently past planning and into **V1 implementation**. V1 scope covers Mock Login, Dashboard, Event Management, Medium Article Management, and Achievement Management. Achievements are specified in [`openspec/specs/achievements/`](./openspec/specs/achievements/) with database schema plus seeds and a mock-mode frontend; the backend API is still pending. See:

- [`PLAN_V1.md`](./docs/PLAN_V1.md) — the detailed V1 product requirements and information architecture.
- [`ROADMAP.md`](./docs/ROADMAP.md) — the rough plan from V1 through V4.

## Design Philosophy

The core principle across every version of this project: **keep V1 simple and fast to finish, but shape all data structures so future versions (Gallery expansion, organizational content, governance features, AI tooling) can be added without major migrations.**

Technology stack decisions are intentionally excluded from this documentation for now and will be addressed separately.

## Access

Sign-in is a frontend-local mock: submitting any non-empty username and
password on the Login view creates a mock session (persisted in
`localStorage`) and navigates to the dashboard. Logout clears it and returns
to `/login`. There are no roles and no backend session — every visitor who
signs in sees all actions, and route guards check only the local mock flag.