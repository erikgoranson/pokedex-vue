<script setup lang="ts">
import { ref, onMounted, defineProps, watch } from 'vue';
import axios, { all } from 'axios';
import Grid from '@/components/Grid.vue';
import type { GridItem, ExtendedPokemonData, DefaultDTO, PokemonEntry, PokemonTypes, PokemonData, PokedexInfo } from '@/components/types';
import { useVersionStore } from '@/stores/version';
import { usePokemonStore } from '@/stores/pokemon';
import { computed } from 'vue';

type Slots = 1 | 2;

const props = defineProps({
    gridColumns: { //headers
      type: Array<string>, 
      default: ['id', 'name', 'national ID', 'type1', 'type2']
    }
})

const versionStore = useVersionStore();
const pokemonStore = usePokemonStore();

const gridData = ref<GridItem[]>(<GridItem[]>[]);
const searchQuery = ref('');

const nationalDexKey = "nationalDex";
const cacheExists = ref(false);

//doesnt need to be truly reactive since this data should not change except when new versions release
const nationalDex = computed(() => {
  const cacheState = cacheExists.value;
  const entries = retrieveLocalStorageData(nationalDexKey) as nationalDexEntry[];
  return entries;
})

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
  const nationalDexTmp = [] as nationalDexEntry[];

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
        const dexEntry = <nationalDexEntry>{
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

interface nationalDexEntry {
  //tiny sprite url also?
  name: string,
  nationalID: number,
  type1: string,
  type2: string,
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

function buildGridItem(pkmn: nationalDexEntry){
  return <GridItem>{
    id: pkmn.nationalID, //regional ID
    name: pkmn.name,
    "national ID": pkmn.nationalID, //getting rid of this soon
    type1: pkmn.type1,
    type2: pkmn.type2,
    payload: {entry_number: String(pkmn.nationalID)} as ExtendedPokemonData, //getting rid of this prop later
  }
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