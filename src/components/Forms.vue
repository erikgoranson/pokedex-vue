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
      <div class="flex flex-wrap items-center justify-center gap-1 mb-2" v-if="currentFormGroup.length > 0">
        <img 
          class="flex min-h-[50px] max-h-[50px] max-w-[50px] text-xs object-none rounded-lg cursor-pointer hover:bg-red-700" 
          v-for="form in varietiesData" 
          :src="form.sprites.versions['generation-viii'].icons.front_default == null ? 'src/assets/images/defaultPokemon.png' : form.sprites.versions['generation-viii'].icons.front_default" 
          :alt="form.name"
          @click="pokemonStore.changePokemon(form.id);"
          :class="{ 'bg-red-700' : form.id == pokemonStore.data.id  }"
        />
      </div>
    </InformationSection>
</template>