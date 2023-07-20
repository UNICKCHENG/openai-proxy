FROM node:alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM scratch as file
WORKDIR /dist
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/LICENSE ./LICENSE

FROM node:alpine AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup -g 1001 -S nodejs &&\
    adduser -S nextjs -u 1001

FROM runner
COPY --from=file --chown=nextjs:nodejs /dist ./
USER nextjs
EXPOSE 3000
CMD ["node_modules/.bin/next", "start"]