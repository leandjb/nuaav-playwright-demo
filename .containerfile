FROM mcr.microsoft.com/playwright:v1.48.2-jammy

USER root
RUN useradd -m -s /bin/bash playwright && \
    chown -R playwright:playwright /home/playwright

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY . .

RUN npm install -g @google/gemini-cli
RUN npm install -g @playwright/cli@latest
RUN npx playwright install --with-deps chromium firefox
RUN npx playwright test --update-snapshots

VOLUME ["/app/playwright-report", "/app/test-results", "/app/tests/visual.test.ts-snapshots"]
EXPOSE 9323

USER playwright
ENTRYPOINT ["npx", "playwright"]
CMD ["test", "--reporter=html"]
