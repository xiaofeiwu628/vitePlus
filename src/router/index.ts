import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import request from "@/utils/request";

// 使用动态导入替换静态导入
const Layout = () => import('../layout/Layout.vue')
const Home = () => import('../views/Home.vue')
const Login = () => import('../views/login.vue')
const Register = () => import('../views/register.vue')

// 数据集管理模块
const DataScreen = () => import('../views/DatasetManagement/DataScreen.vue')
const DataView = () => import('../views/DatasetManagement/DataView.vue')
const DataViewDetail = () => import('../views/DatasetManagement/DataViewDetail.vue')
const MultiVisualization = () => import('../views/DatasetManagement/MultiVisualization.vue')
const EntityView = () => import('../views/DatasetManagement/EntityView.vue')
const EntityViewDetail = () => import('../views/DatasetManagement/EntityViewDetail.vue')
const EntityVisualization = () => import('../views/DatasetManagement/EntityVisualization.vue')

// 自动建模模块
const TaskView = () => import("@/views/AutoModel/TaskView.vue")
const TaskCreate = () => import("@/views/AutoModel/TaskCreate.vue")
const TaskModify = () => import("@/views/AutoModel/TaskModify.vue")
const taskDetails = () => import("@/views/AutoModel/taskDetails.vue")

// 模型仓库模块
const ModelList = () => import("@/views/ModelRepository/ModelList.vue")

// 在线服务模块
const OnlineServiceList = () => import("@/views/OnlineService/OnlineServiceList.vue")
const OnlineServiceDeploy = () => import("@/views/OnlineService/OnlineServiceDeploy.vue")
const OnlineServiceDetails = () => import("@/views/OnlineService/OnlineServiceDetails.vue")
const OnlineServiceLog = () => import("@/views/OnlineService/OnlineServiceLog.vue")
const OnlineServiceLogVisualization = () => import("@/views/OnlineService/OnlineServiceLogVisualization.vue")

// 镜像仓库模块
const ImageList = () => import("@/views/ImageRepository/ImageList.vue")

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    redirect: '/home',
    children: [
      { path: 'home', name: 'Home', component: Home },
      { path: '/datascreen', name: 'Datascreen', component: DataScreen },
      { path: '/dataView', name: 'DataView', component: DataView },
      { path: '/entityView', name: 'EntityView', component: EntityView },
      { path: '/dataView/detail', name: 'DataViewDetail', component: DataViewDetail },
      { path: '/entityView/detail', name: 'EntityViewDetail', component: EntityViewDetail },
      { path: '/MultiVisualization', name: 'MultiVisualization', component: MultiVisualization },
      { path: '/entityVisualization', name: 'EntityVisualization', component: EntityVisualization },
      { path: '/taskView', name: 'TaskView', component: TaskView },
      { path: '/taskCreate', name: 'TaskCreate', component: TaskCreate },
      { path: '/taskDetails', name: 'TaskDetails', component: taskDetails },
      { path: '/taskModify', name: 'TaskModify', component: TaskModify },
      { path: '/modelList', name: 'ModelList', component: ModelList },
      { path: '/onlineServiceList', name: 'OnlineServiceList', component: OnlineServiceList },
      { path: '/onlineServiceDeploy', name: 'OnlineServiceDeploy', component: OnlineServiceDeploy },
      { path: '/onlineServiceDetails', name: 'OnlineServiceDetails', component: OnlineServiceDetails },
      { path: '/onlineServiceLogVisualization', name: 'OnlineServiceLogVisualization', component: OnlineServiceLogVisualization },
      { path: '/imageList', name: 'ImageList', component: ImageList },
      { path: '/onlineServiceLog', name: 'OnlineServiceLog', component: OnlineServiceLog }
    ]
  },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
]

// 创建路由实例
const router = createRouter({
  // 使用环境变量
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes
})

// 路由守卫，判断用户是否登录，token是否有效
router.beforeEach((to, from, next) => {
  const myToken = localStorage.getItem("Token");
  if (to.path === '/login' || to.path === '/register') {
    next();
  } else {
    request.get("/UserLogin/CheckLogin", {
      params: {
        Token: myToken ? myToken : ''
      }
    }).then((res: any) => {
      if (res.code === '0') {
        next();
      } else {
        next("/login");
      }
    }).catch(() => {
      next("/login");
    });
  }
});

export default router