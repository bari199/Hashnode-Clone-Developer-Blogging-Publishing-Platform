# Contributing to Hashnode Clone — Developer Blogging & Publishing Platform

Thank you for your interest in contributing to this project.

This repository contains a full-stack developer blogging and publishing platform built as an **internship project at Internmo Pvt. Ltd.** Contributions should preserve the project's existing architecture, security practices, and developer-focused publishing workflow.

## Project Context

- **Project:** Hashnode Clone — Developer Blogging & Publishing Platform
- **Organization:** Internmo Pvt. Ltd.
- **Project Type:** Internship Project
- **Frontend:** React 19 + Vite + Tailwind CSS
- **Backend:** Node.js + Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT + bcryptjs
- **Real-Time:** Socket.IO
- **Media:** Cloudinary + Unsplash
- **AI:** Cloudflare Workers AI

For the complete technical architecture, API documentation, database models, environment variables, and setup instructions, see [`README.md`](./README.md).

---

## Before Contributing

Before making changes:

1. Read the project documentation.
2. Understand the relevant frontend or backend module.
3. Check existing issues and pull requests when applicable.
4. Avoid introducing unnecessary dependencies.
5. Never commit secrets, API keys, tokens, passwords, or `.env` files.
6. Keep changes focused on the issue or feature being addressed.

---

## Getting Started

### Prerequisites

Make sure you have:

- Node.js installed
- npm installed
- MongoDB access
- Git installed
- Required API credentials for features you are working on

### Clone the Repository

```bash
git clone https://github.com/bari199/Hashnode-Clone-Developer-Blogging-Publishing-Platform.git
cd Hashnode-Clone-Developer-Blogging-Publishing-Platform
```

### Install Frontend Dependencies

```bash
cd client
npm install
```

### Install Backend Dependencies

Open another terminal:

```bash
cd server
npm install
```

Configure the required environment variables before running the application. Refer to [`PROJECT_DOCUMENTATION.md`](./PROJECT_DOCUMENTATION.md) for the complete environment-variable list.

---

## Project Structure

The project uses separate client and server applications.

```text
client/
└── src/
    ├── api/
    ├── components/
    ├── context/
    ├── hooks/
    ├── pages/
    ├── socket/
    ├── App.jsx
    └── main.jsx

server/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── socket/
├── utils/
└── server.js
```

Follow the existing separation of concerns:

- **Routes:** Define API routes.
- **Controllers:** Handle request/response logic.
- **Models:** Define MongoDB/Mongoose data structures.
- **Middleware:** Authentication, uploads, and request processing.
- **Services:** External or reusable application services.
- **Socket:** Real-time communication logic.
- **Hooks:** Reusable frontend behavior.
- **Components:** Reusable UI elements.
- **Pages:** Route-level frontend screens.

---

## Branching Strategy

Create a separate branch for each feature, bug fix, or documentation change.

Recommended naming:

```text
feature/<short-description>
fix/<short-description>
docs/<short-description>
refactor/<short-description>
chore/<short-description>
```

Examples:

```text
feature/ai-title-generation
fix/comment-delete
docs/update-api-documentation
refactor/post-controller
```

Avoid doing unrelated work in the same branch.

---

## Making Changes

When implementing a change:

1. Identify the affected module.
2. Follow the existing project structure.
3. Reuse existing components, hooks, utilities, and services where appropriate.
4. Keep authentication and authorization requirements intact.
5. Validate user input where applicable.
6. Handle errors consistently.
7. Update documentation when behavior or APIs change.
8. Test the affected functionality before opening a pull request.

### Frontend Guidelines

- Keep reusable UI logic in components or custom hooks.
- Keep API communication in the existing API layer.
- Avoid duplicating API request logic across components.
- Use the existing routing and context architecture.
- Preserve responsive behavior.
- Keep Markdown rendering and code highlighting behavior intact.

### Backend Guidelines

- Keep routes, controllers, models, middleware, and services separated.
- Use the existing authentication middleware for protected operations.
- Verify resource ownership before update/delete operations.
- Avoid exposing passwords or sensitive user information.
- Keep database queries focused and efficient.
- Do not place credentials directly in source code.

---

## Authentication & Security

This application uses JWT authentication and bcrypt password hashing.

When modifying authenticated functionality:

- Use the existing JWT authentication flow.
- Do not bypass authentication middleware.
- Verify ownership of user-owned resources.
- Do not log passwords, JWTs, API tokens, or other secrets.
- Do not commit `.env` files.
- Use environment variables for credentials.
- Be careful when changing Socket.IO authentication.
- Review security implications before adding new endpoints.

---

## AI and Third-Party Integrations

The project integrates external services including:

- Cloudflare Workers AI
- Cloudinary
- Unsplash
- Google GenAI service present in the repository

When modifying integrations:

- Keep API credentials in environment variables.
- Handle external API failures gracefully.
- Avoid hardcoding provider credentials.
- Document new environment variables.
- Avoid unnecessary provider changes without documenting the reason.

---

## Database Changes

When modifying Mongoose models:

1. Understand existing relationships.
2. Check existing indexes and uniqueness constraints.
3. Consider existing API consumers.
4. Update related controllers and routes when necessary.
5. Update `PROJECT_DOCUMENTATION.md` if the model or API behavior changes.

Be especially careful with models representing:

- Users
- Posts
- Comments
- Bookmarks
- Likes
- Upvotes
- User follows
- Tag follows
- Notifications

---

## API Changes

If adding or changing an API endpoint:

- Use the existing `/api/...` route structure.
- Clearly define the HTTP method and endpoint.
- Apply authentication where required.
- Validate inputs.
- Return consistent HTTP status codes.
- Handle errors appropriately.
- Update `PROJECT_DOCUMENTATION.md`.
- Explain breaking changes in the pull request.

Example:

```text
POST /api/posts
PUT  /api/posts/:id
GET  /api/posts/search?q=<query>
```

---

## Real-Time Features

Socket.IO is used for real-time application updates.

Existing functionality includes events related to:

```text
post:join
post:leave
comment:created
comment:updated
comment:deleted
post:like:updated
post:upvote:updated
follow:updated
notification:new
```

When modifying real-time functionality:

- Preserve authenticated socket connections.
- Use the existing room structure where applicable.
- Avoid unnecessary event duplication.
- Update frontend socket listeners when event payloads change.
- Document new events when they become part of the application contract.

---

## Testing & Verification

Before opening a pull request, verify the affected functionality locally.

At minimum:

- Run the frontend.
- Run the backend.
- Test the changed feature manually.
- Check browser console errors.
- Check backend errors.
- Verify authentication behavior for protected features.
- Verify that existing functionality has not been unintentionally broken.

If automated tests are added in the future, new features and bug fixes should include appropriate tests where practical.

---

## Commit Messages

Use short and descriptive commit messages.

Recommended format:

```text
type: short description
```

Examples:

```text
feat: add AI title generation
fix: resolve comment deletion issue
docs: update API documentation
refactor: simplify post controller
chore: update dependencies
```

Keep each commit focused on a logical change.

---

## Issues

Before creating an issue:

1. Search existing issues.
2. Confirm the problem is reproducible.
3. Include enough information for someone else to understand the issue.

For bug reports, include:

- What happened
- Expected behavior
- Actual behavior
- Steps to reproduce
- Relevant error messages
- Browser/environment information
- Screenshots when useful

For feature requests, explain:

- The problem
- The proposed feature
- Why it would be useful
- Any relevant implementation considerations

Do not include passwords, API keys, tokens, personal information, or other sensitive data in issues.

---

## Pull Requests

Create a pull request after your changes have been tested locally.

A good pull request should include:

- Clear title
- Short description
- What changed
- Why the change was needed
- Testing performed
- Screenshots for relevant UI changes
- API or database changes, if applicable
- Any known limitations or follow-up work

### Pull Request Checklist

Before submitting:

- [ ] Code follows the existing project structure.
- [ ] No secrets or `.env` files are committed.
- [ ] Authentication/authorization is preserved.
- [ ] Relevant functionality was tested.
- [ ] No unnecessary dependencies were added.
- [ ] Documentation was updated when necessary.
- [ ] UI changes were checked for responsive behavior.
- [ ] API changes are documented.
- [ ] Database changes are documented.
- [ ] Commit messages are clear.
- [ ] The pull request contains only relevant changes.

---

## Documentation Changes

Update documentation when changes affect:

- Features
- API endpoints
- Database models
- Authentication
- Environment variables
- Project structure
- AI integrations
- Socket.IO events
- Deployment
- Development setup

The main technical documentation is:

```text
PROJECT_DOCUMENTATION.md
```

Keep documentation synchronized with the implementation.

---

## Code of Conduct

Contributors are expected to communicate respectfully and professionally.

Please:

- Be respectful to other contributors.
- Focus discussions on the technical issue.
- Provide constructive feedback.
- Avoid harassment or personal attacks.
- Respect different technical perspectives.
- Keep project discussions relevant.

If a separate `CODE_OF_CONDUCT.md` is added later, that document will define the project's formal community standards.

---

## License

This repository includes an MIT License in [`LICENSE`](./LICENSE).

Before redistributing or contributing code, contributors should review the license and any applicable project or internship agreements.

> **Internship Project Notice:** This repository was developed in the context of an internship at Internmo Pvt. Ltd. Contributors should not assume that every project asset, brand element, third-party resource, or external service is covered by the repository's MIT license. Third-party terms and applicable project agreements may still apply.

---

## Questions and Project Discussions

For project-related questions, use GitHub Issues or the repository's available discussion mechanisms where appropriate.

For technical questions, include enough context for others to reproduce or understand the problem.

---

## Final Note

Thank you for contributing to the Hashnode Clone — Developer Blogging & Publishing Platform.

Meaningful contributions can include:

- Bug fixes
- UI improvements
- Performance improvements
- Accessibility improvements
- Documentation improvements
- Testing
- Developer experience improvements
- New publishing or social features
- Improvements to existing AI integrations

Please keep contributions focused, secure, documented, and consistent with the existing architecture.
