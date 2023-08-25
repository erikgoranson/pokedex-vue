<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import axios from 'axios';
import { usePokemonStore } from '@/stores/pokemon';
import type { Move, ExtendedPokemonData, DefaultDTO, PokemonTypes, PokemonSpecies, Genus, FlavorText, PokemonStat,PokemonAbility, Ability, EvolutionChain } from '@/components/types';
import Detail from './DetailHeader.vue';
import BaseStatistics from './BaseStatistics.vue';
import SpeciesDetails from './SpeciesDetails.vue';
import Evolutions from './Evolutions.vue';
import Abilities from './Abilities.vue';
import Moves from './Moves.vue';
import Locations from './Locations.vue';
import Links from './Links.vue';

const defaultPokemonEntry = <ExtendedPokemonData>{
  name: 'missingno.',
  types: [
    { slot: 1,
      type: <DefaultDTO>{ 
        name: 'bird',
      }
    },
    { slot: 2,
      type: <DefaultDTO>{ 
        name: 'normal',
      }
    },
  ] as PokemonTypes[], 
  id: 18,
  height: 0,
  weight: 0,
  moves: [] as Move[],
  species: { name: '', url: '/src/assets/data/api/v2/pokemon-species/666/index.json' }, //default or random for missingno, whatever
  sprites: {},
  stats: [] as PokemonStat[],
  abilities: [] as PokemonAbility[],
}

const defaultPokemonSpecies = <PokemonSpecies>{
  base_happiness: 0,
  capture_rate: 0,
  color: {},
  egg_groups:{},
  evolution_chain: { url: '/api/v2/evolution-chain/1/',} as DefaultDTO,
  evolves_from_species: {},
  flavor_text_entries: [
    {
      flavor_text: 'コメント さくせいちゅう',
      language: <DefaultDTO>{ 
        name: 'en',
        url: '???'
      },
      version: <DefaultDTO>{
        name: '???',
        url: '???',
      }
    },
  ] as FlavorText[],
  forms_switchable: false,
  gender_rate: 0,
  genera: [
    {
      genus: 'birb "pokemon"',
      language: <DefaultDTO>{ 
        name: 'en',
        url: '???'
      }
    },
  ] as Genus[], 
  generation: {},
  growth_rate: false,
  habitat: false,
  has_gender_differences: false,
  hatch_counter: 999,
  id: 0,
  is_baby: false,
  is_legendary: true,
  is_mythical: true,
  name: 'missingno.',
  order: 0,
  shape: {},
}

const pokemonStore = usePokemonStore();
const selectedPokemonData = ref<ExtendedPokemonData>(defaultPokemonEntry); 

const selectedPokemonSpeciesData = ref<PokemonSpecies>({} as PokemonSpecies); 

const selectedPokemonAbilities = ref<Ability[]>([] as Ability[]); 

const selectedPokemonEvolutionChain = ref<EvolutionChain>({} as EvolutionChain);

async function getPkmnDataInfo(id: number){
  const endpoint = `/src/assets/data/api/v2/pokemon/${id}/index.json`;
  await axios.get<ExtendedPokemonData>(endpoint)
  .then((result) => {
    selectedPokemonData.value = result.data;
    getPkmnSpeciesInfo();
    getPkmnAbilitiesInfo();

    //isLoaded = true;
  })
}

async function getPkmnSpeciesInfo() {
  const id = selectedPokemonData.value.id;
  const endpoint = `/src/assets/data/api/v2/pokemon-species/${id}/index.json`;
  //console.log('running getspecies... ');
  await axios.get<PokemonSpecies>(endpoint).then((result) => {
    //return result.data;
    selectedPokemonSpeciesData.value = result.data;
  })

  getPkmnEvolutionChain();
}

async function getPkmnAbilitiesInfo() {
  selectedPokemonAbilities.value = [];
  selectedPokemonData.value.abilities.forEach(async ability => {
    const partialEndpoint = ability.ability.url;
    const fullEndpoint = `/src/assets/data${partialEndpoint}index.json`;

    await axios.get<Ability>(fullEndpoint).then((result) => {
      selectedPokemonAbilities.value.push(result.data);
    })
  })
  isLoaded = true; //maybe here?
}

async function getPkmnEvolutionChain(){
  const partialEndpoint = selectedPokemonSpeciesData.value.evolution_chain.url;
  const fullEndpoint = `/src/assets/data${partialEndpoint}index.json`;
  await axios.get<EvolutionChain>(fullEndpoint)
  .then((result) => {
    selectedPokemonEvolutionChain.value = result.data;
  })
}

watch(pokemonStore, (newValue, oldValue) => {
  getPkmnDataInfo(pokemonStore.data["national ID"]);
});

onMounted(() => {
});

//default value load-in
selectedPokemonData.value = defaultPokemonEntry; 
selectedPokemonSpeciesData.value = defaultPokemonSpecies;

let isLoaded = false;

</script>

<template>
  <div v-if="!isLoaded">LOADING...</div>
    <div class=" bg-neutral-900 p-6 text-neutral-700 shadow-lg dark:bg-white-600 dark:text-neutral-200 dark:shadow-black/30">
      <Detail :data="selectedPokemonData" :species="selectedPokemonSpeciesData" />
      <BaseStatistics :stats="selectedPokemonData.stats"/>
      <hr />
      <SpeciesDetails :data="selectedPokemonData" :species="selectedPokemonSpeciesData"/>
      <hr />
      <Evolutions :chain="selectedPokemonEvolutionChain" :previous="selectedPokemonSpeciesData.evolves_from_species"/>
      <hr />
      <Abilities :abilities="selectedPokemonData.abilities" :abilitiesInfo="selectedPokemonAbilities"/>
      <hr />
      <Moves :data="selectedPokemonData.moves" />
      <hr />
      <Locations />
      <hr />
      <Links />
    </div>
</template>

