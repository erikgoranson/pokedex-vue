
<script setup lang="ts">
import PkmnSearch from './SearchComponent.vue';
import PkmnInfo from './InformationComponent.vue';
</script>

<template>
  <div class="flex h-fit flex-col md:flex-row gap-6 p-1 justify-center">
    <section class="md:text-start md:w-2/4"><PkmnInfo /></section>
  </div>
</template>

<style scoped>
</style>