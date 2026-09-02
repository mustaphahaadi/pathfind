# Contributing to Pathfind

This document describes how we collaborate on this repository. Please follow this workflow for every change.

## Branching

- **Never commit directly to `main`.** It is protected and always reflects a working state.
- Create your own branch for any work, named as `feat/yourname`.



## Making Changes

1. Pull the latest `main` before starting new work:
```bash
   git checkout main
   git pull origin main
```
2. Create your branch:
```bash
   git checkout -b feat/yourname
```
3. Make your changes and commit with a clear message:
```bash
   git add .
   git commit -m "Add mentor search filter component"
```
4. Push your branch:
```bash
   git push origin feat/yourname
```

## Pull Requests

1. Open a Pull Request (PR) from your branch into `main`.
2. Fill in the PR template: what changed, how to test it, and screenshots if it's a UI change.
3. Assign **2–3 teammates** to review. Do not merge your own PR.
4. Address any review feedback before merging.
5. Once approved, merge using **Squash and Merge** to keep history clean.
6. Delete your branch after merging.

## Code Review Guidelines

- Review within 24 hours where possible, so nobody is blocked.
- Be constructive: point out issues clearly, but kindly.
- If you approve, leave a short note on what you checked.
- If you request changes, be specific about what needs to change.

## Commit Messages

Keep them short and descriptive, present tense:
- Good: `Add mentor profile card component`
- Avoid: `fixed stuff`, `updates`

## Questions or Blockers

Post in the team channel as soon as something blocks you. A problem raised early gets solved fast; a hidden one costs the team time.