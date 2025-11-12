<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import type { GridItem, DefaultDTO } from '@/types';
import Grid from '@/components/Grid.vue';
import { useVersionStore } from '@/stores/version';
import { useFavoritePokemonStore } from '@/stores/favoritePokemon';
import helpers from '@/helpers';

const versionStore = useVersionStore();
const favStore = useFavoritePokemonStore();
const { data } = storeToRefs(favStore);

const nationalDexKey = "nationalDex";
const nationalDex = helpers.retrieveLocalStorageData(nationalDexKey) as GridItem[];

const currentDexFilteredByFavorites = computed(() => {
  return nationalDex.filter(d => data.value.includes(d.id));
})

//TODO: add this to helper functions. reused here and NavBar
const transformedVersionName = computed(() => {
  const versionName = versionStore.data.name;

  if (versionName.includes('version')){
    return versionName;
  }
  return `${versionName} Version`;
})

//TODO: fix spacing on footer
</script>

<template>
  <div class="flex h-fit flex-col justify-center">
  <div class="flex flex-col mb-2">
    <div class="flex items-center justify-center my-2">
      Favorite Pokemon from &nbsp;<span class="capitalize">{{ transformedVersionName }}</span>
    </div>         
    <Grid :data="currentDexFilteredByFavorites" />
  </div>
  </div>
</template>

<style>
</style>