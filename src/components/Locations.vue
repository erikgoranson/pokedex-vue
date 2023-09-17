<script setup lang="ts">
import InformationSection from './InformationSection.vue';
import type { PokemonData, PokemonSpecies, Ability, EvolutionChain, LocationAreaEncounter, VersionEncounterDetail } from '@/components/types';
import { computed, reactive, ref, type Ref, watch} from 'vue';

const props = defineProps({
  data: {
    type: Array as () => LocationAreaEncounter[],
    required: true,
  }
})

const generations = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix'] as const;
type FilterKey = typeof generations[number];

const filterKey = ref<FilterKey>('i'); 

const filteredLocationAreaEncounters = computed(() => {
  let gen = filterKey.value; 

  //console.log(filterKey.value);

  let versions: string[] = [];
  switch (gen){
    case 'i':
      versions = ['red','blue','yellow'];
      return getFilteredLocations(versions);

    case 'ii':
      versions = ['gold','silver','crystal'];
      return getFilteredLocations(versions);

    case 'iii':
      versions = ['firered', 'ruby','saphire','emerald',  'leafgreen'];
      return getFilteredLocations(['ruby','saphire','emerald', 'firered', 'leafgreen']);

    case 'iv':
      versions = ['diamond','pearl','platinum', 'heartgold', 'soulsilver'];
      return getFilteredLocations(versions);

    case 'v':
      versions = ['black','white','black-2', 'white-2'];
      return getFilteredLocations(versions);

    case 'vi':
      versions = ['x','y','omega-ruby', 'alpha-sapphire'];
      return getFilteredLocations(versions);

    case 'vii':
      versions = ['sun','moon','ultra-sun', 'ultra-moon', 'lets-go-pikachu', 'lets-go-eevee'];
      return getFilteredLocations(versions);

    case 'viii':
      versions = ['sword','shield','legends-arceus'];
      return getFilteredLocations(versions);

    case 'ix':
      versions = ['scarlet','violet'];
      return getFilteredLocations(versions);
  }
})

function getFilteredLocations(versions: string[]) {
  let data = props.data;
  let locationAreaEncounters = [] as LocationAreaEncounter[];
  console.log(versions);

  //filter down lae records by allowed versions
  locationAreaEncounters = data.filter(l => 
    l.version_details.some(vd => versions.includes(vd.version.name) )
  );

  //this filters down the locations that only include rby, but leaves other stuff that doesnt apply like ss, hg, x/y
  //so now filter down the child arrays in each element to only include version matcheas

  let filteredlocationAreaEncounters = [] as LocationAreaEncounter[];
  locationAreaEncounters.forEach(element => {
    //console.log(element.location_area.name);
    
    let newarray = element.version_details.filter(e => versions.includes(e.version.name));

    const testLae = <LocationAreaEncounter>{
      location_area: element.location_area,
      version_details: newarray,
    }
    filteredlocationAreaEncounters.push(testLae);
  });

  return filteredlocationAreaEncounters;
}

function filterBy(key: FilterKey){
    filterKey.value = key;
}

</script>

<template>
    <InformationSection class="flex flex-col justify-center items-center">
        
        <div class="inline-flex  rounded-md shadow-sm" role="group">
          <button v-for="g in generations" type="button" @click="filterBy(g)">
            Gen {{ g }}
          </button>
        </div>

        <!--p>{{ props }}</p>-->
        <p>----</p>
        <p v-for="element in filteredLocationAreaEncounters">
          {{ element.location_area.name }}<br>
          {{ element.version_details }}
        </p>
        <!--
        <p v-for="e in filteredVersionDetails">{{ e }}</p>-->
        
    </InformationSection>
</template>

<style scoped>

button {
  @apply inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 rounded-r-md hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700;
}

</style>