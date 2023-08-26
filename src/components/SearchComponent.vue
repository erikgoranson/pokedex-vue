<script setup lang="ts">
import { ref, onMounted, defineProps, watch } from 'vue';
import axios, { all } from 'axios';
import Grid from '@/components/Grid.vue';
import type { GridItem, ExtendedPokemonData, DefaultDTO, PokemonEntry, PokemonTypes, PokemonData, PokedexInfo } from '@/components/types';
import { useVersionStore } from '@/stores/version';
import { usePokemonStore } from '@/stores/pokemon';
import { computed } from 'vue';

type Slots = 1 | 2;

interface NationalDexEntry {
  //tiny sprite url also?
  name: string,
  nationalID: number,
  type1: string,
  type2: string,
}

const gridColumns: string[] = ['id', 'name', 'type1', 'type2'];

const versionStore = useVersionStore();
const pokemonStore = usePokemonStore();

const gridData = ref<GridItem[]>(<GridItem[]>[]);
const searchQuery = ref('');

const nationalDexKey = "nationalDex";
const cacheExists = ref(false);

const nationalDex = computed(() => {
  const cacheState = cacheExists.value;
  const entries = retrieveLocalStorageData(nationalDexKey) as NationalDexEntry[];
  return entries;
})

function buildGridItem(pkmn: NationalDexEntry){
  return <GridItem>{
    id: pkmn.nationalID, 
    name: pkmn.name,
    type1: pkmn.type1,
    type2: pkmn.type2,
  }
}

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

function populateDefaultEntry() {
  if(pokemonStore.isDefault){ 
    const currentDexFirstEntry = gridData.value[0];
    pokemonStore.changeDefaultPokemon(currentDexFirstEntry);
  }
}

async function buildNationalDexStoreCache(resync: boolean){
  const nationalDexTmp = [] as NationalDexEntry[];

  //check whether to proceed
  if(nationalDex.value.length !== 0){ //cache already exists
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
        const dexEntry = <NationalDexEntry>{
          nationalID: nationalId,
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
}

async function getGridData(pokedexes: DefaultDTO[]){

  let tempGrid = [] as GridItem[]; 

  let allUrls = [] as string[];
  await axios.all(
    pokedexes.map((p) => axios
      .get<PokedexInfo>(`/src/assets/data${p.url}index.json`)
      .then((results) => {
        allUrls = results.data.pokemon_entries.map(x => x.pokemon_species.url);
      })
    )
  )
  const uniqueUrls = [...new Set(allUrls)];

  uniqueUrls.forEach(url => {
    const nationalId = url.slice(0, -1).split("/").pop();
    const match = nationalDex.value.filter(x => x.nationalID == Number(nationalId)); 
    if (match.length == 0){
      console.log(`no match found for ${nationalId}`);
    }
    const griditem = buildGridItem(match[0]);

    tempGrid.push(griditem)
  })

  gridData.value = tempGrid;
  populateDefaultEntry();
}

onMounted(async () => {
  buildNationalDexStoreCache(false);
});

watch(versionStore, (newValue, oldValue) => {
  getGridData(versionStore.data.version_group.pokedexes);
}); 

watch(cacheExists, (newValue, oldValue) => {
  if(cacheExists.value){
    getGridData(versionStore.data.version_group.pokedexes);
  }
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