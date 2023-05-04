
<script setup lang="ts">
import PkmnSearch from './SearchComponent.vue';
import PkmnInfo from './InformationComponent.vue';
</script>

<template>
  <div class=" h-screen grid grid-flow-row sm:grid-flow-col gap-6 p-6 bg-white-800">
    <div class="sm:col-span-2 flex justify-center p-6 overflow-auto bg-yellow-800">
      <PkmnInfo />
    </div>
    <div class="sm:col-span-2 flex justify-center p-6 overflow-auto bg-white-800">
      <PkmnSearch />
    </div>
  </div>
</template>

<style scoped>
</style>