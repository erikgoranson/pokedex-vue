<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import axios from 'axios';
import { usePokemonStore } from '@/stores/pokemon';
import type { Move, ExtendedPokemonData, DefaultDTO, PokemonTypes, PokemonSpecies, Genus, FlavorText, PokemonStat,PokemonAbility, Ability } from '@/components/types';
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
  evolution_chain: {},
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
      genus: 'birb',
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

async function getPkmnSpeciesInfo() {
  const id = selectedPokemonData.value.id;
  const endpoint = `/src/assets/data/api/v2/pokemon-species/${id}/index.json`;
  console.log('running getspecies... ');
  await axios.get<PokemonSpecies>(endpoint).then((result) => {
    //return result.data;
    selectedPokemonSpeciesData.value = result.data;
  })
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
}

watch(pokemonStore, (newValue, oldValue) => {
  selectedPokemonData.value = pokemonStore.data.payload as ExtendedPokemonData;
  getPkmnSpeciesInfo();
  getPkmnAbilitiesInfo();

});

onMounted(() => {
    selectedPokemonSpeciesData.value = defaultPokemonSpecies;
    getPkmnSpeciesInfo();
    getPkmnAbilitiesInfo();
});

//default value load-in
selectedPokemonData.value = defaultPokemonEntry; 
selectedPokemonSpeciesData.value = defaultPokemonSpecies;

</script>

<template>
    <div class=" bg-neutral-900 p-6 text-neutral-700 shadow-lg dark:bg-white-600 dark:text-neutral-200 dark:shadow-black/30">
      <Detail :data="selectedPokemonData" :species="selectedPokemonSpeciesData" />
      <BaseStatistics :stats="selectedPokemonData.stats"/>
      <hr />
      <SpeciesDetails :data="selectedPokemonData" :species="selectedPokemonSpeciesData"/>
      <hr />
      <Evolutions />
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

