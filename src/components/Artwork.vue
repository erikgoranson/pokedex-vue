<script setup lang="ts">
import InformationSection from './InformationSection.vue';
import FavoriteButton from './FavoriteButton.vue';
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
  let artworkUrl = defaultArtwork;
  const frontShinyArtworkUrl = props.data?.sprites?.other['official-artwork']?.front_shiny;
  const frontDefaultArtworkUrl = props.data?.sprites?.other['official-artwork']?.front_default;
  artworkUrl = shinyStore.isShiny ? frontShinyArtworkUrl : frontDefaultArtworkUrl;

  if (!artworkUrl || isError.value){
    return;
  }

  isError.value = false; 
  return artworkUrl;
})

</script>

<template>
    <InformationSection>
        <div class="relative flex items-center justify-center">
            <img class="" :src="artworkUrl" @error="isError = true"/>
            <FavoriteButton :id="props.data.id"/>
        </div>
    </InformationSection>
</template>