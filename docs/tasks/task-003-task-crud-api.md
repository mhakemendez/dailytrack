# Task 003 — Task CRUD API

**Status:** Draft — Awaiting Approval  
**Priority:** High  
**Assigned To:** Full-Stack Developer  
**Workspace:** `apps/api`

## 1. Objective

Implement the Task CRUD REST API using the existing NestJS, Prisma, PostgreSQL, and authentication setup.

Users must only be able to access and manage their own tasks.

## 2. Dependencies

- Task 001 — Database Schema
- Task 002 — Authentication

## 3. API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/tasks` | Create a task |
| GET | `/tasks` | List the authenticated user's tasks |
| GET | `/tasks/:id` | Get a specific task |
| PATCH | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

## 4. Functional Requirements

### Create Task
- Accept title, optional description, and scheduled date.
- Set the task owner using the authenticated user's ID.
- Default completion status to `false`.

### List Tasks
- Return only tasks belonging to the authenticated user.
- Support filtering by scheduled date.
- Do not expose another user's tasks.

### Get Task
- Return a specific task by ID.
- Allow access only to its owner.

### Update Task
- Allow updating title, description, scheduled date, and completion status.
- Allow only the task owner to update it.

### Delete Task
- Allow only the task owner to delete it.

## 5. Technical Requirements

- Use the existing JWT authentication guard.
- Protect all task endpoints.
- Use DTOs and `class-validator` for request validation.
- Use Prisma for database operations.
- Never trust a client-provided `userId`.
- Return appropriate HTTP status codes and error responses.
- Keep implementation consistent with the existing API structure.

## 6. Out of Scope

- Recurring tasks
- Reminders and notifications
- Task sharing or collaboration
- Categories and tags
- File attachments
- Pagination

## 7. Acceptance Criteria

- [ ] Authenticated users can create tasks.
- [ ] Users can retrieve their own tasks.
- [ ] Users can filter tasks by scheduled date.
- [ ] Users can retrieve an individual task.
- [ ] Users can update their own tasks.
- [ ] Users can delete their own tasks.
- [ ] Users cannot access or modify another user's tasks.
- [ ] Unauthenticated requests are rejected.
- [ ] Invalid request data is rejected.
- [ ] Existing authentication functionality remains unchanged.

**Testing and verification are not part of the developer's responsibility.** These criteria will be verified through manual testing and independent QA.

## 8. Developer Instructions

1. Read `AGENTS.md`.
2. Read this assigned task file.
3. Inspect only relevant API files and existing authentication/database functionality.
4. Implement only the approved requirements.
5. Reuse the existing authentication and database functionality.
6. Do not modify frontend files.
7. Do not create or run Jest tests.
8. Do not run lint, build, or any other testing commands.
9. Do not commit, push, or merge.
10. Provide an implementation report listing:
    - Files created or modified
    - Completed API endpoints
    - Implementation details
    - Remaining issues or blockers

## 9. Completion Workflow

1. Project Owner approves this task.
2. Full-Stack Developer implements the task.
3. Developer submits the implementation report.
4. Project Owner performs manual testing.
5. QA Engineer independently verifies the implementation.
6. Project Owner approves the result.
7. Project Owner handles Git commit and push.