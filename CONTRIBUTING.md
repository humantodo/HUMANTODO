# Contributing to HUMANTODO

Thanks for your interest in contributing to HUMANTODO! This document covers how to set up the project locally and the different ways you can contribute.

## What is HUMANTODO?

HUMANTODO is a **concept**. The core idea is simple: when AI agents write code, they should intentionally leave critical parts for the human to complete - one example would be mark with `// HUMANTODO:` comments. Think of it as the **IKEA effect** for coding.

The website ([humantodo.dev](https://humantodo.dev)) explains the concept and provides a few starter examples.

But these are just two implementations. HUMANTODO can be applied in many different ways, and you can contribute or implement your own implementations!

If you have an implementation or idea, open an issue or submit a PR. It doesn't need to live in this repo — linking to your own project is great too.

## Project setup

### Prerequisites

- [Node.js](https://nodejs.org/) >= 24
- [pnpm](https://pnpm.io/) 10

> [!TIP]
> If you use [mise](https://mise.jdx.dev/), run `mise install` in the project root and the correct versions of Node and pnpm will be set up automatically.

### Getting started

```bash
git clone https://github.com/nichochar/humantodo.git
cd humantodo

pnpm install

pnpm dev
```

The site will be available at `http://localhost:4321`.

### Available scripts

| Command             | Description                                  |
| ------------------- | -------------------------------------------- |
| `pnpm dev`          | Start the Astro dev server                   |
| `pnpm build`        | Build the site for production                |
| `pnpm preview`      | Build and preview with Wrangler (Cloudflare) |
| `pnpm lint`         | Run ESLint                                   |
| `pnpm format`       | Format code with Prettier                    |
| `pnpm format:check` | Check formatting without writing             |
| `pnpm typecheck`    | Run `astro check` for type errors            |

### Git hooks

The project uses [Lefthook](https://github.com/evilmartians/lefthook) for git hooks. On pre-push, the following checks run in parallel:

- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`

Lefthook is installed as a dev dependency, so hooks are set up automatically after `pnpm install`.

### Tech stack

- **[Astro](https://astro.build/)** — Static site framework
- **[React](https://react.dev/)** — Interactive components
- **[Tailwind CSS](https://tailwindcss.com/)** — Styling
- **[Cloudflare Workers](https://workers.cloudflare.com/)** — Deployment

## Submitting changes

1. Fork the repo and create a branch from `main`.
2. Make your changes.
3. Make sure `pnpm lint`, `pnpm format:check`, and `pnpm typecheck` all pass.
4. Open a pull request with a clear description of what you changed and why.

## License

This project is licensed under the [MIT License](./LICENSE).
