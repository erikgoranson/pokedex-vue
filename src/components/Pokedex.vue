
<script setup lang="ts">
import PkmnSearch from './SearchComponent.vue';
import PkmnInfo from './InformationComponent.vue';
</script>

<template>
  <div class=" h-screen flex w-full h-auto flex-col md:flex-row gap-6 p-6 justify-center">
    <section class="text-center md:text-start"><PkmnInfo /></section>
    <section class="sm:col-span-2 flex justify-center overflow-auto bg-white-800"><PkmnSearch /></section>
  </div>
</template>

<style scoped>
</style>