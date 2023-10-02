<script setup lang="ts">
import { ref, onMounted, defineProps, watch } from 'vue';
import Grid from '@/components/Grid.vue';
import type { GridItem, DefaultDTO } from '@/types';
import { useVersionStore } from '@/stores/version';
import { usePokemonStore } from '@/stores/pokemon';
import pokeAPI from '@/services/pokeAPI';

const versionStore = useVersionStore();
const pokemonStore = usePokemonStore();

const gridData = ref<GridItem[]>(<GridItem[]>[]);
const searchQuery = ref('');

const nationalDex = ref<GridItem[]>([]);
const nationalDexKey = "nationalDex";
const cacheExists = ref(false); 

function retrieveLocalStorageData(key: string){
    const data = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key) || '') : [];
    return data;
}

///overwrites the user's previous pokemon selection with the first entry of a recently loaded pokedex
function populateDefaultEntry() {
  if(pokemonStore.isDefaultSelection){ 
    const currentDexFirstEntry = gridData.value[0]; 
    pokemonStore.changePokemon(currentDexFirstEntry.id);
  }
}

//returns a list of all possible pokemon via the national dex and also stores the data to localStorage for later use 
async function buildNationalDexStoreCache(resync: boolean){
  //const nationalDexTmp = [] as GridItem[];

  //exit if nationalDex already populated
  if(nationalDex.value.length !== 0){
    cacheExists.value = true;
    if(resync === false){ //resync was not requested 
      return;
    }
  }

  //get national pokedex
  const nationalDexResponse = await pokeAPI.getPokedex(1);

  //build promises for all entries
  const nationalDexTmp = await pokeAPI.getGridItems(nationalDexResponse);
  localStorage.setItem(nationalDexKey, JSON.stringify(nationalDexTmp));
  cacheExists.value = true;
  nationalDex.value = nationalDexTmp;
}

//populates the search grid with pokemon from the currently selected versiongroup's available pokedexes
async function getGridData(pokedexes: DefaultDTO[]){
  let tempGrid = [] as GridItem[]; 
  const pokedexEntries = await pokeAPI.getPokedexEntries(pokedexes);

  //find matches from the nationalDex 
  pokedexEntries.forEach(url => {
    const nationalId = url.slice(0, -1).split("/").pop();
    const match = nationalDex.value.find(x => x.id == Number(nationalId)); 
    if (match){
      tempGrid.push(match);
    }
  })

  gridData.value = tempGrid;
  populateDefaultEntry(); 
}

onMounted(async () => {
  nationalDex.value = retrieveLocalStorageData(nationalDexKey) as GridItem[];
  await buildNationalDexStoreCache(false);
  getGridData(versionStore.data.version_group.pokedexes);
});

watch(versionStore, (newValue, oldValue) => {
  pokemonStore.isDefaultSelection = true; 
  getGridData(versionStore.data.version_group.pokedexes);
}); 

</script>

<template>
  <div>
    <form id="search"><input class="w-full bg-gray-100 border" name="query" placeholder="Type to search" v-model="searchQuery"></form>
  </div>
  <div class="">
    <div class="flex h-screen justify-center overflow-y-auto overflow-x-hidden">
      <Grid :data="gridData" :filterKey="searchQuery" />
    </div>
  </div>
</template>

<style scoped>
</style>