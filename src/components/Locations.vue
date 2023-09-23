<script setup lang="ts">
import InformationSection from './InformationSection.vue';
import type { PokemonData, PokemonSpecies, Ability, EvolutionChain, LocationAreaEncounter, VersionEncounterDetail, Encounter } from '@/components/types';
import { computed, reactive, ref, type Ref, watch} from 'vue';
import { useVersionStore } from '@/stores/version';

const props = defineProps({
  data: {
    type: Array as () => LocationAreaEncounter[],
    required: true,
  }
})

const version = useVersionStore();

const filteredLocationAreaEncounters = computed(() => {
  let data = props.data;
  let locationAreaEncounters = [] as LocationAreaEncounter[];
  const versions = version.data.version_group.versions?.map(x => x.name);
  
  //filter down lae records by the current selected version(s)
  locationAreaEncounters = data.filter(l => 
    l.version_details.some(vd => versions?.includes(vd.version.name) )
  );

  //this filters down the locations that only include said version, but can leave other stuff that doesnt apply
  //so now filter down the child arrays in each element to only include version matches and return a rebuilt location array
  let filteredlocationAreaEncounters = [] as LocationAreaEncounter[];
  locationAreaEncounters.forEach(element => {
    let filteredVersionDetails = element.version_details.filter(e => versions?.includes(e.version.name));
    const newLae = <LocationAreaEncounter>{
      location_area: element.location_area,
      version_details: filteredVersionDetails,
    }
    filteredlocationAreaEncounters.push(newLae);
  });

  console.log(filteredlocationAreaEncounters);
  return filteredlocationAreaEncounters;
})

///method for returning all encounters in the provided version details as a single array
function listLocationEncounters(arr: VersionEncounterDetail[]){
  let allEncounterDetails = [] as FlattenedEncounter[];
  console.log('wat');
  arr.forEach(x => {
    x.encounter_details.forEach(y => {
      const n = <FlattenedEncounter>{
        chance: y.chance,
        condition_values: y.condition_values,
        method: y.method,
        min_level: y.min_level,
        max_level: y.max_level,
        versionName: x.version.name
      }
      allEncounterDetails.push(n);
    })
  })

  return allEncounterDetails;
}

interface FlattenedEncounter extends Encounter{
  versionName: string,
}

///method for making the printed location name prettier
function formatLocationName(location: string){
  let output = location.replace('-',' ');
  output = output.replace('area','');

  return location
    //all of these are different versions of the dash. wow
    .replace('-',' ') 
    .replace('-',' ')
    .replace('-',' ')
    .replace('-',' ')
    .replace('area','');
}

///method for making the printed min/max level prettier
function printLevelRange(encounter: FlattenedEncounter){
  if (encounter.min_level == encounter.max_level){
    return encounter.min_level;
  }

  return `${encounter.min_level} - ${encounter.max_level}`;
}

///method for making the printed encounter conditions prettier
function printEncounterConditions(encounter: FlattenedEncounter){
  if(encounter.condition_values.length == 0){
    return "N/A";
  }
  return encounter.condition_values
    .map(x => x.name)
    .join(", ")
    .replace('-',' ');
}

</script>

<template>
    <InformationSection>
        
      <div class="flex flex-col mb-2 justify-center items-center">LOCATIONS</div>
      <div v-if="filteredLocationAreaEncounters.length != 0" class="relative overflow-x-auto overflow-y-auto mb-8 max-h-52">
        <table class="table-auto w-full text-sm text-center">
          <thead class="bg-gray-200">
            <td>location</td>
            <td>version</td>
            <td>chance</td>
            <td>method</td>
            <td>Level</td>
            <td>Conditions</td>
          </thead>
          <tbody>
            <tr v-for="(entry, index) in filteredLocationAreaEncounters" class="border-b">
              <td class="pr-2">{{ formatLocationName(entry.location_area.name) }}</td>
              <td><p v-for="e in listLocationEncounters(entry.version_details)">
                {{ e.versionName }}
              </p></td>
              <td><p v-for="e in listLocationEncounters(entry.version_details)">
                {{ e.chance }}%
              </p></td>
              <td><p v-for="e in listLocationEncounters(entry.version_details)">
                {{ e.method.name }}
              </p></td>
              <td><p v-for="e in listLocationEncounters(entry.version_details)">
                {{ printLevelRange(e) }}
              </p></td>
              <td><p v-for="e in listLocationEncounters(entry.version_details)">
                {{ printEncounterConditions(e) }}
              </p></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="flex items-center mb-6">Location data not found. Trading or evolution may be required</div>
      
    </InformationSection>
</template>

<style scoped>
table {
    @apply capitalize;
}
td {
  @apply border;
}
p {
  @apply border-b;
}
</style>