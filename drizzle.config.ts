import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/database/models/*',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'expo', 
});