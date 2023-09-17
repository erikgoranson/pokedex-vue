<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import axios from 'axios';
import { usePokemonStore } from '@/stores/pokemon';
import type { PokemonData, PokemonSpecies, Ability, EvolutionChain, LocationAreaEncounter } from '@/components/types';
import Detail from './DetailHeader.vue';
import BaseStatistics from './BaseStatistics.vue';
import SpeciesDetails from './SpeciesDetails.vue';
import Evolutions from './Evolutions.vue';
import Abilities from './Abilities.vue';
import Moves from './Moves.vue';
import Locations from './Locations.vue';
import Links from './Links.vue';
import defaultPokemonEntry from '../json/defaultPokemon.json';
import defaultPokemonSpecies from '../json/defaultPokemonSpecies.json';

const pokemonStore = usePokemonStore();
const selectedPokemonData = ref<PokemonData>(defaultPokemonEntry as unknown as PokemonData); 

const selectedPokemonSpeciesData = ref<PokemonSpecies>({} as PokemonSpecies); 

const selectedPokemonAbilities = ref<Ability[]>([] as Ability[]); 

const selectedPokemonEvolutionChain = ref<EvolutionChain>({} as EvolutionChain);

const selectedPokemonEncounters = ref([] as LocationAreaEncounter[])

async function getPkmnDataInfo(id: number){
  if(selectedPokemonData.value.id != id) {
    const endpoint = `/src/assets/data/api/v2/pokemon/${id}/index.json`;
    await axios.get<PokemonData>(endpoint)
      .then((result) => {
        selectedPokemonData.value = result.data;
        pokemonStore.fillPokemonData(result.data);
        
        getPkmnSpeciesInfo();
        getPkmnAbilitiesInfo();
        getPkmnEncounters();
        
        //isLoaded = true;
    })
  }
}

async function getPkmnSpeciesInfo() {
  const id = selectedPokemonData.value.id;
  const endpoint = `/src/assets/data/api/v2/pokemon-species/${id}/index.json`;
  //console.log('running getspecies... ');
  await axios.get<PokemonSpecies>(endpoint).then((result) => {
    //return result.data;
    selectedPokemonSpeciesData.value = result.data;
  })

  getPkmnEvolutionChain();
}

async function getPkmnAbilitiesInfo() {
  selectedPokemonAbilities.value = [];
  selectedPokemonData.value.abilities.forEach(async ability => {
    const partialEndpoint = ability.ability.url;
    const fullEndpoint = `/src/assets/data${partialEndpoint}index.json`;

    //need to fix this
    await axios.get<Ability>(fullEndpoint).then((result) => {
      selectedPokemonAbilities.value.push(result.data);
    })
  })
  isLoaded = true; //maybe here?
}

async function getPkmnEvolutionChain(){
  const partialEndpoint = selectedPokemonSpeciesData.value.evolution_chain.url;
  const fullEndpoint = `/src/assets/data${partialEndpoint}index.json`;
  await axios.get<EvolutionChain>(fullEndpoint)
  .then((result) => {
    selectedPokemonEvolutionChain.value = result.data;
  })
}

async function getPkmnEncounters(){
  selectedPokemonEncounters.value = [];
  const id = selectedPokemonData.value.id;
  const fullEndpoint = `/src/assets/data/api/v2/pokemon/${id}/encounters/index.json`;
  await axios.get<LocationAreaEncounter[]>(fullEndpoint)
  .then((result) => {
    selectedPokemonEncounters.value = result.data;
  })
}

watch(pokemonStore, (newValue, oldValue) => {
  getPkmnDataInfo(pokemonStore.data.id);
});

onMounted(() => {
});

//default value load-in
selectedPokemonData.value = defaultPokemonEntry as unknown as PokemonData; 
selectedPokemonSpeciesData.value = defaultPokemonSpecies as PokemonSpecies;

let isLoaded = false;

</script>

<template>
  <div v-if="!isLoaded">LOADING...</div>
    <div class=" bg-neutral-900 p-3 text-neutral-700 shadow-lg dark:bg-white-600 dark:text-neutral-200 dark:shadow-black/30">
      <Detail :data="selectedPokemonData" :species="selectedPokemonSpeciesData" />
      <BaseStatistics :stats="selectedPokemonData.stats"/>
      <hr />
      <SpeciesDetails :data="selectedPokemonData" :species="selectedPokemonSpeciesData"/>
      <hr />
      <Evolutions :chain="selectedPokemonEvolutionChain" :previous="selectedPokemonSpeciesData.evolves_from_species"/>
      <hr />
      <Abilities :abilities="selectedPokemonData.abilities" :abilitiesInfo="selectedPokemonAbilities"/>
      <hr />
      <Moves :data="selectedPokemonData.moves" />
      <hr />
      <Locations :data="selectedPokemonEncounters"/>
      <hr />
      <Links />
    </div>
</template>

