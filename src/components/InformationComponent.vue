<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import axios from 'axios';
import { usePokemonStore } from '@/stores/pokemon';
import type { Move, ExtendedPokemonData, DefaultDTO, PokemonTypes } from '@/components/types';
import Detail from './DetailHeader.vue';
import BaseStatistics from './BaseStatistics.vue';
import SpeciesDetails from './SpeciesDetails.vue';
import Evolutions from './Evolutions.vue';
import Abilities from './Abilities.vue';
import Moves from './Moves.vue';
import Locations from './Locations.vue';
import Links from './Links.vue';

const defaultPokemonEntry = <ExtendedPokemonData>{
  name: 'missingno.',
  types: [
    { slot: 1,
      type: <DefaultDTO>{ 
        name: 'bird',
      }
    },
    { slot: 2,
      type: <DefaultDTO>{ 
        name: 'normal',
      }
    },
  ] as PokemonTypes[], 
  id: 0,
  moves: [] as Move[]
}

const pokemonStore = usePokemonStore();
const selectedPokemonData = ref<ExtendedPokemonData>(defaultPokemonEntry); 

watch(pokemonStore, (newValue, oldValue) => {
  selectedPokemonData.value = pokemonStore.data.payload as ExtendedPokemonData;
});

onMounted(() => {
    selectedPokemonData.value = defaultPokemonEntry; 
});

</script>

<template>
    <div class=" bg-neutral-900 p-6 text-neutral-700 shadow-lg dark:bg-white-600 dark:text-neutral-200 dark:shadow-black/30">
      <Detail :data="selectedPokemonData" />
      <hr />
      <BaseStatistics />
      <hr />
      <SpeciesDetails />
      <hr />
      <Evolutions />
      <hr />
      <Abilities />
      <hr />
      <Moves :data="selectedPokemonData.moves" />
      <hr />
      <Locations />
      <hr />
      <Links />
    </div>
</template>

