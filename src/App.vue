<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { computed } from "vue";
import { useRoute } from "vue-router";
/* the current route location */
const route = useRoute();
/* Determines the layout to use */
const getLayout = computed(() => {
  const layout = route.meta.layout ?? "default";
  return `${layout}-layout`;
});
</script>

<template>
  <component :is="getLayout">
    <RouterView />
  </component>
</template>
