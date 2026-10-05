import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

declare const process: {
  cwd(): string
  env: Record<string, string | undefined>
}

// In dev the dashboard proxies /api to the Watad API.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const serverEnv = loadEnv(mode, `${process.cwd()}/../server`, '')
  const apiPort = Number(process.env.PORT || serverEnv.PORT || env.PORT || 4100)

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 5174,
      proxy: { '/api': `http://localhost:${apiPort}` },
    },
  }
})
