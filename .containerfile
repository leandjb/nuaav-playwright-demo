FROM docker.io/library/node:24-trixie-slim


WORKDIR /app
COPY package*.json ./
COPY tests/ ./

            # TODO: TEST CASES FILES IS MISSING 


RUN npm ci


RUN npm install -g @google/gemini-cli
RUN npm install -g @playwright/cli@latest
RUN npm install
RUN npx playwright install 


EXPOSE 3000
CMD ["sh"]
