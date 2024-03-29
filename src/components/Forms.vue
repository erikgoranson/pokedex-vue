<script setup lang="ts">
import InformationSection from './InformationSection.vue';
import type { DefaultDTO, PokemonSpeciesVariety, PokemonSprites, PokemonData, PokemonSpecies } from '@/types';
import { computed, ref, onMounted, watch } from 'vue';
import { usePokemonStore } from '@/stores/pokemon';
import pokeAPI from '@/services/pokeAPI';
import helpers from '@/helpers';


const props = defineProps({
  varieties: {
    type: Array as () => PokemonSpeciesVariety[],
    required: true
  },
  //forms again
  sprites : {
    type: Object as () => PokemonSprites,
    required: true,
  }
});

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

    console.log('getting new variety data...')

    const currentFormGroupPokemon = currentFormGroup.value.map(p => p.pokemon.name)
    console.log(currentFormGroupPokemon, 'current formgroup');

    const currentPokemon = pokemonStore.data.name;
    console.log(currentPokemon, '- from the pokemon store');

    const storedVarietyData: PokemonData[] = helpers.retrieveLocalStorageData(varietiesDataKey); 

    const previousFormGroupPokemon = (storedVarietyData) ? storedVarietyData.map(p => p.name) : [];
    console.log('wat')
    console.log(previousFormGroupPokemon, 'prev formgroup');

    if(!previousFormGroupPokemon.includes(currentPokemon)){
      const varieties = await pokeAPI.getPokemonVarieties(currentFormGroup.value);
      varietiesData.value = varieties;

      localStorage.setItem(varietiesDataKey, JSON.stringify(varieties));
      console.log('retrieved expanded varieties data and saved to local storage')
    }
  }
}

async function retrieveVarietyData(){ 
  varietiesData.value = helpers.retrieveLocalStorageData(varietiesDataKey); 
  if (!varietiesData.value){
    console.log('could not retrieve existing varieties data.')
    await populateVarietyData();
  } 
  else {
    console.log('successfully retrieved existing varieties data')
  }
}

onMounted(async () => {
  console.log('forms has mounted');
  retrieveVarietyData();

});

watch( currentFormGroup,(newValue, oldValue) => {
  console.log('currentFormGroup has changed');
  populateVarietyData();

});

</script>

<template>
    <InformationSection>
      <div class="flex flex-wrap items-center justify-center gap-1 mb-2" v-if="currentFormGroup.length > 0">
        <img 
          class="flex min-h-[50px] max-h-[50px] max-w-[50px] text-xs object-none  rounded-lg cursor-pointer hover:bg-red-700  " 
          v-for="form in varietiesData" 
          :src="form.sprites.versions['generation-viii'].icons.front_default" 
          :alt="form.name"
          @click="pokemonStore.changePokemon(form.id);"
          :class="{ 'bg-red-700' : form.id == pokemonStore.data.id  }"

        />
      </div>
    </InformationSection>
</template>