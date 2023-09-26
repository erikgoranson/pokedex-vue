<script setup lang="ts">
import { ref, onMounted, defineProps, watch } from 'vue';
import axios, { all } from 'axios';
import Grid from '@/components/Grid.vue';
import type { GridItem, DefaultDTO, PokemonEntry, PokemonTypes, PokemonData, PokedexInfo } from '@/components/types';
import { useVersionStore } from '@/stores/version';
import { usePokemonStore } from '@/stores/pokemon';

type Slots = 1 | 2;

const versionStore = useVersionStore();
const pokemonStore = usePokemonStore();

const gridColumns: string[] = ['id', 'name', 'type1', 'type2'];
const gridData = ref<GridItem[]>(<GridItem[]>[]);
const searchQuery = ref('');

const nationalDex = ref<GridItem[]>([]);
const nationalDexKey = "nationalDex";
const cacheExists = ref(false); 

///prints the provided pokemon type as a string at the given slot
function getPokemonType(types: PokemonTypes[], slot: Slots){ 
  let final: string = ''
  const theType: PokemonTypes = types.find((t) => t.slot === slot) || {} as PokemonTypes;
  
  if ( theType.slot ) {
    final = theType.type.name;
  }
  return final;
}

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
  const nationalDexTmp = [] as GridItem[];

  //exit if nationalDex already populated
  if(nationalDex.value.length !== 0){
    cacheExists.value = true;
    if(resync === false){ //resync was not requested 
      return;
    }
  }

  //get national pokedex
  const nationalDexResponse: PokedexInfo = await axios
    .get('/src/assets/data/api/v2/pokedex/1/index.json')
    .then((response) => {
      return response.data;
    })

  //build promises for all entries
  const promises = nationalDexResponse.pokemon_entries.map(m => {
    const nationalId = m.entry_number;
    const endpoint = `/src/assets/data/api/v2/pokemon/${nationalId}/index.json`;
    return axios.get<PokemonData>(endpoint)
      .then((result) => {
        const dexEntry = <GridItem>{
          id: nationalId,
          name: result.data.name,
          type1: getPokemonType(result.data.types, 1),
          type2: getPokemonType(result.data.types, 2),
        }
        nationalDexTmp.push(dexEntry);
    })
  })

  await Promise.all(promises).then(() => {
    console.log('national dex has been cached');
  })

  localStorage.setItem(nationalDexKey, JSON.stringify(nationalDexTmp));
  cacheExists.value = true;
  nationalDex.value = nationalDexTmp;
}

//populates the search grid with pokemon from the currently selected versiongroup's available pokedexes
async function getGridData(pokedexes: DefaultDTO[]){
  let tempGrid = [] as GridItem[]; 
  let allUrls = [] as string[];

  const promises = pokedexes.map((p) => {
    return axios.get<PokedexInfo>(`/src/assets/data${p.url}index.json`)
    .then((results) => {
      allUrls.push(...results.data.pokemon_entries.map(x => x.pokemon_species.url))
    })
  })

  await Promise.all(promises).then(() => {
    console.log('allUrls has been filled');
  })
  
  const uniqueUrls = [...new Set(allUrls)];

  //find matches from the nationalDex 
  uniqueUrls.forEach(url => {
    const nationalId = url.slice(0, -1).split("/").pop();
    const match = nationalDex.value.find(x => x.id == Number(nationalId)); 
    if (match){
      console.log(`match found for ${nationalId}`); 
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
    <form id="search"><input class="w-full" name="query" placeholder="Type to search" v-model="searchQuery"></form>
  </div>
  <div class="">
    <div class="flex h-screen justify-center overflow-y-auto overflow-x-hidden">
      <Grid 
        :data="gridData"
        :columns="gridColumns"
        :filter-key="searchQuery">
      </Grid>
    </div>
  </div>
</template>

<style scoped>
</style>