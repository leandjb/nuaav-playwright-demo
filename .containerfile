FROM docker.io/library/node:24-trixie-slim


WORKDIR /app
COPY package*.json ./
COPY tests/ ./


RUN npm ci


RUN npm install -g @google/gemini-cli
RUN npm install -g @playwright/cli@latest
RUN npm install
RUN npx playwright install 
RUN npx playwright test

CMD ["sh"]
