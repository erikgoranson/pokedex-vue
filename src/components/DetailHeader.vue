<script setup lang="ts">
import InformationSection from './InformationSection.vue';
import type { PokemonMove, PokemonData, DefaultDTO, PokemonTypes, PokemonSpecies, Genus, FlavorText } from '@/types';
import { computed, reactive, ref } from 'vue';
import { useVersionStore } from '@/stores/version';
import { useShinyStore } from '@/stores/shiny';
import GenSelectMenu from './GenSelectMenu.vue';
import helpers from '@/helpers';

const props = defineProps({
  data: {
    type: Object as () => PokemonData,
    required: true
  },
  species: {
    type: Object as () => PokemonSpecies,
    required: true,
  }
})

const shinyStore = useShinyStore();
const store = useVersionStore();

const isSpriteFront = ref(true);

function toggleSpriteDirection() {
  isSpriteFront.value = !isSpriteFront.value;
}

function getLocalSpritePath(url: string){
  const apiSpritePath = "https://raw.githubusercontent.com/PokeAPI/sprites/master/";
  const localSpritePath = "/src/assets/images/";
  
  const fullLocalPath = url.replace(apiSpritePath, localSpritePath);
  return fullLocalPath;
}

const filteredGenus = computed(() => {
  const genus = props.species.genera.filter(x => x.language.name == "en").map(obj => obj.genus).toString();

  if(genus === ''){
    return '-----';
  }

  return `The ${genus}`; //"pokemon" is already appended in the value;
});

const filteredFlavorTextEntry = computed(() => {
  const generation = store.data.version_group?.name; 

  if(generation == 'national'){
    //return "Select a version for more information"
    return generation;
  }

  const filteredEntries = props.species.flavor_text_entries.filter(x => x.language.name == "en" && generation.startsWith(x.version.name));

  if(filteredEntries.length == 0 || filteredEntries.length == undefined){
    return "No flavortext entries found";
  } 
  let flavortext = filteredEntries[0].flavor_text.replace('\f'," ");
  
  return flavortext;
});

const spriteUrl = computed(() => {
  const defaultSpriteUrl = '/src/assets/images/defaultPokemon.png';

  //default is front/nonShiny
  let spriteURL = props.data.sprites.front_default;
  if(shinyStore.isShiny){
    spriteURL = props.data.sprites.front_shiny;
  }

  if(!isSpriteFront.value){
    spriteURL = props.data.sprites.back_default;

    if(shinyStore.isShiny){
      spriteURL = props.data.sprites.back_shiny;
    }
  }

  return (spriteURL) ? spriteURL : defaultSpriteUrl;
});


</script>

<template>

  <InformationSection>
    <div class="flex flex-wrap -mx-2 ">
      <div class="w-2/5 md:w-2/5 lg:w-1/5 px-1 mb-2">
        <div id="pkmn-image" class="relative border h-28 text-sm text-grey-dark flex items-center justify-center">
          <img class="cursor-pointer" :src="spriteUrl" @click="toggleSpriteDirection()"/>
          <h1 class="absolute text-0xl bottom-0 left-1/2 -translate-x-1/2">No. {{props.data.id}}</h1>
        </div>
      </div>
    <div class="w-3/5 md:w-3/5 lg:w-2/5 px-1 mb-2">
      <div  class="border h-28 text-sm text-grey-dark flex flex-col justify-center items-center">
        <h5 class="text-2xl font-semibold truncate md:text-4xl leading-normal lg:leading-normal text-wrap">{{helpers.formatPokemonName(props.data.name)}}</h5>
          <p class="text-0xl">{{ filteredGenus }}</p>
        <div class="mt-2">
            <span class="type-container" v-for="t in props.data.types" :class="t.type.name">
              {{ t.type.name }}
            </span>
          </div>
      </div>
    </div>
    <div class="w-full lg:w-2/5 px-1 ">
      <div id="pkmn-flavortext" class="border h-28  text-grey-dark flex  items-center justify-center">
        <p v-if="filteredFlavorTextEntry != 'national'" class="mx-1">
          {{ filteredFlavorTextEntry }}
        </p>
        <p v-else data-te-navbar-nav-ref>
          <ul class="mr-2 flex flex-row" data-te-navbar-nav-ref>
            <li class="static" data-te-nav-item-ref data-te-dropdown-ref>
              <button href="#" data-te-ripple-init data-te-ripple-color="light" type="button" id="dropdownMenuButtonX" data-te-dropdown-toggle-ref aria-expanded="false" data-te-nav-link-ref>
                select a version
              </button>
              <GenSelectMenu/>
            </li>
          </ul>
        </p>
      </div>
    </div>
   </div>
  </InformationSection>

</template>

<style scoped>

button {
  @apply rounded bg-success px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white transition duration-150 ease-in-out hover:text-neutral-700 focus:text-neutral-700 dark:hover:text-white dark:focus:text-white lg:px-2;
}

h5 {
  text-transform: capitalize;
}

span {
  text-transform: uppercase;
}

.type-container {
  @apply px-1 py-1 mr-1 bg-red-300 text-xs rounded-sm font-bold align-middle whitespace-nowrap text-center inline-block min-w-[70px] text-white; 
}

.bird {
  background-color: #B5C6F7;
}

.bug {
  background-color: #A8B820;
}

.dark {
  background-color: #705848;
}

.dragon {
  background-color: #7038F8;
}

.electric {
  background-color: #F8D030;
}

.fairy {
  background-color: #F7B5F7;
}

.flying {
  background-color: #A890F0;
}

.fighting {
  background-color: #C03028;
}

.fire {
  background-color: #F08030;
}

.ghost {
  background-color: #705898;
}

.grass {
  background-color: #78C850;
}

.ground {
  background-color: #E0C068;
}

.ice {
  background-color: #98D8D8;
}

.normal {
  background-color: #A8A878;
}

.poison {
  background-color: #A040A0;
}

.psychic {
  background-color: #F85888;
}

.rock {
  background-color: #B8A038;
}

.steel {
  background-color: #DBDBE8;
}

.water {
  background-color: #6890F0;
}


</style>