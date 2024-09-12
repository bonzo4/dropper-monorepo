FROM node:20-alpine AS base

FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
# Set working directory
WORKDIR /app
# Replace <your-major-version> with the major version installed in your repository. For example:
# RUN yarn global add turbo@^2
RUN yarn global add turbo@^2
COPY . .

# Generate a partial monorepo with a pruned lockfile for a target workspace.
# Assuming "dropper-app" is the name entered in the project's package.json: { name: "dropper-app" }
RUN turbo prune dropper-app --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat

RUN apk add --update python3 make g++ linux-headers libusb-dev eudev-dev \
    && rm -rf /var/cache/apk/*

WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN yarn install


# Build the project
COPY --from=builder /app/out/full/ .
RUN yarn turbo run build --filter=dropper-app...

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/dropper-app/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/dropper-app/.next/static ./apps/dropper-app/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/dropper-app/public ./apps/dropper-app/public

EXPOSE 3000
# ENV PORT=3000

# # server.js is created by next build from the standalone output
# # https://nextjs.org/docs/pages/api-reference/next-config-js/output
# ENV HOSTNAME="0.0.0.0"

CMD HOSTNAME="0.0.0.0" node /app/apps/dropper-app/server.js