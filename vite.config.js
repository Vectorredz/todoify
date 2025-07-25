import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
	base: '/todoify/',
	plugins: [
    tailwindcss(),
  ],
	build: {
		rollupOptions: {
		input: {
			main: resolve(__dirname, 'index.html'),
				},
			},
		},
	}
)