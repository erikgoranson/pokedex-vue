<script setup lang="ts">
import { ref, onMounted, defineProps } from 'vue';
import axios from 'axios';
import Grid from '@/components/Grid.vue';
import type { SearchItem } from '@/components/types';

interface PokedexInfo {
    name: string,
    pokemon_entries: PokemonEntry[]
}

interface PokemonEntry {
    entry_number: string, //may need to update types.ts
    pokemon_species: PokemonSpecies
}

interface PokemonSpecies {
    name: string,
    url: string
}

const props = defineProps({
    gridColumns: {
      type: Array<string>,
      default: ['id', 'name', 'national id', 'types']
    },
    localStorageKey: {
      type: String,
      default: 'selectedPokedex'
    }
})

const gridData = ref<SearchItem[]>(<SearchItem[]>[]);
const searchQuery = ref('');
const pokedex = ref<PokedexInfo>(<PokedexInfo>{});

function getCachedPokedexData(){
  const entries: PokemonEntry[] = localStorage.getItem(props.localStorageKey) ? JSON.parse(localStorage.getItem(props.localStorageKey) || '') : [];
  return entries;
}

function populateSearchData() {
  //retreive any pokedex previously cached to localStorage 
  let pokedexData: PokemonEntry[] = pokedex.value.pokemon_entries;
  if (pokedex.value.name == undefined){
    pokedexData = getCachedPokedexData();
  }
  
  //transform the data to the search panel's layout and apply it
  const searchData = pokedexData.map((p: PokemonEntry) => <SearchItem>{
    id: String(p.entry_number).padStart(3, "0"),
    name: p.pokemon_species.name,
    "national id": p.pokemon_species.url.slice(0, -1).split("/").pop() || '',
    types: 'type1/Type2',
    url: p.pokemon_species.url,
  })
  gridData.value = searchData;
}

async function fetchPokedexInfo() {
  //fetch selected pokedex's data unless already cached
  if (gridData.value.length == 0){
    const pokedexResponse = await axios.get<PokedexInfo>('https://pokeapi.co/api/v2/pokedex/2');
    console.log('api call was run');

    pokedex.value = pokedexResponse.data;
    localStorage.setItem(props.localStorageKey, JSON.stringify(pokedexResponse.data.pokemon_entries));
    console.log('cached results to the local storage');

    populateSearchData(); 
  }
}

onMounted(async () => {
    populateSearchData(),
    await fetchPokedexInfo()
});
</script>

<template>
  <div class=" bg-neutral-900 p-6 text-neutral-700 shadow-lg dark:bg-white-600 dark:text-neutral-200 dark:shadow-black/30">
    <form id="search">Search <input name="query" v-model="searchQuery"></form>
    <div>
      <Grid 
        :data="gridData"
        :columns="props.gridColumns"
        :filter-key="searchQuery">
      </Grid>
    </div>
  </div>
</template>

<style scoped>
</style>