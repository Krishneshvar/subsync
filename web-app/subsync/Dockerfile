FROM node:18-alpine as builder

ARG VITE_API_URL

WORKDIR /app/subsync

COPY package*.json ./
RUN npm install

COPY . .

ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/subsync/dist /usr/share/nginx/html/ 

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
