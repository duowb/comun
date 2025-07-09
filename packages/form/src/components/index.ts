import type { keysFormItemComponents } from '../types'
import FormCheckbox from './FormCheckbox.vue'
import FormDatePicker from './FormDatePicker.vue'
import FormInput from './FormInput.vue'
import FormInputTag from './FormInputTag.vue'
import FormMention from './FormMention.vue'
import FormNumber from './FormNumber.vue'
import FormRadio from './FormRadio.vue'
import FormRate from './FormRate.vue'
import FormSelect from './FormSelect.vue'
import FormSlider from './FormSlider.vue'
import FormSwitch from './FormSwitch.vue'
import FormText from './FormText.vue'
import FormTimePicker from './FormTimePicker.vue'
import FormTimeSelect from './FormTimeSelect.vue'
import FormTreeSelect from './FormTreeSelect.vue'
import type { Component } from 'vue'

type AllComponentsNames = {
  [K in keysFormItemComponents]: `Form${Capitalize<K>}`
}[keysFormItemComponents]

export const allComponents: {
  [K in AllComponentsNames]: Component
} = {
  FormCheckbox,
  FormDatePicker,
  FormInput,
  FormInputTag,
  FormMention,
  FormNumber,
  FormRadio,
  FormRate,
  FormSelect,
  FormSlider,
  FormSwitch,
  FormText,
  FormTimePicker,
  FormTimeSelect,
  FormTreeSelect,
}

export const aliasComponents: {
  [K in keysFormItemComponents]: Component
} = {
  input: FormInput,
  select: FormSelect,
  datePicker: FormDatePicker,
  switch: FormSwitch,
  checkbox: FormCheckbox,
  radio: FormRadio,
  text: FormText,
  inputTag: FormInputTag,
  mention: FormMention,
  number: FormNumber,
  rate: FormRate,
  slider: FormSlider,
  timePicker: FormTimePicker,
  timeSelect: FormTimeSelect,
  treeSelect: FormTreeSelect,
}

export {
  FormCheckbox,
  FormDatePicker,
  FormInput,
  FormInputTag,
  FormMention,
  FormNumber,
  FormRadio,
  FormRate,
  FormSelect,
  FormSlider,
  FormSwitch,
  FormText,
  FormTimePicker,
  FormTimeSelect,
  FormTreeSelect,
}
