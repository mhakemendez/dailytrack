# Task 001 — Database Schema

**Project:** DailyTrack  
**Status:** APPROVED  
**Assigned To:** Full-Stack Developer  
**Priority:** High

## Objective

Implement the initial Prisma database schema for DailyTrack.

## Requirements

### User Model
- UUID primary key
- Name
- Unique email
- Password hash
- Created timestamp
- Updated timestamp

### Task Model
- UUID primary key
- User relationship
- Title
- Optional description
- Scheduled date
- Completion status
- Created timestamp
- Updated timestamp

## Database Rules
- One user can have multiple tasks.
- Each task belongs to exactly one user.
- Deleting a user must delete their associated tasks.
- Use appropriate PostgreSQL types and indexes.
- Follow the existing Prisma configuration.

## Scope
- Prisma schema
- Database migration
- Prisma Client generation

## Out of Scope
- Authentication implementation
- API endpoints
- Frontend implementation

## Acceptance Criteria
- [ ] Prisma schema validation passes.
- [ ] Prisma Client generates successfully.
- [ ] Database migration succeeds.
- [ ] User-task relationship is correctly configured.
- [ ] No unrelated files are modified.

## Developer Instructions
1. Read `AGENTS.md`.
2. Read this task file.
3. Inspect existing Prisma configuration.
4. Implement only the approved requirements.
5. Run the required verification commands.
6. Report any blockers instead of guessing.
7. Do not expose database credentials.

## Completion Report
- Files created or modified:
- Implementation summary:
- Commands executed:
- Verification results:
- Remaining issues:

**Final Status:** Awaiting Project Manager review.