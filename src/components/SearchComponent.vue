<script setup lang="ts">
import { ref, onMounted, defineProps, watch } from 'vue';
import axios, { all } from 'axios';
import Grid from '@/components/Grid.vue';
import type { GridItem, ExtendedPokemonData, DefaultDTO, PokemonEntry, PokemonTypes } from '@/components/types';
import { useVersionStore } from '@/stores/version';
import { usePokemonStore } from '@/stores/pokemon';

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

async function getPokedexes(pokedexes: DefaultDTO[]) {
  const allEntries: PokemonEntry[] = [];
  const pkmnData: ExtendedPokemonData[] = [];

  await axios.all(
    pokedexes.map((p) => axios
      .get(`/src/assets/data${p.url}index.json`)
      .then((results) => {
        allEntries.push(...results.data.pokemon_entries)
      })
    )
  )
  
  const promises = allEntries.map((a) => {
    const nationalID = a.pokemon_species.url.slice(0, -1).split("/").pop(); //check
    const endpoint = `/src/assets/data/api/v2/pokemon/${nationalID}/index.json`;
    return axios.get<ExtendedPokemonData>(endpoint)
      .then((result) => {
        //pokedexD.value = result.data;
        result.data.entry_number = a.entry_number
        pkmnData.push(result.data);
    })
  })
  
  const results = await Promise.all(promises).then(() => buildGridData(pkmnData)); 
  const uniqueResults = results.reduce((accumulator: GridItem[], current: GridItem) => {
    if (!accumulator.find((item) => item.id === current.id)) {
      accumulator.push(current);
    }
    return accumulator;
  }, []); 
  
  gridData.value = uniqueResults//.sort((a, b) => a.id - b.id);
  populateDefaultEntry();
}

function getPokemonType(types: PokemonTypes[], slot: Slots){ 
  let final: string = ''
  const theType: PokemonTypes = types.find((t) => t.slot === slot) || {} as PokemonTypes;
  
  if ( theType.slot ) {
    final = theType.type.name;
  }
  return final;
}

function buildGridData(pokemonData: ExtendedPokemonData[]){
  const gridData: GridItem[] = [];
  
  pokemonData.map((p: ExtendedPokemonData) => {
    const gridItem = <GridItem>{
      id: Number(p.entry_number), //regional ID
      name: p.name,
      "national ID": p.id,
      type1: getPokemonType(p.types, 1),
      type2: getPokemonType(p.types, 2),
      payload: p,
    }
    gridData.push(gridItem);
  }) 

  return gridData;
}

function populateDefaultEntry() {
  if(pokemonStore.isDefault){ 
    const currentDexFirstEntry = gridData.value[0];
    pokemonStore.changeDefaultPokemon(currentDexFirstEntry);
  }
}

onMounted(async () => {
    getPokedexes(versionStore.data.version_group.pokedexes);
    
});

watch(versionStore, (newValue, oldValue) => {
    getPokedexes(versionStore.data.version_group.pokedexes);
    
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