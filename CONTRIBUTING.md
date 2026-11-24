# Contributing — branching model, commits, pull requests

## Branching model

- `main` is the only long-lived branch and is **protected**:
  - pull requests required to merge into `main`
  - required status checks: the CI workflow (lint, type-check, tests, build) must pass
  - no force-push, no deletion
  - Enable it in **Settings → Branches → Add branch protection rule** for `main`
    (the automation token used in this project cannot create protection rules itself).
- Work happens on short-lived branches created from `main`:
  - `feature/<short-slug>` — new features
  - `fix/<short-slug>` — bug fixes
  - `chore/<short-slug>` — tooling, docs, dependencies
- Delete the branch after its PR is merged. Never merge half-finished work into `main`.

## Pull requests

- One PR per branch, small and reviewable.
- Title follows Conventional Commits (same as the squashed commit will).
- Every PR runs CI (lint + type-check + tests + production build). A PR with a red
  check is never merged.
- Merge with **squash** or **rebase** — no merge commits of half-finished work.

## Commit messages — Conventional Commits

```
<type>(<scope>): <short summary>

[optional body]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `build`, `ci`, `chore`, `perf`.

Examples:

```
feat(api): add contact form endpoint with honeypot and rate limiting
fix(web): keep language toggle in sync with /fr URL prefix
docs: document .env variables in .env.example
chore: initialize repository
```

No `wip` messages on `main`.

## Secrets

Never commit credentials, tokens, database URLs with passwords, or personal
contact details. `.env` is gitignored; use `.env.example` to document variables.
If a secret is ever committed by mistake: rotate it immediately, then purge it
from history (and note it in the PR).
