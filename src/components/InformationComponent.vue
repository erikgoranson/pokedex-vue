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

let isLoaded = false;

const pokemonStore = usePokemonStore();
const selectedPokemonData = ref<PokemonData>(defaultPokemonEntry as PokemonData); 
const selectedPokemonDataKey = "selectedPokemonData";

const selectedPokemonSpeciesData = ref<PokemonSpecies>(defaultPokemonSpecies as PokemonSpecies); 
const selectedSpeciesDataKey = "selectedPokemonSpeciesData";

const selectedPokemonAbilities = ref<Ability[]>([] as Ability[]); 
const selectedPokemonAbilitiesKey = "selectedPokemonAbilities";

const selectedPokemonEvolutionChain = ref<EvolutionChain>({} as EvolutionChain);
const selectedPokemonEvolutionChainKey = "selectedPokemonEvolutionChain";

const selectedPokemonEncounters = ref([] as LocationAreaEncounter[])
const selectedPokemonEncountersKey = "selectedPokemonEncounters";

async function getPkmnDataInfo(id: number){
  if(selectedPokemonData.value.id != id) { 
    const endpoint = `/src/assets/data/api/v2/pokemon/${id}/index.json`;
    await axios.get<PokemonData>(endpoint)
      .then((result) => {
        selectedPokemonData.value = result.data;
        pokemonStore.fillPokemonData(result.data);
        localStorage.setItem(selectedPokemonDataKey, JSON.stringify(result.data));
        
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
    localStorage.setItem(selectedSpeciesDataKey, JSON.stringify(result.data));
  })

  getPkmnEvolutionChain();
}

async function getPkmnAbilitiesInfo() {
  selectedPokemonAbilities.value = [];
  selectedPokemonData.value.abilities.forEach(async ability => {
    const partialEndpoint = ability.ability.url;
    const fullEndpoint = `/src/assets/data${partialEndpoint}index.json`;

    //need to fix this to get<Ability[]>
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
    localStorage.setItem(selectedPokemonEvolutionChainKey, JSON.stringify(result.data));
  })
}

async function getPkmnEncounters(){
  selectedPokemonEncounters.value = [];
  const id = selectedPokemonData.value.id;
  const fullEndpoint = `/src/assets/data/api/v2/pokemon/${id}/encounters/index.json`;
  await axios.get<LocationAreaEncounter[]>(fullEndpoint)
  .then((result) => {
    selectedPokemonEncounters.value = result.data;
    localStorage.setItem(selectedPokemonEncountersKey, JSON.stringify(result.data));
  })
}

function retrieveLocalStorageData(key: string){
    const data = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key) || '') : null; 
    return data;
}

function getInitialPokemonData(){ 
  const retrievedPokemonData = retrieveLocalStorageData(selectedPokemonDataKey) as PokemonData;

  if(!retrievedPokemonData){
    return;
  }

  selectedPokemonData.value = retrievedPokemonData;
  pokemonStore.changePokemon(retrievedPokemonData.id);

  selectedPokemonSpeciesData.value = retrieveLocalStorageData(selectedSpeciesDataKey);
  //abilities stuff here after fixed
  selectedPokemonEvolutionChain.value = retrieveLocalStorageData(selectedPokemonEvolutionChainKey);
  selectedPokemonEncounters.value = retrieveLocalStorageData(selectedPokemonEncountersKey);

  isLoaded = true; 
}

watch(pokemonStore, (newValue, oldValue) => {
  getPkmnDataInfo(pokemonStore.data.id);
});

onMounted(() => {
  getInitialPokemonData();
});

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
      <Links :data="selectedPokemonSpeciesData"/>
    </div>
</template>

