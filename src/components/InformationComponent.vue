<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import axios from 'axios';
import { usePokemonStore } from '@/stores/pokemon';
import type { SearchItem, Move, PokemonData } from '@/components/types';
import Detail from './DetailHeader.vue';
import BaseStatistics from './BaseStatistics.vue';
import SpeciesDetails from './SpeciesDetails.vue';
import Evolutions from './Evolutions.vue';
import Abilities from './Abilities.vue';
import Moves from './Moves.vue';
import Locations from './Locations.vue';
import Links from './Links.vue';

const defaultPokemonEntry = <PokemonData>{
  name: 'missingno',
  types: {},
  id: 0,
  moves: [] as Move[]
}

const pokemonStore = usePokemonStore();
const selectedPokemonData = ref<PokemonData>(defaultPokemonEntry); 

function getPokemonEndpoint(payload: SearchItem){
  return payload ? `/src/assets/data/api/v2/pokemon/${payload['national id']}/index.json` : '';
}

async function ashFetchum(url: string){
  const response = await axios
    .get<PokemonData>(url)
    .then(response => {
      selectedPokemonData.value = response.data;
    });

    //console.log(selectedPokemonData.value)
  return response;
}

watch(pokemonStore, (newValue, oldValue) => {
  let selectedPokemonEndpoint = getPokemonEndpoint(pokemonStore.data);
  //console.log(selectedPokemonEndpoint);
  ashFetchum(selectedPokemonEndpoint);
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

