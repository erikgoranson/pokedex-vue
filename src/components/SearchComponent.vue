<script setup lang="ts">
import { ref, onMounted, defineProps, reactive, watch } from 'vue';
import axios, { all } from 'axios';
import Grid from '@/components/Grid.vue';
import type { SearchItem } from '@/components/types';
import type { DefaultDTO, PokedexInfo, PokemonEntry, PokemonSpecies, VersionGroup, Selection } from '@/components/types';
import { useVersionStore } from '@/stores/version';
import { usePokemonStore } from '@/stores/pokemon';

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

const versionStore = useVersionStore();
const pokemonStore = usePokemonStore();

const gridData = ref<SearchItem[]>(<SearchItem[]>[]);
const searchQuery = ref('');
const pokedex = ref<PokemonEntry[]>(<PokemonEntry[]>[]);

async function getPokedexes(pokedexes: DefaultDTO[]) {
  //console.log(pokedexes)
  const allEntries: PokemonEntry[] = [];
  const response = await axios.all(
    pokedexes.map((p) => axios
      .get(`/src/assets/data${p.url}index.json`)
      .then((results) => {
        allEntries.push(...results.data.pokemon_entries)
      })
    )
  )
  pokedex.value = allEntries;
  gridData.value = buildGridData(pokedex.value);
  populateDefaultEntry()
}

function buildGridData(pokedex: PokemonEntry[]){
  const gridData = pokedex.map((p: PokemonEntry) => 
    <SearchItem>{
      id: String(p.entry_number).padStart(3, "0"),
      name: p.pokemon_species.name,
      "national id": p.pokemon_species.url.slice(0, -1).split("/").pop() || '',
      types: 'type1/Type2',
      url: p.pokemon_species.url,
  })
  return gridData;
}

function populateDefaultEntry() {
  if(pokemonStore.isDefault){ 
    const currentDexFirstEntry = gridData.value[0];
    pokemonStore.changeDefaultPokemon(currentDexFirstEntry) 
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