<template>
  <div class="service-details-container">
    <!-- 头部区域 -->
    <div class="header-area">
      <div class="tech-title">
        <el-icon><Document /></el-icon>
        <el-breadcrumb :separator-icon="ArrowRight" class="nav-breadcrumb">
          <el-breadcrumb-item :to="{ path: '/onlineServiceList' }" class="tech-breadcrumb">
            在线服务
          </el-breadcrumb-item>
          <el-breadcrumb-item class="tech-breadcrumb">
            服务详情
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content-wrapper">
      <!-- 基本信息 -->
      <div class="info-section">
        <div class="section-header">
          <div class="section-line"></div>
          <span class="section-title">基本信息</span>
        </div>
        <div class="section-content">
          <el-form
            label-position="left"
            label-width="120px"
            :model="formOfBaseInformation"
            class="info-form"
          >
            <el-form-item label="服务名称：">
              <span>{{ formOfBaseInformation.serviceName }}</span>
            </el-form-item>
            <el-form-item label="服务ID：">
              <span>{{ formOfBaseInformation.serviceId }}</span>
            </el-form-item>
            <el-form-item label="服务状态：">
              <el-tag :type="getServiceStateType" size="small">
                {{ serviceStateText }}
              </el-tag>
            </el-form-item>
            <el-form-item label="创建时间：">
              <span>{{ formOfBaseInformation.createTime }}</span>
            </el-form-item>
            <el-form-item label="部署方式：">
              <el-tag type="info" size="small">
                {{ serviceTypeText }}
              </el-tag>
            </el-form-item>
            <el-form-item label="服务描述：">
              <span>{{ formOfBaseInformation.desc }}</span>
            </el-form-item>
          </el-form>
        </div>
      </div>
      
      <!-- 模型信息 -->
      <div v-if="formOfBaseInformation.serviceType === 'official'" class="info-section">
        <div class="section-header">
          <div class="section-line"></div>
          <span class="section-title">模型信息</span>
        </div>
        <div class="section-content">
          <el-table 
            :data="modelInformationTableData" 
            class="info-table" 
            border 
            :header-cell-style="tableHeaderStyle"
            :cell-style="tableCellStyle"
            stripe
          >
            <el-table-column prop="modelName" label="模型名称" min-width="20%" align="center"/>
            <el-table-column prop="modelId" label="模型ID" min-width="20%" align="center"/>
            <el-table-column prop="taskId" label="所属任务ID" min-width="20%" align="center"/>
            <el-table-column prop="taskHistoryId" label="任务运行ID" min-width="20%" align="center"/>
            <el-table-column prop="isPublic" label="是否公开" min-width="20%" align="center">
              <template #default="scope">
                <el-tag :type="scope.row.isPublic === '公开' ? 'success' : 'info'" size="small">
                  {{ scope.row.isPublic }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 镜像信息 -->
      <div v-if="formOfBaseInformation.serviceType === 'custom'" class="info-section">
        <div class="section-header">
          <div class="section-line"></div>
          <span class="section-title">镜像信息</span>
        </div>
        <div class="section-content">
          <el-table 
            :data="imageInformationTableData" 
            class="info-table" 
            border 
            :header-cell-style="tableHeaderStyle"
            :cell-style="tableCellStyle"
            stripe
          >
            <el-table-column prop="imageName" label="镜像名称" min-width="25%" align="center"/>
            <el-table-column prop="imageId" label="镜像ID" min-width="25%" align="center"/>
            <el-table-column prop="imageVersionId" label="镜像版本ID" min-width="25%" align="center"/>
            <el-table-column prop="tag" label="版本号" min-width="25%" align="center">
              <template #default="scope">
                <el-tag type="primary" size="small">v{{ scope.row.tag }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 资源规格 -->
      <div class="info-section">
        <div class="section-header">
          <div class="section-line"></div>
          <span class="section-title">资源规格</span>
        </div>
        <div class="section-content">
          <el-row :gutter="40" class="resource-info">
            <el-col :span="12">
              <div class="resource-card">
                <div class="resource-icon">
                  <el-icon size="24"><Cpu /></el-icon>
                </div>
                <div class="resource-data">
                  <div class="resource-value">{{ formOfResource.cpuCoresNum }}</div>
                  <div class="resource-label">CPU核心数</div>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="resource-card">
                <div class="resource-icon memory-icon">
                  <el-icon size="24"><Memo /></el-icon>
                </div>
                <div class="resource-data">
                  <div class="resource-value">{{ formOfResource.memory }}</div>
                  <div class="resource-label">内存</div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>

      <!-- 请求说明 -->
      <div class="info-section">
        <div class="section-header">
          <div class="section-line"></div>
          <span class="section-title">请求说明</span>
        </div>
        <div class="section-content">
          <el-form
            label-position="left"
            label-width="120px"
            :model="formOfRequestDesc"
            class="request-form"
          >
            <el-form-item label="HTTP方法">
              <el-tag type="success" size="small">POST</el-tag>
            </el-form-item>
            
            <el-form-item label="请求URL">
              <div class="url-container">
                <div class="url-value">{{ formOfRequestDesc.url }}</div>
                <div class="url-note" v-if="formOfBaseInformation.serviceType === 'custom'">
                  注：您可以根据需要在上述URL基础上进行延申，如：{{ formOfRequestDesc.url }}/example
                </div>
              </div>
            </el-form-item>
            
            <el-form-item label="Header">
              <el-table 
                :data="headerTableData" 
                class="header-table" 
                border 
                :header-cell-style="tableHeaderStyle"
                :cell-style="tableCellStyle"
                stripe
              >
                <el-table-column prop="name" label="参数" min-width="30%" align="center"/>
                <el-table-column prop="value" label="取值" min-width="70%" align="center"/>
              </el-table>
            </el-form-item>
            
            <el-form-item label="Body请求体">
              <el-table 
                :data="bodyRequestBody" 
                class="body-table" 
                border 
                :header-cell-style="tableHeaderStyle"
                :cell-style="tableCellStyle"
                stripe
              >
                <el-table-column prop="param" label="参数" min-width="10%" align="center"/>
                <el-table-column prop="required" label="必填" min-width="10%" align="center">
                  <template #default="scope">
                    <el-tag :type="scope.row.required === '是' ? 'danger' : 'info'" size="small">
                      {{ scope.row.required }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="type" label="类型" min-width="10%" align="center">
                  <template #default="scope">
                    <el-tag type="primary" size="small">{{ scope.row.type }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="desc" label="说明" min-width="70%" align="center"/>
              </el-table>
            </el-form-item>

            <el-form-item label="请求示例" v-if="formOfBaseInformation.serviceType === 'official'">
              <div class="code-example">
                <pre>{{ specificDesc1 }}</pre>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowRight, Document, Cpu, Memo } from '@element-plus/icons-vue'
import request from '@/utils/request'

// 类型定义
interface BaseInformation {
  serviceName?: string
  serviceId?: string
  serviceState?: string
  createTime?: string
  desc?: string
  serviceType?: string
}

interface ModelInformation {
  modelName: string
  modelId: string
  taskId: string
  taskHistoryId: string
  isPublic: string
}

interface ImageInformation {
  imageName: string
  imageId: string
  imageVersionId: string
  tag: string
}

interface RequestDesc {
  url?: string
}

interface ResourceInfo {
  memory?: string
  cpuCoresNum?: string
}

interface HeaderData {
  name: string
  value: string
}

interface BodyRequestData {
  param: string
  required: string
  type: string
  desc: string
}

interface ServiceDetailResponse {
  service_name: string
  service_id: string
  service_state: string
  create_time: string
  service_desc: string
  service_type: string
  image_version_data?: {
    image_name: string
    image_version_id: string
    tag: string
    image_id: string
  }
  model_data?: {
    model_name: string
    is_public: string
  }
  model_id?: string
  task_id?: string
  task_history_id?: string
  memory: number
  cpu_cores_num: string
  kong_url: string
  request_data: any
}

// 路由实例
const route = useRoute()

// 响应式数据
const formOfBaseInformation = reactive<BaseInformation>({})
const modelInformationTableData = ref<ModelInformation[]>([])
const imageInformationTableData = ref<ImageInformation[]>([])
const formOfRequestDesc = reactive<RequestDesc>({})
const formOfResource = reactive<ResourceInfo>({})
const specificDesc1 = ref<any>({})
const specificDesc2 = ref<any>({})

// 基础数据
const taskID = ref<string>('')
const historyID = ref<string>('')
const version = ref<string>('')
const serviceId = ref<string>('')

// 表格数据
const headerTableData = ref<HeaderData[]>([
  {
    name: 'Token',
    value: localStorage.getItem("token") || '',
  }
])

const bodyRequestBody = ref<BodyRequestData[]>([
  {
    param: 'data',
    required: '是',
    type: 'Array',
    desc: '待预测数据，每条待预测数据是由各个特征及其取值构成的键值对的集合'
  }
])

// 字典数据
const serviceStateDic: Record<string, string> = {
  running: '运行中',
  stoped: '停止',
  exited: '停止',
  error: '未知异常',
  error_connection: '连接异常',
  error_starting: '启动异常',
  error_running: '运行异常',
  waiting: '等待资源',
  starting: '部署中',
}

const serviceTypeDic: Record<string, string> = {
  custom: '镜像部署',
  official: '模型部署',
}

// 表格样式
const tableHeaderStyle = {
  background: '#f0f5fa',
  color: '#1a2942',
  fontSize: '14px',
  fontWeight: '600',
  textAlign: 'center',
  padding: '12px 0',
  borderBottom: '2px solid #4c75a3',
}

const tableCellStyle = {
  textAlign: 'center',
  fontSize: '14px',
  padding: '10px 0',
  color: '#303133'
}

// 计算属性
const getServiceStateType = computed(() => {
  const stateMap: Record<string, string> = {
    running: 'success',
    stoped: 'info',
    exited: 'info',
    error: 'danger',
    error_connection: 'danger',
    error_starting: 'danger',
    error_running: 'danger',
    waiting: 'warning',
    starting: 'warning',
  }
  return stateMap[formOfBaseInformation.serviceState || ''] || 'info'
})
// 服务状态和类型文本
const serviceStateText = computed(() => {
  const state = formOfBaseInformation.serviceState
  return state ? (serviceStateDic[state] || '未知状态') : '未知状态'
})
// 服务类型文本
const serviceTypeText = computed(() => {
  const type = formOfBaseInformation.serviceType
  return type ? (serviceTypeDic[type] || '未知类型') : '未知类型'
})

// 方法定义
const loadServiceDetails = (): void => {
  request.get('/OnlineService/GetOnlineService', {
    params: {
      service_id: serviceId.value
    }
  }).then((res: { data: ServiceDetailResponse }) => {
    let middle: any = {}
    
    // 基本信息
    formOfBaseInformation.serviceName = res.data.service_name
    formOfBaseInformation.serviceId = res.data.service_id
    formOfBaseInformation.serviceState = res.data.service_state
    formOfBaseInformation.createTime = res.data.create_time
    formOfBaseInformation.desc = res.data.service_desc
    formOfBaseInformation.serviceType = res.data.service_type
    
    // 根据服务类型处理不同的信息
    if (res.data.service_type === 'custom') {
      // 镜像信息
      if (res.data.image_version_data) {
        middle['imageName'] = res.data.image_version_data.image_name
        middle['imageVersionId'] = res.data.image_version_data.image_version_id
        middle['tag'] = res.data.image_version_data.tag
        middle['imageId'] = res.data.image_version_data.image_id
        imageInformationTableData.value.push(middle)
      }
    } else if (res.data.service_type === 'official') {
      // 模型信息
      if (res.data.model_data) {
        middle['modelName'] = res.data.model_data.model_name
        middle['modelId'] = res.data.model_id
        middle['taskId'] = res.data.task_id
        middle['taskHistoryId'] = res.data.task_history_id
        middle['isPublic'] = res.data.model_data.is_public === '1' ? '公开' : '不公开'
        modelInformationTableData.value.push(middle)
      }
    } else {
      ElMessage({ message: '参数异常！', type: 'error', offset: 60 })
    }
    
    // 资源信息
    formOfResource.memory = (res.data.memory / 1000000000) + 'GB'
    formOfResource.cpuCoresNum = res.data.cpu_cores_num
    
    // 请求信息
    formOfRequestDesc.url = res.data.kong_url
    specificDesc1.value = JSON.parse(JSON.stringify(res.data.request_data))
    
    console.log(specificDesc1.value, 'specificDesc1')
    console.log(res.data, 'res.data in loadServiceDetails')
    console.log(modelInformationTableData.value, 'modelInformationTableData in loadServiceDetails')
  })
}

// 组件挂载时执行
onMounted(() => {
  taskID.value = route.query.taskId as string || ''
  historyID.value = route.query.historyId as string || ''
  version.value = route.query.version as string || ''
  serviceId.value = route.query.serviceId as string || ''
  
  loadServiceDetails()
})
</script>

<style scoped>
/* 容器样式 */
.service-details-container {
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  min-height: 100vh;
}

/* 头部区域 */
.header-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  background: linear-gradient(135deg, #1a2942, #4c75a3);
  border-radius: 12px;
  color: white;
  margin: 20px 20px 0;
  box-shadow: 0 8px 20px rgba(26, 41, 66, 0.15);
  position: relative;
  overflow: hidden;
}

.header-area::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
  transform: skewX(-45deg) translateX(-150%);
  transition: transform 0.8s ease;
}

.header-area:hover::before {
  transform: skewX(-45deg) translateX(150%);
}

.tech-title {
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.5px;
}

.tech-title .el-icon {
  font-size: 24px;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.2);
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.nav-breadcrumb {
  display: flex;
  align-items: center;
}

.tech-breadcrumb {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff !important;
}

:deep(.tech-breadcrumb span),
:deep(.tech-breadcrumb div),
:deep(.tech-breadcrumb a) {
  color: #ffffff !important;
  transition: opacity 0.2s ease;
}

:deep(.tech-breadcrumb a:hover) {
  opacity: 0.8;
}

:deep(.el-breadcrumb__separator) {
  color: #ffffff !important;
}

/* 主内容区域 */
.main-content-wrapper {
  background-color: transparent;
  margin: 10px 20px 20px;
  padding: 0;
  min-height: calc(100vh - 150px);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 区块样式 */
.info-section {
  margin-bottom: 0;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.04);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
}

.info-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  align-items: center;
  padding: 18px 24px;
  border-bottom: 1px solid #f0f2f5;
  background: #ffffff;
}

.section-line {
  width: 5px;
  height: 24px;
  background: linear-gradient(to bottom, #1a2942, #4c75a3);
  border-radius: 3px;
  margin-right: 15px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a2942;
  letter-spacing: 0.5px;
}

.section-content {
  padding: 24px 30px;
}

/* 表单样式 */
.info-form {
  max-width: 800px;
}

:deep(.el-form-item) {
  margin-bottom: 24px;
  position: relative;
  padding-left: 10px;
  border-left: 2px solid transparent;
  transition: border-color 0.3s ease;
}

:deep(.el-form-item:hover) {
  border-left-color: #4c75a3;
}

:deep(.el-form-item__label) {
  font-weight: 600;
  color: #1a2942;
  font-size: 15px;
}

:deep(.el-form-item__content) {
  line-height: 1.6;
  font-size: 15px;
}

:deep(.el-form-item__content span) {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #333;
}

:deep(.el-form-item:last-child) {
  margin-bottom: 0;
}

/* 表格样式 */
.info-table, 
.header-table, 
.body-table {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.03);
}

:deep(.el-table) {
  --el-table-header-bg-color: #f0f5fa;
  --el-table-border-color: #e5e9f2;
  --el-table-row-hover-bg-color: #f0f7ff;
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-table::before) {
  display: none;
}

:deep(.el-table th) {
  padding: 14px 0;
  font-size: 14px;
}

:deep(.el-table__header) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell) {
  background-color: #f8fafc;
}

:deep(.el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell) {
  background-color: #f0f7ff;
  transition: background-color 0.2s ease;
}

:deep(.el-table td.el-table__cell) {
  transition: background-color 0.2s ease;
}

:deep(.el-table .cell) {
  padding: 0 15px;
}

/* 标签样式美化 */
:deep(.el-tag) {
  border-radius: 4px;
  padding: 0 10px;
  height: 26px;
  line-height: 24px;
  font-weight: 500;
  transition: all 0.2s ease;
}

:deep(.el-tag--small) {
  padding: 0 8px;
  height: 24px;
  line-height: 22px;
}

:deep(.el-tag.el-tag--success) {
  background-color: rgba(103, 194, 58, 0.1);
  border-color: rgba(103, 194, 58, 0.2);
  color: #67c23a;
}

:deep(.el-tag.el-tag--info) {
  background-color: rgba(144, 147, 153, 0.1);
  border-color: rgba(144, 147, 153, 0.2);
  color: #606266;
}

:deep(.el-tag.el-tag--primary) {
  background-color: rgba(64, 158, 255, 0.1);
  border-color: rgba(64, 158, 255, 0.2);
  color: #409EFF;
}

:deep(.el-tag.el-tag--danger) {
  background-color: rgba(245, 108, 108, 0.1);
  border-color: rgba(245, 108, 108, 0.2);
  color: #f56c6c;
}

:deep(.el-tag.el-tag--warning) {
  background-color: rgba(230, 162, 60, 0.1);
  border-color: rgba(230, 162, 60, 0.2);
  color: #e6a23c;
}

/* 资源规格卡片样式 */
.resource-info {
  padding: 10px 0;
}

.resource-card {
  display: flex;
  align-items: center;
  padding: 24px;
  background: linear-gradient(145deg, #ffffff, #f8fafc);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #ebeef5;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
  height: 100%;
}

.resource-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.resource-card::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(to right, #1a2942, #4c75a3);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.resource-card:hover::after {
  opacity: 1;
}

.resource-icon {
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  margin-right: 24px;
  background: linear-gradient(135deg, rgba(76, 117, 163, 0.2), rgba(76, 117, 163, 0.1));
  color: #4c75a3;
  box-shadow: 0 4px 10px rgba(76, 117, 163, 0.15);
  transition: transform 0.3s ease;
}

.resource-card:hover .resource-icon {
  transform: scale(1.05);
}

.memory-icon {
  background: linear-gradient(135deg, rgba(26, 41, 66, 0.2), rgba(26, 41, 66, 0.1));
  color: #1a2942;
  box-shadow: 0 4px 10px rgba(26, 41, 66, 0.15);
}

.resource-data {
  display: flex;
  flex-direction: column;
}

.resource-value {
  font-size: 26px;
  font-weight: 700;
  color: #1a2942;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
}

.resource-label {
  font-size: 14px;
  color: #606266;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 500;
}

/* 请求说明样式 */
.request-form {
  width: 100%;
}

.url-container {
  line-height: 1.8;
}

.url-value {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  background-color: #f8fafc;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #ebeef5;
  font-size: 14px;
  word-break: break-all;
  color: #1a2942;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
  position: relative;
}

.url-value::before {
  content: "URL";
  position: absolute;
  top: -10px;
  left: 12px;
  background: #f8fafc;
  padding: 0 8px;
  font-size: 12px;
  color: #909399;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.url-note {
  margin-top: 12px;
  color: #f56c6c;
  font-size: 13px;
  background: rgba(245, 108, 108, 0.05);
  padding: 8px 12px;
  border-radius: 6px;
  border-left: 3px solid #f56c6c;
}

.code-example {
  margin-bottom: 20px;
}

.code-example pre {
  background-color: #1f2937;
  padding: 20px;
  border-radius: 8px;
  overflow: auto;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  white-space: pre-wrap;
  word-break: break-all;
  font-size: 14px;
  line-height: 1.6;
  max-height: 400px;
  color: #e5e7eb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
}

.code-example pre::before {
  content: "请求示例";
  position: absolute;
  top: -10px;
  left: 15px;
  background: #f5f7fa;
  padding: 3px 10px;
  font-size: 12px;
  color: #606266;
  border-radius: 4px;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 500;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .header-area {
    padding: 18px;
    margin: 15px 15px 0;
  }
  
  .tech-title {
    font-size: 16px;
  }
  
  .main-content-wrapper {
    margin: 10px 15px 15px;
    gap: 15px;
  }
  
  .section-content {
    padding: 18px 20px;
  }
  
  .resource-info {
    padding: 0;
  }
  
  .resource-card {
    margin-bottom: 15px;
    padding: 18px;
  }

  .resource-icon {
    width: 55px;
    height: 55px;
    margin-right: 18px;
  }
  
  .url-value {
    font-size: 13px;
    padding: 10px;
  }

  .code-example pre {
    padding: 15px;
    font-size: 13px;
  }
}

@media (max-width: 576px) {
  .section-header {
    padding: 15px 18px;
  }
  
  .section-content {
    padding: 15px;
  }
  
  .resource-icon {
    width: 45px;
    height: 45px;
    margin-right: 15px;
  }
  
  .resource-value {
    font-size: 20px;
  }
}
</style>