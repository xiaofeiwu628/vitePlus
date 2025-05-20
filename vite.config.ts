import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { fileURLToPath, URL } from 'url'
import legacy from '@vitejs/plugin-legacy'

// 获取当前环境模式
export default defineConfig(({ command, mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd())
  
  // 判断是否为生产环境
  const isProduction = mode === 'production'
  
  return {
    plugins: [
      vue(),
      vueJsx(),
      legacy({
        targets: ['> 1%', 'last 2 versions', 'not dead', 'not ie 11'],
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      port: 9877, // 保持与原 Vue CLI 配置相同的端口
      proxy: {
        '/api': {
          target: env.VITE_API_TARGET,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        '/pyanalysis': {
          target: env.VITE_PYANALYSIS_TARGET,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/pyanalysis/, '')
        },
        '/before': {
          target: env.VITE_BEFORE_TARGET,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/before/, '')
        }
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/assets/css/global.css";`
        }
      }
    },
    build: {
      outDir: 'dist', // 输出目录保持一致
      sourcemap: !isProduction,
      chunkSizeWarningLimit: 2000
    },
    // 为了兼容现有代码，但我们会逐步替换这些代码
    define: {
      'process.env': {
        NODE_ENV: JSON.stringify(mode),
        BASE_URL: JSON.stringify(env.VITE_BASE_URL),
        API_BASE_URL: JSON.stringify(env.VITE_API_BASE_URL),
        APP_TITLE: JSON.stringify(env.VITE_APP_TITLE)
      }
    }
  }
})