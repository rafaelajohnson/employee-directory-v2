import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      '#db': fileURLToPath(new URL('./db', import.meta.url)),
      '#db/employees': fileURLToPath(new URL('./db/employees.json', import.meta.url)),
    },
  },
});
//added this confir to see if it fixes module error