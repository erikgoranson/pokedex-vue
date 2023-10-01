<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import { usePokemonStore } from '@/stores/pokemon';
import type { PokemonData, PokemonSpecies, Ability, EvolutionChain, LocationAreaEncounter } from '@/types';
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
import pokeAPI from "@/services/pokeAPI";
import Skeleton from "./Skeleton.vue";
import helpers from '@/helpers';

const isLoaded = ref(false);

const pokemonStore = usePokemonStore();
const selectedPokemonData = ref<PokemonData>(defaultPokemonEntry as unknown as PokemonData); 
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
  const pokemon = await pokeAPI.getPokemon(id);
  selectedPokemonData.value = pokemon;
  pokemonStore.fillPokemonData(pokemon);
  localStorage.setItem(selectedPokemonDataKey, JSON.stringify(pokemon));
}

async function getPkmnSpeciesInfo() {
  const id = selectedPokemonData.value.id;
  const species = await pokeAPI.getPokemonSpecies(id);
  selectedPokemonSpeciesData.value = species;
  localStorage.setItem(selectedSpeciesDataKey, JSON.stringify(species));
}

async function getPkmnAbilitiesInfo() {
  const abilities = await pokeAPI.getAbilities(selectedPokemonData.value.abilities);
  selectedPokemonAbilities.value = abilities;
  localStorage.setItem(selectedPokemonAbilitiesKey, JSON.stringify(abilities));
}

async function getPkmnEvolutionChain(){
  const partialEndpoint = selectedPokemonSpeciesData.value.evolution_chain.url;
  const chains = await pokeAPI.getEvolutionChain(partialEndpoint);
  selectedPokemonEvolutionChain.value = chains;
  localStorage.setItem(selectedPokemonEvolutionChainKey, JSON.stringify(chains));
}

async function getPkmnEncounters(){
  const id = selectedPokemonData.value.id;
  const encounters = await pokeAPI.getPokemonLocationAreas(id);
  selectedPokemonEncounters.value = encounters;
  localStorage.setItem(selectedPokemonEncountersKey, JSON.stringify(encounters));
}

async function updatePokemonData(id: number){
  if(selectedPokemonData.value.id != id){
    isLoaded.value = false;
    await getPkmnDataInfo(id);
    await getPkmnSpeciesInfo();
    await getPkmnEvolutionChain();
    await getPkmnEncounters();
    await getPkmnAbilitiesInfo();
    isLoaded.value = true; 
  }
}

function getInitialPokemonData(){ 
  const retrievedPokemonData = helpers.retrieveLocalStorageData(selectedPokemonDataKey) as PokemonData;

  if(!retrievedPokemonData){
    return;
  }

  selectedPokemonData.value = retrievedPokemonData;
  pokemonStore.changePokemon(retrievedPokemonData.id);

  selectedPokemonSpeciesData.value = helpers.retrieveLocalStorageData(selectedSpeciesDataKey);
  selectedPokemonAbilities.value = helpers.retrieveLocalStorageData(selectedPokemonAbilitiesKey);
  selectedPokemonEvolutionChain.value = helpers.retrieveLocalStorageData(selectedPokemonEvolutionChainKey);
  selectedPokemonEncounters.value = helpers.retrieveLocalStorageData(selectedPokemonEncountersKey);

  isLoaded.value = true; 
}

watch(pokemonStore, (newValue, oldValue) => {
  updatePokemonData(pokemonStore.data.id);
});

onMounted(() => {
  getInitialPokemonData();
});

</script>

<template>
  <div v-if="!isLoaded && pokemonStore.isDefaultSelection"><Skeleton/></div>
  <div v-else class="p-3 shadow-lg">
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