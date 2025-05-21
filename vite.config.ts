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
      outDir: 'dist',
      sourcemap: !isProduction,
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // 核心库分割
            if (id.includes('node_modules/vue/') ||
                id.includes('node_modules/vue-router/') ||
                id.includes('node_modules/@vue/')) {
              return 'vue-core';
            }
            
            // 状态管理
            if (id.includes('node_modules/pinia/')) {
              return 'store';
            }
            
            // UI组件库
            if (id.includes('node_modules/element-plus/')) {
              return 'element-plus';
            }
            
            // 图表库
            if (id.includes('node_modules/echarts/')) {
              return 'echarts';
            }
            
            // 工具库
            if (id.includes('node_modules/axios/') || 
                id.includes('node_modules/date-fns/')) {
              return 'utils-vendor';
            }
            
            // 项目工具方法
            if (id.includes('/src/utils/')) {
              return 'utils-app';
            }
            
            // 自动建模模块 - 分解大组件
            if (id.includes('/src/views/AutoModel/TaskCreate')) {
              return 'auto-model-create';
            }
            if (id.includes('/src/views/AutoModel/TaskModify')) {
              return 'auto-model-modify';
            }
            if (id.includes('/src/views/AutoModel/taskDetails')) {
              return 'auto-model-details';
            }
            if (id.includes('/src/views/AutoModel/TaskView')) {
              return 'auto-model-view';
            }
            if (id.includes('/src/views/AutoModel/') && 
                !id.includes('TaskCreate') && 
                !id.includes('TaskModify') && 
                !id.includes('taskDetails') &&
                !id.includes('TaskView')) {
              return 'auto-model-common';
            }
            
            // 数据集管理模块
            if (id.includes('/src/views/DatasetManagement/')) {
              return 'dataset-management';
            }
            
            // 镜像仓库模块
            if (id.includes('/src/views/ImageRepository/')) {
              return 'image-repository';
            }
            
            // 模型仓库模块
            if (id.includes('/src/views/ModelRepository/')) {
              return 'model-repository';
            }
            
            // 在线服务模块 - 分解大组件
            if (id.includes('/src/views/OnlineService/OnlineServiceLogVisualization')) {
              return 'online-service-visualization';
            }
            if (id.includes('/src/views/OnlineService/OnlineServiceDeploy')) {
              return 'online-service-deploy';
            }
            if (id.includes('/src/views/OnlineService/') && 
                !id.includes('OnlineServiceLogVisualization') &&
                !id.includes('OnlineServiceDeploy')) {
              return 'online-service-common';
            }
            
            // 共享组件
            if (id.includes('/src/components/')) {
              return 'shared-components';
            }
            
            // 路由和存储
            if (id.includes('/src/router/') || id.includes('/src/store/')) {
              return 'app-core';
            }
          }
        }
      }
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