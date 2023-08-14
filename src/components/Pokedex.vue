
<script setup lang="ts">
import PkmnSearch from './SearchComponent.vue';
import PkmnInfo from './InformationComponent.vue';
</script>

<template>
  <div class="flex w-full h-fit flex-col md:flex-row gap-6 p-6 justify-center">
    <section class="md:text-start md:w-2/4"><PkmnInfo /></section>
    <section class="text-center md:text-start h-screen overflow-y-auto"><PkmnSearch /></section>
    <!--<section class="sm:col-span-2 flex justify-center overflow-auto bg-white-800"><PkmnSearch /></section>-->
  </div>
</template>

<style scoped>
</style>