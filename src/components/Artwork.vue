<script setup lang="ts">
import InformationSection from './InformationSection.vue';
import type { PokemonData, } from '@/types';
import { ref, computed } from 'vue';
import { useShinyStore } from '@/stores/shiny';
import defaultArtwork from '@/assets/images/defaultArtwork.png';

const props = defineProps({
  data: {
    type: Object as () => PokemonData,
    required: true
  },
})

const isError = ref(false);

const shinyStore = useShinyStore();

const artworkUrl = computed(() => {
  const frontShinyArtworkUrl = props.data.sprites.other['official-artwork'].front_shiny;
  const frontDefaultArtworkUrl = props.data.sprites.other['official-artwork'].front_default;
  let artworkUrl = shinyStore.isShiny ? frontShinyArtworkUrl : frontDefaultArtworkUrl;

  if (!artworkUrl || isError.value){
    artworkUrl = defaultArtwork;
  }

  isError.value = false; 
  return artworkUrl;
})

</script>

<template>
    <InformationSection>
        <div class="flex items-center justify-center">
            <img class="" :src="artworkUrl" @error="isError = true"/>
        </div>
    </InformationSection>
</template>