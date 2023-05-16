<script setup lang="ts">
import InformationSection from './InformationSection.vue';
import type { ExtendedPokemonData } from '@/components/types';

interface PokemonData {
  name: string,
  id: number,
  types: PokemonTypes
}

interface PokemonTypes {
  slot: number,
  type: PokemonType[],
}

interface PokemonType{
  name: string,
  url: string,
}

const props = defineProps({
  data: {
    type: Object as () => ExtendedPokemonData,
    required: true
  },
})

</script>

<template>

  <InformationSection>
    <div class= "container max-w-screen-lg mx-auto flex justify-center">
      <div class="mb-6 grid grid-cols-3 divide-x flex flex-wrap w-screen items-center justify-center" id="pokemonHeader">
        <div><img src="@/assets/images/defaultPokemon.png" /></div> <!--replace later-->
        <div>
          <h1 class="text-0xl ">#{{props.data.id}}</h1>
          <h5 class="text-3xl font-semibold">{{props.data.name}}</h5>
          <span class="mb-3 mr-2 text-0xl" v-for="type in (props.data.types as any)" :key="type">{{ type.type.name }}</span>
        </div>
        <div>Pokedex Entry Text Goes Here and Stuff</div>
      </div>
    </div>
  </InformationSection>

</template>

