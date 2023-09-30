<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import type { Move, PokemonData, DefaultDTO, PokemonTypes } from '@/types';
import Pokedex from '@/components/Pokedex.vue';
import search from '@/components/SearchComponent.vue'
import DetailHeader from "@/components/DetailHeader.vue";
import defaultPokemonEntry from '../json/defaultPokemon.json';
import defaultPokemonSpeciesEntry from '../json/defaultPokemonSpecies.json';

//const selectedPokemonData = ref<PokemonData>(defaultPokemonEntry); 

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
        <div> {{ defaultPokemonSpeciesEntry.flavor_text_entries[0].flavor_text }} </div>
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