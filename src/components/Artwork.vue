<script setup lang="ts">
import InformationSection from './InformationSection.vue';
import type { PokemonData, } from '@/types';
import { computed } from 'vue';
import { useShinyStore } from '@/stores/shiny';
import defaultArtwork from '@/assets/images/defaultArtwork.png';

const props = defineProps({
  data: {
    type: Object as () => PokemonData,
    required: true
  },
})

const shinyStore = useShinyStore();

const artworkUrl = computed(() => {
  const frontShinyArtworkUrl = props.data.sprites.other['official-artwork'].front_shiny;
  const frontDefaultArtworkUrl = props.data.sprites.other['official-artwork'].front_default;
  let artworkUrl = shinyStore.isShiny ? frontShinyArtworkUrl : frontDefaultArtworkUrl;

  if (!artworkUrl){
    artworkUrl = defaultArtwork;
  }
  return artworkUrl;
})

</script>

<template>
    <InformationSection>
        <div class="flex items-center justify-center">
            <img class="" :src="artworkUrl"/>
        </div>
    </InformationSection>
</template>