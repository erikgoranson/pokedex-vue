<script setup lang="ts">
import InformationSection from './InformationSection.vue';
import type { DefaultDTO, PokemonSpeciesVariety, PokemonSprites } from '@/types';
import { computed } from 'vue';
import { usePokemonStore } from '@/stores/pokemon';

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
})

const pokemonStore = usePokemonStore();

const iconUrl = computed(() => {
  //anything >gen 8 doesn't have icons per the pokeAPI apparently. so that sucks
  const spriteURL = props.sprites.versions['generation-viii'].icons.front_default;
  const defaultSpriteURL = '/src/assets/images/defaultPokemon.png'; 

  return (spriteURL) ? spriteURL : defaultSpriteURL;
});

const variationIconUrls = computed(() => {
  const basePokemonUrl = 'https://pokeapi.co/api/v2/pokemon/';
  const baseIconUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/';
  const maxNationalID = 898; //pokeAPI doesn't have any icons for mons following gen 8
  const minVariationID = 10001; //range is where the pokeAPI stores alt forms
  const postGmaxVariationID = 10229; //range where icons run out cause > gen 8
  const defaultSpriteURL = '/src/assets/images/defaultPokemon.png';

  let formsUrls = [] as DefaultDTO[];

  const defaultVarietyNationalURL = props.varieties.find(x => x.is_default)?.pokemon.url;
  const defaultVarietyNationalID = defaultVarietyNationalURL?.replace(basePokemonUrl,'').replace('/','');

  if(hasVariations){
    formsUrls = props.varieties.map((v => {
      const id = v.pokemon.url.replace(basePokemonUrl,'').replace('/','');
      
      if(Number(id) > maxNationalID && Number(id) < minVariationID){ 
        return { 
          name:v.pokemon.name, 
          url: defaultSpriteURL,
        } as DefaultDTO;
      }

      if(Number(id) >= postGmaxVariationID){
        return {
          name:v.pokemon.name, 
          url: defaultSpriteURL,
        } as DefaultDTO;
      }

      //galar check
      if(v.pokemon.name.includes('galar')){
        return {
            name:v.pokemon.name, 
            url: `${baseIconUrl}${defaultVarietyNationalID}-galar.png`,
          } as DefaultDTO;
      }

      //alola check
      if(v.pokemon.name.includes('alola')){
        return {
            name:v.pokemon.name, 
            url: `${baseIconUrl}${defaultVarietyNationalID}-alola.png`,
          } as DefaultDTO;
      }

      //none of the hisui icons exist

      //gmax check
      if(v.pokemon.name.includes('gmax')){
        return {
            name:v.pokemon.name, 
            url: `${baseIconUrl}${defaultVarietyNationalID}-gmax.png`,
          } as DefaultDTO;
      }

      return {
            name:v.pokemon.name, 
            url: `${baseIconUrl}${id}.png`,
          } as DefaultDTO;
      
    }))
  }

  return formsUrls;
})

const hasVariations = computed(() => {
  let boolthing = false;

  if(props.varieties.length > 1){
    boolthing = true;
    //also check forms
  }

  return boolthing;
})

/*
const combinedForms = computed(() => {
    //let forms: DefaultDTO[] = [];
    //let varieties: DefaultDTO[] = [];

    //if(!props.forms == undefined){
    //    //return;
    //    forms = props.forms;
    //}

    //if(!props.varieties == undefined){
    //    //return;
    //    //varieties = props.varieties.pokemon;
    //    const test = props.varieties.map(v => v.pokemon);
    //    varieties = test;
    //}
    //const forms = props.forms;
    //const varieties = props.varieties.map(v => v.pokemon);

    //const options = varieties.concat(forms);
    console.log(options);
    console.log(forms, 'forms');
    console.log(varieties, 'vareities')

    //remember: pokemon-form ID <> pokemon ID. use name for these calls

    return options;
}) */

</script>

<template>
    <InformationSection>
      <div v-if="hasVariations">
        <p>ID is: {{ pokemonStore.data.id }}</p>
        <p v-for="form in props.varieties">{{ form.pokemon.name }}</p>
        <p>{{ sprites.versions['generation-viii'].icons }}</p>
        <img class="" :src="iconUrl" />
        <p>{{ variationIconUrls }}</p>
        <p></p>
        <div class="flex flex-wrap items-center justify-center gap-1">
          <img class="flex min-h-[50px] max-h-[50px] max-w-[50px] text-xs object-none bg-red-200 rounded-full" v-for="v in variationIconUrls" :src="v.url" :alt="v.name" /></div>
      </div>
    </InformationSection>
</template>