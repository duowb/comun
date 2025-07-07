<!-- eslint-disable no-console -->
<script setup lang="ts">
import { Form } from '@comun-ui/form'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import FormButton from './components/FormButton.vue'
import type { CFormConfig, LocalColumn } from '@comun-ui/form'
import type { FormInstance, FormItemRule } from 'element-plus'

type Mode = 'edit' | 'view' | 'review'

// ===== 基础表单演示 =====
interface BasicFormData {
  taskName: string
  assignee: 'alice' | 'bob' | 'charlie' | ''
  deadline: string
  isUrgent: boolean
  reviewComment: string
  priority: 'low' | 'medium' | 'high'
  buttons: string
}

const basicFormRef = ref<FormInstance>()
const basicFormMode = ref<Mode>('edit')

const basicFormData = reactive<BasicFormData>({
  taskName: '发布 ComunUI v1.0',
  assignee: 'alice',
  deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0],
  isUrgent: true,
  reviewComment: '',
  priority: 'high',
  buttons: '112233',
})

const basicFormRules: Record<string, FormItemRule[]> = {
  taskName: [{ required: true, message: '任务名称不能为空', trigger: 'blur' }],
  assignee: [{ required: true, message: '必须指定负责人', trigger: 'change' }],
  reviewComment: [
    { required: true, message: '复核时必须填写意见', trigger: 'blur' },
    { min: 10, message: '意见至少10个字符', trigger: 'blur' },
  ],
  deadline: [{ required: true, message: '请选择截止日期', trigger: 'change' }],
  isUrgent: [],
  priority: [{ required: true, message: '请选择优先级', trigger: 'change' }],
}

const basicConfig = ref<CFormConfig<BasicFormData, Mode>>({
  mode: basicFormMode.value,
  formProps: {
    labelWidth: '120px',
    rules: basicFormRules,
    disabled: ({ mode }) => mode === 'view',
    showMessage: true,
  },
  rowProps: {
    gutter: 20,
  },
  columns: [
    {
      show: true,
      type: 'input',
      viewType: 'input',
      prop: 'taskName',
      span: { span: 12 },
      formItemProps: ({ mode }) => ({
        label: mode === 'edit' ? '任务名称' : '查看任务名称',
        required: mode === 'edit',
      }),
      props: {
        placeholder: '请输入任务名称',
        clearable: true,
        disabled: ({ mode }) => mode === 'review',
      },
    },
    {
      show: true,
      type: 'select',
      prop: 'assignee',
      span: { span: 12 },
      formItemProps: { label: '负责人' },
      props: {
        placeholder: '请选择负责人',
        clearable: true,
        selectType: 'select',
        options: [
          { label: 'Alice', value: 'alice' },
          { label: 'Bob', value: 'bob' },
          { label: 'Charlie', value: 'charlie' },
        ],
      },
    },
    {
      show: true,
      type: 'datePicker',
      prop: 'deadline',
      span: { span: 12 },
      formItemProps: { label: '截止日期' },
      props: {
        type: 'date',
        placeholder: '请选择截止日期',
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
      },
    },
    {
      show: true,
      type: 'radio',
      prop: 'priority',
      span: { span: 12 },
      formItemProps: { label: '优先级' },
      props: {
        options: [
          { label: '低', value: 'low' },
          { label: '中', value: 'medium' },
          { label: '高', value: 'high' },
        ],
        radioType: 'button',
      },
    },
    {
      show: true,
      type: 'switch',
      prop: 'isUrgent',
      span: { span: 12 },
      formItemProps: { label: '紧急任务' },
      props: {
        activeText: '是',
        inactiveText: '否',
      },
    },
    {
      show: true,
      type: 'component',
      component: FormButton,
      prop: 'buttons',
      span: { span: 12 },
    },
    {
      show: ({ mode, data }) =>
        mode === 'review' || (mode === 'edit' && data.isUrgent),
      type: 'input',
      reviewType: 'text',
      prop: 'reviewComment',
      span: { span: 24 },
      formItemProps: ({ mode }) => ({
        label: mode === 'review' ? '复核意见' : '备注',
      }),
      props: {
        type: 'textarea',
        placeholder: '请输入意见或备注',
        rows: 3,
        showWordLimit: true,
        maxlength: 200,
      },
      reviewProps: {},
    },
  ],
})

const onBasicModeChange = (mode: Mode) => {
  basicFormMode.value = mode
  // 同步更新配置中的模式
  basicConfig.value.mode = mode
}

const submitBasicForm = async () => {
  try {
    await basicFormRef.value?.validate()
    ElMessage.success('表单验证通过！')
    console.log('基础表单数据:', basicFormData)
  } catch {
    ElMessage.error('表单验证失败，请检查输入')
  }
}

const resetBasicForm = () => {
  basicFormRef.value?.resetFields()
  ElMessage.info('表单已重置')
}

const validateBasicForm = async () => {
  try {
    await basicFormRef.value?.validate()
    ElMessage.success('表单验证通过！')
  } catch {
    ElMessage.error('表单验证失败')
  }
}

// ===== 所有组件类型演示 =====
interface AllComponentsData {
  // 基础输入
  textInput: string
  numberInput: number
  textareaInput: string

  // 选择器
  selectValue: string
  radioValue: string
  checkboxValue: string[]

  // 日期时间
  dateValue: string
  timeValue: string
  datetimeValue: string

  // 其他组件
  switchValue: boolean
  sliderValue: number
  rateValue: number

  // 标签和文本
  inputTagValue: string[]
  textDisplay: string
}

const allComponentsFormRef = ref<FormInstance>()
const allComponentsMode = ref<'edit' | 'view'>('edit')

const allComponentsData = reactive<AllComponentsData>({
  textInput: '示例文本',
  numberInput: 100,
  textareaInput: '这是一个多行文本示例\n支持换行',
  selectValue: 'option2',
  radioValue: 'radio2',
  checkboxValue: ['checkbox1', 'checkbox3'],
  dateValue: '2024-01-15',
  timeValue: '14:30:00',
  datetimeValue: '2024-01-15T14:30:00',
  switchValue: true,
  sliderValue: 60,
  rateValue: 4,
  inputTagValue: ['标签1', '标签2', '标签3'],
  textDisplay: '这是只读文本显示',
})

const allComponentsConfig = ref<
  CFormConfig<AllComponentsData, 'edit' | 'view'>
>({
  mode: allComponentsMode.value,
  formProps: {
    labelWidth: '140px',
    labelPosition: 'left',
  },
  rowProps: {
    gutter: 20,
  },
  columns: [
    // 输入组件
    {
      show: true,
      type: 'input',
      prop: 'textInput',
      span: { span: 12 },
      formItemProps: { label: '文本输入' },
      props: {
        placeholder: '请输入文本',
        clearable: true,
        prefixIcon: 'Search',
      },
    },
    {
      show: true,
      type: 'number',
      prop: 'numberInput',
      span: { span: 12 },
      formItemProps: { label: '数字输入' },
      props: {
        placeholder: '请输入数字',
        min: 0,
        max: 1000,
        step: 10,
        controlsPosition: 'right',
      },
    },
    {
      show: true,
      type: 'input',
      prop: 'textareaInput',
      span: { span: 24 },
      formItemProps: { label: '多行文本' },
      props: {
        type: 'textarea',
        placeholder: '请输入多行文本',
        rows: 4,
        showWordLimit: true,
        maxlength: 200,
      },
    },
    // 选择组件
    {
      show: true,
      type: 'select',
      prop: 'selectValue',
      span: { span: 12 },
      formItemProps: { label: '下拉选择' },
      props: {
        placeholder: '请选择选项',
        clearable: true,
        filterable: true,
        selectType: 'select',
        options: [
          { label: '选项一', value: 'option1' },
          { label: '选项二', value: 'option2' },
          { label: '选项三', value: 'option3' },
          { label: '选项四', value: 'option4' },
        ],
      },
    },
    {
      show: true,
      type: 'radio',
      prop: 'radioValue',
      span: { span: 12 },
      formItemProps: { label: '单选按钮' },
      props: {
        options: [
          { label: '单选一', value: 'radio1' },
          { label: '单选二', value: 'radio2' },
          { label: '单选三', value: 'radio3' },
        ],
        radioType: 'button',
      },
    },
  ],
})

const onAllComponentsModeChange = (mode: 'edit' | 'view') => {
  allComponentsMode.value = mode
  // 同步更新配置中的模式
  allComponentsConfig.value.mode = mode
}

const submitAllComponentsForm = () => {
  ElMessage.success('所有组件表单提交成功！')
  console.log('所有组件表单数据:', allComponentsData)
}

const resetAllComponentsForm = () => {
  allComponentsFormRef.value?.resetFields()
  ElMessage.info('所有组件表单已重置')
}

// ===== 动态表单演示 =====
interface DynamicFormData {
  name: string
  email: string
  [key: string]: any // 允许动态字段
}

const dynamicFormRef = ref<FormInstance>()
const dynamicFieldCount = ref(0)

const dynamicFormData = reactive<DynamicFormData>({
  name: '张三',
  email: 'zhangsan@example.com',
})

const dynamicConfig = ref<CFormConfig<DynamicFormData, 'edit'>>({
  mode: 'edit',
  formProps: { labelWidth: '120px' },
  columns: [
    {
      show: true,
      type: 'input',
      prop: 'name',
      formItemProps: { label: '姓名' },
      props: { placeholder: '请输入姓名' },
    },
    {
      show: true,
      type: 'input',
      prop: 'email',
      formItemProps: { label: '邮箱' },
      props: { placeholder: '请输入邮箱' },
    },
  ],
})

// 更新动态配置的函数
const updateDynamicConfig = () => {
  const baseColumns: LocalColumn<DynamicFormData, 'edit'>[] = [
    {
      show: true,
      type: 'input',
      prop: 'name',
      formItemProps: { label: '姓名' },
      props: { placeholder: '请输入姓名' },
    },
    {
      show: true,
      type: 'input',
      prop: 'email',
      formItemProps: { label: '邮箱' },
      props: { placeholder: '请输入邮箱' },
    },
  ]

  // 添加动态字段
  const dynamicColumns: LocalColumn<DynamicFormData, 'edit'>[] = []
  for (let i = 1; i <= dynamicFieldCount.value; i++) {
    dynamicColumns.push({
      show: true,
      type: 'input',
      prop: `dynamic_field_${i}`,
      formItemProps: { label: `动态字段 ${i}` },
      props: { placeholder: `请输入动态字段 ${i}` },
    })
  }

  dynamicConfig.value.columns = baseColumns.concat(dynamicColumns)
}

const addDynamicField = () => {
  dynamicFieldCount.value++
  const fieldName = `dynamic_field_${dynamicFieldCount.value}`
  dynamicFormData[fieldName] = ''
  updateDynamicConfig()
  ElMessage.success(`添加了动态字段 ${dynamicFieldCount.value}`)
}

const removeDynamicField = () => {
  if (dynamicFieldCount.value > 0) {
    const fieldName = `dynamic_field_${dynamicFieldCount.value}`
    delete dynamicFormData[fieldName]
    dynamicFieldCount.value--
    updateDynamicConfig()
    ElMessage.success(`移除了动态字段 ${dynamicFieldCount.value + 1}`)
  } else {
    ElMessage.warning('没有可移除的动态字段')
  }
}

const submitDynamicForm = () => {
  ElMessage.success('动态表单提交成功！')
  console.log('动态表单数据:', dynamicFormData)
}

const resetDynamicForm = () => {
  dynamicFormRef.value?.resetFields()
  ElMessage.info('动态表单已重置')
}

// ===== 条件显示演示 =====
interface ConditionalFormData {
  userType: 'student' | 'teacher' | 'admin' | ''
  studentId?: string
  grade?: string
  teacherId?: string
  subject?: string
  adminLevel?: string
  permissions?: string[]
}

const conditionalFormRef = ref<FormInstance>()

const conditionalFormData = reactive<ConditionalFormData>({
  userType: '',
  studentId: '',
  grade: '',
  teacherId: '',
  subject: '',
  adminLevel: '',
  permissions: [],
})

const conditionalConfig = ref<CFormConfig<ConditionalFormData, 'edit'>>({
  mode: 'edit',
  formProps: { labelWidth: '120px' },
  columns: [
    {
      show: true,
      type: 'select',
      prop: 'userType',
      formItemProps: { label: '用户类型' },
      props: {
        placeholder: '请选择用户类型',
        selectType: 'select',
        options: [
          { label: '学生', value: 'student' },
          { label: '教师', value: 'teacher' },
          { label: '管理员', value: 'admin' },
        ],
      },
    },
    // 学生相关字段
    {
      show: ({ data }) => data.userType === 'student',
      type: 'input',
      prop: 'studentId',
      formItemProps: { label: '学号' },
      props: { placeholder: '请输入学号' },
    },
    {
      show: ({ data }) => data.userType === 'student',
      type: 'select',
      prop: 'grade',
      formItemProps: { label: '年级' },
      props: {
        placeholder: '请选择年级',
        selectType: 'select',
        options: [
          { label: '一年级', value: 'grade1' },
          { label: '二年级', value: 'grade2' },
          { label: '三年级', value: 'grade3' },
        ],
      },
    },
    // 教师相关字段
    {
      show: ({ data }) => data.userType === 'teacher',
      type: 'input',
      prop: 'teacherId',
      formItemProps: { label: '教师编号' },
      props: { placeholder: '请输入教师编号' },
    },
    {
      show: ({ data }) => data.userType === 'teacher',
      type: 'input',
      prop: 'subject',
      formItemProps: { label: '任教科目' },
      props: { placeholder: '请输入任教科目' },
    },
    // 管理员相关字段
    {
      show: ({ data }) => data.userType === 'admin',
      type: 'select',
      prop: 'adminLevel',
      formItemProps: { label: '管理级别' },
      props: {
        placeholder: '请选择管理级别',
        selectType: 'select',
        options: [
          { label: '初级管理员', value: 'junior' },
          { label: '中级管理员', value: 'middle' },
          { label: '高级管理员', value: 'senior' },
        ],
      },
    },
    {
      show: ({ data }) => data.userType === 'admin',
      type: 'checkbox',
      prop: 'permissions',
      formItemProps: { label: '权限' },
      props: {
        options: [
          { label: '用户管理', value: 'user_manage' },
          { label: '系统设置', value: 'system_config' },
          { label: '数据导出', value: 'data_export' },
        ],
        checkboxType: 'checkbox',
      },
    },
  ],
})

const submitConditionalForm = () => {
  ElMessage.success('条件显示表单提交成功！')
  console.log('条件显示表单数据:', conditionalFormData)
}

const resetConditionalForm = () => {
  conditionalFormRef.value?.resetFields()
  ElMessage.info('条件显示表单已重置')
}
</script>

<template>
  <div class="app-container">
    <h1 class="section-title">ComunUI Form Playground</h1>
    <p class="section-description">
      全面展示 @comun-ui/form 组件的各种使用场景和功能特性
    </p>

    <!-- 基础表单演示 -->
    <el-card class="demo-card">
      <template #header>
        <div class="card-header">
          <span>基础表单演示</span>
          <el-radio-group v-model="basicFormMode" @change="onBasicModeChange">
            <el-radio-button value="edit">编辑模式</el-radio-button>
            <el-radio-button value="view">查看模式</el-radio-button>
            <el-radio-button value="review">复核模式</el-radio-button>
          </el-radio-group>
        </div>
      </template>

      <Form ref="basicFormRef" v-model="basicFormData" :config="basicConfig" />

      <div class="form-actions">
        <el-button type="primary" @click="submitBasicForm">提交</el-button>
        <el-button @click="resetBasicForm">重置</el-button>
        <el-button @click="validateBasicForm">验证</el-button>
      </div>

      <el-divider />
      <h4>表单数据:</h4>
      <pre class="data-preview">{{
        JSON.stringify(basicFormData, null, 2)
      }}</pre>
    </el-card>

    <!-- 所有组件类型演示 -->
    <el-card class="demo-card">
      <template #header>
        <div class="card-header">
          <span>所有组件类型演示</span>
          <el-radio-group
            v-model="allComponentsMode"
            @change="onAllComponentsModeChange"
          >
            <el-radio-button value="edit">编辑模式</el-radio-button>
            <el-radio-button value="view">查看模式</el-radio-button>
          </el-radio-group>
        </div>
      </template>

      <Form
        ref="allComponentsFormRef"
        v-model="allComponentsData"
        :config="allComponentsConfig"
      />

      <div class="form-actions">
        <el-button type="primary" @click="submitAllComponentsForm"
          >提交</el-button
        >
        <el-button @click="resetAllComponentsForm">重置</el-button>
      </div>

      <el-divider />
      <h4>表单数据:</h4>
      <pre class="data-preview">{{
        JSON.stringify(allComponentsData, null, 2)
      }}</pre>
    </el-card>

    <!-- 动态表单演示 -->
    <el-card class="demo-card">
      <template #header>
        <div class="card-header">
          <span>动态表单演示</span>
          <el-button @click="addDynamicField">添加字段</el-button>
          <el-button @click="removeDynamicField">移除字段</el-button>
        </div>
      </template>

      <Form
        ref="dynamicFormRef"
        v-model="dynamicFormData"
        :config="dynamicConfig"
      />

      <div class="form-actions">
        <el-button type="primary" @click="submitDynamicForm">提交</el-button>
        <el-button @click="resetDynamicForm">重置</el-button>
      </div>

      <el-divider />
      <h4>表单数据:</h4>
      <pre class="data-preview">{{
        JSON.stringify(dynamicFormData, null, 2)
      }}</pre>
    </el-card>

    <!-- 条件显示演示 -->
    <el-card class="demo-card">
      <template #header>
        <div class="card-header">
          <span>条件显示演示</span>
        </div>
      </template>

      <Form
        ref="conditionalFormRef"
        v-model="conditionalFormData"
        :config="conditionalConfig"
      />

      <div class="form-actions">
        <el-button type="primary" @click="submitConditionalForm"
          >提交</el-button
        >
        <el-button @click="resetConditionalForm">重置</el-button>
      </div>

      <el-divider />
      <h4>表单数据:</h4>
      <pre class="data-preview">{{
        JSON.stringify(conditionalFormData, null, 2)
      }}</pre>
    </el-card>
  </div>
</template>

<style scoped>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.section-title {
  color: #409eff;
  text-align: center;
  margin-bottom: 10px;
}

.section-description {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
}

.demo-card {
  margin-bottom: 30px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.data-preview {
  background-color: #f5f7fa;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 15px;
  margin-top: 10px;
  font-size: 12px;
  color: #606266;
  max-height: 300px;
  overflow-y: auto;
}

.pro-form--view .el-input,
.pro-form--view .el-select,
.pro-form--view .el-textarea {
  pointer-events: none;
}

.pro-form--view .el-input__inner,
.pro-form--view .el-textarea__inner {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  color: #606266;
}
</style>
