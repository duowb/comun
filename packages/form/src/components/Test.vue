<template>
  <div>
    {{ config.msg }}
  </div>
</template>

<script setup lang="ts" generic="T extends string, U extends number">
type Config = {
  msg: T,
  num: U
}

defineProps<{ config: Config }>()
</script>

<style scoped></style>
