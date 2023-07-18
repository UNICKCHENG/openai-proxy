# > Step 1 build NextJs
FROM node:alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

# > Step 2 Build docker image
FROM node:alpine AS runner
WORKDIR /app

ENV NODE_ENV production
RUN addgroup -g 1001 -S nodejs &&\
    adduser -S nextjs -u 1001

COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

COPY --from=builder --chown=nextjs:nodejs /app/assets ./assets
COPY --from=builder --chown=nextjs:nodejs /app/readme.md ./readme.md
COPY --from=builder --chown=nextjs:nodejs /app/LICENSE ./LICENSE

USER nextjs
EXPOSE 3000
CMD ["node_modules/.bin/next", "start"]