FROM node:20-alpine AS base
WORKDIR /app

RUN apk add --no-cache libc6-compat

FROM base AS deps

COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .


RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production


RUN addgroup -S nextjs && adduser -S nextjs -G nextjs


COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]