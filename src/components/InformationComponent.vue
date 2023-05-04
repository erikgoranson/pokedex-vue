<script setup lang="ts">
import { usePokemonStore } from '@/stores/pokemon';
import axios from 'axios';
import { reactive, ref, watch, type PropType } from "vue";
import type { SearchItem } from '@/components/types';

interface PokemonData {
  name: string,
  id: number,
  types: PokemonTypes
}

interface PokemonTypes {
  slot: number,
  type: PokemonType[],
}

interface PokemonType {
  name: string,
  url: string,
}

const props = defineProps({
  defaultPkmn: {
    type: Object as PropType<PokemonData>,
    default: {
      name: "missingno",
      id: 0,
      types: <PokemonTypes>{
        slot:0,
        type: [
          <PokemonType>{
            name: 'bird',
            url: ''
          },
          <PokemonType>{
            name: 'normal',
            url: ''
          }
        ] as PokemonType[]
      }
    } //import
  }
})

const store = usePokemonStore();
const selectedPokemonData = ref<PokemonData>({} as PokemonData);
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

</script>

<template>
  <div>
    <p v-if="store.data.name">{{ store.data }}</p>
    <p v-else>{{ props.defaultPkmn }}</p>
    <br>
    <p>get info from stuff:</p>
    <p>{{ getPokemonEndpoint(store.data) }}</p>
    <br>
    <p>the output</p>
    <br>
    <!--<p>{{ infos.types }}</p>-->

    <p v-if="selectedPokemonData.id">#{{ selectedPokemonData.id }}<br>{{ selectedPokemonData.name }}<br>
      <span v-for="(type, index) in selectedPokemonData.types as PokemonTypes">
      {{ type.type.name }}
      </span>
    </p>
    <p v-else>
      #{{ props.defaultPkmn.id }}<br>
      {{ props.defaultPkmn.name }}<br>
      <span v-for="(type, index) in props.defaultPkmn.types as PokemonTypes">
        {{ type }} 
      </span>
    </p>
  </div>
</template>

