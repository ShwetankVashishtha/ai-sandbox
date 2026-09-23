FROM mcr.microsoft.com/playwright:v1.63.0-noble

WORKDIR /test

COPY package.json ./

RUN npm install

COPY . .

CMD ["npx", "playwright", "test"]