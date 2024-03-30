<script setup lang="ts">
import InformationSection from './InformationSection.vue';
import type { PokemonData, } from '@/types';
import { computed } from 'vue';
import { useShinyStore } from '@/stores/shiny';

const props = defineProps({
  data: {
    type: Object as () => PokemonData,
    required: true
  },
})

const shinyStore = useShinyStore();

const artworkUrl = computed(() => {
  if(shinyStore.isShiny){
    return props.data.sprites.other['official-artwork'].front_shiny;
  }
  return props.data.sprites.other['official-artwork'].front_default;
})

</script>

<template>
    <InformationSection>
        <div class="flex items-center justify-center">
            <img class="" :src="artworkUrl"/>
        </div>
    </InformationSection>
</template>