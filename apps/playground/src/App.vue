<template>
  <div class="app-container">
    <h1 class="section-title">ComunUI Playground</h1>
    <p class="section-description">一个用于开发、调试和演示 ComunUI 组件库的演练场。</p>

    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>CForm 组件演示 (v-model 模式)</span>
          <el-radio-group v-model="formMode">
            <el-radio-button label="edit">编辑模式</el-radio-button>
            <el-radio-button label="view">查看模式</el-radio-button>
            <el-radio-button label="review">复核模式</el-radio-button>
          </el-radio-group>
        </div>
      </template>

      <Form ref="cFormRef" v-model="formData" :config="config"> </Form>
      <el-button type="primary" @click="submitForm">提交</el-button>
      <el-button @click="resetForm">重置</el-button>

      <el-divider />
      <h3>实时表单数据 (v-model 自动同步):</h3>
      <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

import { Form } from '@comun-ui/form'
import type { CFormConfig, CFormInstance } from '@comun-ui/form'
import type { FormItemRule } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'

// --- CForm 演示逻辑 ---
interface MyFormData {
  taskName: string
  assignee: 'alice' | 'bob' | ''
  deadline: number | null
  isUrgent: boolean
  reviewComment: string
}

const cFormRef = ref<CFormInstance | null>(null)
const formMode = ref<'edit' | 'view' | 'review'>('edit')

const formData = reactive<MyFormData>({
  taskName: '发布 ComposeUI v1.0',
  assignee: 'alice',
  deadline: Date.now() + 7 * 24 * 60 * 60 * 1000,
  isUrgent: true,
  reviewComment: '',
})

const formRules: Record<keyof MyFormData, FormItemRule[]> = {
  taskName: [{ required: true, message: '任务名称不能为空' }],
  assignee: [{ required: true, message: '必须指定负责人' }],
  reviewComment: [{ required: true, message: '复核时必须填写意见' }],
  deadline: [],
  isUrgent: [],
}

const config: CFormConfig<MyFormData, 'edit' | 'view' | 'review'> = {
  mode: 'edit',
  formProps: {
    labelWidth: '120px',
    rules: formRules,
    disabled: ({ mode }) => mode === 'view' || mode === 'review',
    showMessage: true,
  },
  items: [
    {
      type: 'input',
      prop: 'taskName',
      label: '任务名称',
      props: { placeholder: '请输入任务名称', disabled: ({ mode }) => mode === 'review' }, // 在复核模式下禁用 },
    },
  ],
}

const submitForm = () => {
  console.log('submitForm', formData)
}
const resetForm = () => {
  console.log('resetForm', formData)
}
</script>
