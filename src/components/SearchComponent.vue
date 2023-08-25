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

//doesnt need to be truly reactive since this data should not change except when new versions release
const nationalDex = computed(() => {
  const nationalDexKey = "nationalDex";
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

//plan is to run this whenever the app is first set up
async function buildNationalDexStoreCache(resync: boolean){
  const entries: PokemonEntry[] = [];
  let tempGrid2 = [] as GridItem[];
  const nationalDexTmp = [] as nationalDexEntry[];

  //check if "store" exists 
  const existingNationalDex = retrieveLocalStorageData("nationalDex") as nationalDexEntry[];
  console.log('finding existing national dex');

  //check whether to proceed
  if(existingNationalDex.length !== 0){
    console.log('national dex found')
    if(resync === false){
      console.log('canceling get national dex request...')
      return;
    }
  }

  //get national pokedex
  const nationalDexResponse: PokedexInfo = await axios
    .get('/src/assets/data/api/v2/pokedex/1/index.json')
    .then((response) => {
      return response.data;
    })

  console.log('national dex is below:')
  console.log(nationalDexResponse)

  //then build promises for all entries
  const promises = nationalDexResponse.pokemon_entries.map(m => {
    //nationalID should be the entry number
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

  //run the promise
  await Promise.all(promises).then(() => {
    console.log('nationaldex is ready')
  })

  //save into the store
  localStorage.setItem("nationalDex", JSON.stringify(nationalDexTmp));

}

//not just grid data cause I want localstorage to store ALL pokemon data if needed
//which will save load time on mount
//nationalDexEntry
interface nationalDexEntry {
  //tiny sprite url also?
  name: string,
  nationalID: number,
  type1: string,
  type2: string,
}

async function getPkmnEntriesForGrid(pokedexes: DefaultDTO[]){

  let tempGrid = [] as GridItem[]; //storing all griddaata in a single obj so it can all be returned at once instead of one at a time for the frontend 

  //all entry urls from provided pokedexes
  const allEntries: PokemonEntry[] = [];
  let allUrls = [] as string[];
  await axios.all(
    pokedexes.map((p) => axios
      .get<PokedexInfo>(`/src/assets/data${p.url}index.json`)
      .then((results) => {
        allUrls = results.data.pokemon_entries.map(x => x.pokemon_species.url);
      })
    )
  )

  //make sure the returned urls are uniqe
  console.log('running getPkmnEntries')
  const uniqueUrls = [...new Set(allUrls)];

  uniqueUrls.forEach(url => {
    const nationalId = url.slice(0, -1).split("/").pop();
    const match = nationalDex.value.filter(x => x.nationalID == Number(nationalId)); //should always return a match since we JUSt checked this. but localstorage could break or something, idk
    if (match.length == 0){
      console.log(`something went wrong. no match found for ${nationalId}`);
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
    await buildNationalDexStoreCache(false);
    getPkmnEntriesForGrid(versionStore.data.version_group.pokedexes);
});

watch(versionStore, (newValue, oldValue) => {
    getPkmnEntriesForGrid(versionStore.data.version_group.pokedexes);
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