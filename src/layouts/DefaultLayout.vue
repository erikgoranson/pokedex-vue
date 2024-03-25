<script setup lang="ts">
import TheHeader from '@/components/TheHeader.vue';
import TheFooter from '@/components/TheFooter.vue';
</script>

<template>
    <TheHeader id="top" />
    <slot />
    <TheFooter />
</template>

<style scoped>
</style>