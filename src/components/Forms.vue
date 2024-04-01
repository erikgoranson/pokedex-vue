<script setup lang="ts">
import InformationSection from './InformationSection.vue';
import type { DefaultDTO, PokemonSpeciesVariety, PokemonSprites, PokemonData, PokemonSpecies } from '@/types';
import { computed, ref, onMounted, watch } from 'vue';
import { usePokemonStore } from '@/stores/pokemon';
import pokeAPI from '@/services/pokeAPI';
import helpers from '@/helpers';
import { useShinyStore } from '@/stores/shiny';
import defaultPokemonSprite from '@/assets/images/defaultPokemon.png';

const props = defineProps({
  varieties: {
    type: Array as () => PokemonSpeciesVariety[],
    required: true
  },
});

const shinyStore = useShinyStore();
const pokemonStore = usePokemonStore();

const varietiesData = ref<PokemonData[]>([] as PokemonData[]);
const varietiesDataKey: string = 'selectedPokemonVarietiesData';

const currentFormGroup = computed(() => { 
  let { varieties } = props;
  let pokemonWithForms: PokemonSpeciesVariety[] = [];

  if (varieties.length > 1){
    pokemonWithForms = varieties;
  }

  return pokemonWithForms;
});

async function populateVarietyData(){ 
  if(currentFormGroup.value.length > 0){
    const currentPokemon = pokemonStore.data.name;

    const storedVarietyData: PokemonData[] = helpers.retrieveLocalStorageData(varietiesDataKey); 
    const previousFormGroupPokemon = (storedVarietyData) ? storedVarietyData.map(p => p.name) : [];

    if(!previousFormGroupPokemon.includes(currentPokemon)){
      const varieties = await pokeAPI.getPokemonVarieties(currentFormGroup.value);
      varietiesData.value = varieties;

      localStorage.setItem(varietiesDataKey, JSON.stringify(varieties));
    }
  }
}

async function retrieveVarietyData(){ 
  varietiesData.value = helpers.retrieveLocalStorageData(varietiesDataKey); 
  if (!varietiesData.value){
    await populateVarietyData();
  } 
}

onMounted(async () => {
  retrieveVarietyData();
});

watch( currentFormGroup,(newValue, oldValue) => {
  populateVarietyData();
});

</script>

<template>
    <InformationSection>
      <div></div>
      <div class="flex flex-wrap items-center justify-center gap-1 mb-2" >

        <!--shiny sparkle icon-->
        <div>
          <svg @click="shinyStore.toggle()" :class="{'fill-yellow-400': shinyStore.isShiny}" class="fill-black min-h-[50px] min-w-[50px] max-h-[50px] max-w-[50px] cursor-pointer hover:bg-yellow-100 rounded-full" style="width: 10em; height: 1em;vertical-align: middle;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M602.24 246.72a17.28 17.28 0 0 0-11.84-16.32l-42.88-14.4A90.56 90.56 0 0 1 490.24 160l-14.4-42.88a17.28 17.28 0 0 0-32 0L428.8 160a90.56 90.56 0 0 1-57.28 57.28l-42.88 14.4a17.28 17.28 0 0 0 0 32l42.88 14.4a90.56 90.56 0 0 1 57.28 57.28l14.4 42.88a17.28 17.28 0 0 0 32 0l14.4-42.88a90.56 90.56 0 0 1 57.28-57.28l42.88-14.4a17.28 17.28 0 0 0 12.48-16.96z m301.12 221.76l-48.32-16a101.44 101.44 0 0 1-64-64l-16-48.32a19.2 19.2 0 0 0-36.8 0l-16 48.32a101.44 101.44 0 0 1-64 64l-48.32 16a19.2 19.2 0 0 0 0 36.8l48.32 16a101.44 101.44 0 0 1 64 64l16 48.32a19.2 19.2 0 0 0 36.8 0l16-48.32a101.44 101.44 0 0 1 64-64l48.32-16a19.2 19.2 0 0 0 0-36.8z m-376.64 195.52l-64-20.8a131.84 131.84 0 0 1-83.52-83.52l-20.8-64a25.28 25.28 0 0 0-47.68 0l-20.8 64a131.84 131.84 0 0 1-82.24 83.52l-64 20.8a25.28 25.28 0 0 0 0 47.68l64 20.8a131.84 131.84 0 0 1 83.52 83.84l20.8 64a25.28 25.28 0 0 0 47.68 0l20.8-64a131.84 131.84 0 0 1 83.52-83.52l64-20.8a25.28 25.28 0 0 0 0-47.68z" /></svg>
        </div>

        <img 
          v-if="currentFormGroup.length > 0"
          class="flex min-h-[50px] max-h-[50px] max-w-[50px] text-xs object-none rounded-lg cursor-pointer hover:bg-red-700" 
          v-for="form in varietiesData" 
          :src="form.sprites.versions['generation-viii'].icons.front_default == null ? defaultPokemonSprite : form.sprites.versions['generation-viii'].icons.front_default" 
          :alt="form.name"
          @click="pokemonStore.changePokemon(form.id);"
          :class="{ 'bg-red-700' : form.id == pokemonStore.data.id  }"
        />
      </div>
    </InformationSection>
</template>