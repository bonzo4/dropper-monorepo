```
apps/dropper-app/*                   # Dropper app
apps/dropper-app/src/app/*           # Dropper app pages
apps/dropper-app/src/components/*    # Dropper app components
apps/dropper-app/src/lib/*           # Dropper app library
apps/dropper-app/src/lib/actions/*   # Dropper app server actions
apps/dropper-app/src/lib/data/*      # Dropper app data fetching
apps/dropper-app/src/lib/hooks/*     # Dropper app hooks
apps/dropper-app/src/lib/telegram/*  # Dropper app telegram utils
apps/dropper-app/src/lib/types/*     # Dropper app types
apps/dropper-app/src/lib/utils/*     # Dropper app utils
apps/dropper-admin/*                 # Dropper admin app
lib/utils/seed/*                     # test local data
packages/*                           # Component and Type packages shared across apps
supabase/*                           # Supabase database
```

## Features

- Turborepo monorepo
- Next.js
- TypeScript
- ESLint
- Prettier
- Supabase Database, Storage, and Auth
- Tailwind CSS
- Hosted on Hetzner Cloud
- Managed on Coolify via Nixpacks
- Local supabase database for development(install supabase, run `supabase start`, run `yarn db:seed` to seed test data)
- Solana wallet integration
- Telegram bot integration
- Dropper Contract integration

# Turborepo starter

This is an official starter Turborepo.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo
pnpm dev
```

### Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following commands:

```
cd my-turborepo
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
