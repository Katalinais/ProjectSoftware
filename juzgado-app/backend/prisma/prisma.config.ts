import { defineConfig } from '@prisma/cli'

export default defineConfig({
  schema: './prisma/schema.prisma',
  envFile: '.env',
})
