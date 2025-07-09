import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'
const vitestConfig: ReturnType<typeof defineConfig> = defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
export default vitestConfig
