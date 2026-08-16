FROM mcr.microsoft.com/playwright:v1.62.1-noble

WORKDIR /test

COPY package.json ./

RUN npm install

COPY . .

CMD ["npx", "playwright", "test"]