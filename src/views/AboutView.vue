<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import type { Move, ExtendedPokemonData, DefaultDTO, PokemonTypes } from '@/components/types';
import Pokedex from '@/components/Pokedex.vue';
import search from '@/components/SearchComponent.vue'
import DetailHeader from "@/components/DetailHeader.vue";
import BaseStatistics from '@/BaseStatistics.vue';
import SpeciesDetails from '@/SpeciesDetails.vue';
import Evolutions from '@/Evolutions.vue';
import Abilities from '@/Abilities.vue';
import Moves from '@/Moves.vue';
import Locations from '@/Locations.vue';
import Links from '@/Links.vue';

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
  id: 0,
  moves: [] as Move[],
  species: {},
  sprites: {},
}

const selectedPokemonData = ref<ExtendedPokemonData>(defaultPokemonEntry); 

</script>

<template>
    <div class=" h-screen flex w-full h-auto flex-col md:flex-row gap-6 p-6 justify-center overflow-auto">
        <!---<section class="bg-neutral-900 p-6 w-1/2">-->
          <section class="sm:col-span-2 flex justify-center overflow-y-auto bg-white-800">
            <!-- TESTING STUFF-->

            <div class="flex overflow-x-auto"><!--w-96-->
              <!--<DetailHeader :data="selectedPokemonData" />-->

              <div class="mb-6 grid grid-cols-3 divide-x flex flex-wrap items-center justify-center" id="pokemonHeader">
                <div><img src="@/assets/images/defaultPokemon.png" /></div>
        <div>
          <h1 class="text-0xl ">#{{defaultPokemonEntry.id}}</h1>
          <h5 class="text-3xl font-semibold">{{defaultPokemonEntry.name}}</h5>
          <div class="mt-2">
          <span class="type-container" v-for="t in defaultPokemonEntry.types" :class="t.type.name">
            {{ t.type.name }}
          </span></div>
        </div>
        <div> pokedex entry text goes here </div>
      </div>

            </div>

        </section>
        <section class="sm:col-span-2 flex justify-center overflow-auto bg-white-800">
            SEARCH TABLE HERE
        </section>
  </div>

</template>

<style>



</style>
