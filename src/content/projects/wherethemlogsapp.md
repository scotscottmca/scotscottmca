---
title: Where Them Logs App
summary: A searchable index of application log file locations for Windows, macOS and Linux - type an app name, copy the exact path.
url: https://wherethemlogs.app
linkLabel: Visit
date: 2026-09-10
status: active
featured: true
tags:
  - Next.js
  - Azure Container Apps
  - Cosmos DB
  - Bicep
  - Endpoint Management
---

![Where Them Logs App - search for any application's log file locations on Windows, macOS and Linux](/images/wherethemlogsapp/promo.png)

[Where Them Logs App](https://wherethemlogs.app) answers one question: **where
does this app write its logs?** Type an app name and you get the path, exactly
as the machine writes it, ready to paste into a terminal, a script or a ticket.

## The idea

Mid-incident, the answer is usually scattered across vendor docs, Stack Overflow
threads and forum posts of unknown vintage. This puts it in one catalogue behind
one search field, with every path normalised into the same shape.

Paths are qualified by **platform, installer type and architecture** - MSI vs
EXE, x86 vs x64, per-user vs per-machine - because that is the difference that
matters when you're packaging an app or chasing a detection rule. Environment
variables like `%LOCALAPPDATA%`, `~/Library/Logs` and `$XDG_STATE_HOME` are kept
verbatim, never expanded into one machine's reality.

## What it does

- Type-ahead search that shows the most likely match as you type
- A platform filter (Windows / macOS / Linux) on the home and results pages
- Results filterable by installer type and architecture
- One-click copy on every path
- Recent searches, kept in your own browser only
- A "Request an app" button that opens a GitHub issue
- An admin portal for curating the catalogue, with bulk import and export

## How it works

One Next.js app runs as a single Azure Container App, with the catalogue in
Cosmos DB and icons in Blob storage. The whole catalogue is held in memory with a
short TTL, so search runs in-process and costs nothing per query.

| Piece | Role |
|-------|------|
| Next.js 15 (App Router) | Public pages, type-ahead API and the admin portal |
| In-memory snapshot | The full catalogue, refreshed every 60 seconds; search runs against it |
| Cosmos DB (serverless) | Vendors, and apps with their log paths embedded |
| Blob storage | App and vendor icons |
| Entra ID | Built-in Container Apps auth; admin role gates the portal |
| Cloudflare | Sits in front of the site; the container only accepts Cloudflare's IPs |

## Curating the catalogue

The admin portal edits vendors, apps and log paths directly. Every write uses
optimistic concurrency: if someone else changed a record since you opened it,
you get a side-by-side comparison instead of silently overwriting their work.

Bulk changes go through an import screen that previews exactly what would be
created, updated or cleared before anything is written. Exporting the catalogue
and importing the same file back plans zero changes, and a script checks that on
demand.

## Deployment

Infrastructure is Bicep, deployed from GitHub Actions. A push to `main` builds
the image in Azure Container Registry and deploys the whole template with it, so
the custom domain and its certificate survive every redeploy.

## Privacy

Google Analytics loads only after you accept the consent bar. Decline, or ignore
it, and nothing from Google loads at all. The privacy page says plainly what is
collected and lets you withdraw consent later.
