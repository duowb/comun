<template>
  <div>
    <Test :config="config"></Test>
  </div>
</template>

<script setup lang="ts">
import Test from './Test.vue'
const config = {
    msg: 1
}
</script>

<style scoped></style>
