FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY apps/admin/package.json apps/admin/
RUN npm ci
COPY packages/shared packages/shared
COPY apps/api apps/api
COPY db db
ENV NODE_ENV=production API_PORT=4000
EXPOSE 4000
CMD ["sh", "-c", "npm run migrate --workspace=apps/api && npm run seed --workspace=apps/api && npx tsx apps/api/src/index.ts"]
