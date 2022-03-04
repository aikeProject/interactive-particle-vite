import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import glslify from 'vite-plugin-glslify'
// import vitePluginString from 'vite-plugin-string'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),glslify()]
})
