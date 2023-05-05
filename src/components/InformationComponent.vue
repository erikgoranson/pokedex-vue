<script setup lang="ts">
import { usePokemonStore } from '@/stores/pokemon';
import axios from 'axios';
import { reactive, ref, watch, type PropType, onMounted } from "vue";
import type { SearchItem } from '@/components/types';
import pkmn from '@/json/defaultPokemon.json'

import Detail from './DetailHeader.vue';
import BaseStatistics from './BaseStatistics.vue';
import SpeciesDetails from './SpeciesDetails.vue';
import Evolutions from './Evolutions.vue';
import Abilities from './Abilities.vue';
import Moves from './Moves.vue';
import Locations from './Locations.vue';
import Links from './Links.vue';

interface PokemonData {
  name: string,
  id: number,
  types: PokemonTypes,
  //temp
  moves: Array<Move>, 
  order: number,
  species: Array<DefaultDTO>,
  sprites: {}, //later
  stats: Array<Stat>,
}

interface DefaultDTO {
  name: string,
  url: string,
}

interface PokemonTypes {
  slot: number,
  type: PokemonType[],
}

interface PokemonType {
  name: string,
  url: string,
}

interface Move extends DefaultDTO { 
  version_group_details: {},
}

interface Stat {
  base_stat: number,
  effort: 0,
  stat: DefaultDTO,
}

const props = defineProps({
  defaultPkmn: {
    type: Object as PropType<PokemonData>,
    default: {
      name: pkmn.name,
      id: pkmn.id,
      types: pkmn.types,
      moves: pkmn.moves, 
      order: pkmn.order,
      species: pkmn.species,
      sprites: pkmn.sprites,
      stats: pkmn.stats,
    } //import
  }
})

const store = usePokemonStore();
const selectedPokemonData = ref<PokemonData>(props.defaultPkmn);
//const selectPokemonSpeciesData = 

const pokemon = reactive(store);
const pokemonUpdatesCount = ref(0);

function getPokemonEndpoint(payload: SearchItem){
  return payload ? `https://pokeapi.co/api/v2/pokemon/${payload['national id']}` : '';
}

async function ashFetchum(url: string){
  const response = await axios
    .get<PokemonData>(url)
    .then(response => {
      selectedPokemonData.value = response.data;
    });

    console.log(selectedPokemonData.value)
  return response;
}

const increasePokemonUpdatesCount = () => {
  pokemonUpdatesCount.value++;
  console.log('something heppen'); //debug
  console.log(pokemonUpdatesCount.value); //debug
};

watch(pokemon, (newValue, oldValue) => {
  increasePokemonUpdatesCount(); 
  let selectedPokemonEndpoint = getPokemonEndpoint(store.data);
  ashFetchum(selectedPokemonEndpoint);
});

onMounted(() => {
    selectedPokemonData.value = props.defaultPkmn;
});

</script>

<template>
    <div class=" bg-neutral-900 p-6 text-neutral-700 shadow-lg dark:bg-white-600 dark:text-neutral-200 dark:shadow-black/30">
      <Detail :data="selectedPokemonData"></Detail>
      <hr />
      <BaseStatistics></BaseStatistics>
      <hr />
      <SpeciesDetails></SpeciesDetails>
      <hr />
      <Evolutions></Evolutions>
      <hr />
      <Abilities></Abilities>
      <hr />
      <Moves></Moves>
      <hr />
      <Locations></Locations>
      <hr />
      <Links></Links>
    </div>
</template>

