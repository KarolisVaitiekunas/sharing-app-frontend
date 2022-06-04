FROM node:16.14-alpine as base
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY . /app

FROM base AS build
WORKDIR /build
COPY --from=base /app ./
RUN npm run build

FROM node:16.14-alpine AS production
WORKDIR /app
COPY --from=build /build/package*.json ./
COPY --from=build /build/.next ./.next
COPY --from=build /build/public ./public
RUN npm install next

EXPOSE 3000
CMD ["npm", "start"]
