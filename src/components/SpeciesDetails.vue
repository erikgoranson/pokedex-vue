<script setup lang="ts">
import InformationSection from './InformationSection.vue';
import type { Move, PokemonData, DefaultDTO, PokemonTypes, PokemonSpecies, Genus, FlavorText, PokemonStat } from '@/components/types';
import getStatLabel from '@/components/types'
import { computed } from 'vue';

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

const generationName = computed(() => {
    if(props.species.generation.name == undefined){
        return;
    }
    return props.species.generation.name.replace('generation-','').toUpperCase();
})

const eggGroups = computed(() => {
    if(props.species.egg_groups.length == undefined || props.species.egg_groups.length == 0){
        return;
    }
    return props.species.egg_groups.map(x => x.name).join(', ');
})

const effortValues = computed(() => {
    if(!props.data.stats || props.data.stats.length == undefined || props.data.stats.length == 0){
        return;
    }

    const EVs = props.data.stats.filter(x => x.effort > 0);
    //return EVs.map(x => `${x.effort} -> ${x.stat.name}`);
    return EVs;
})

const genderRatio = computed(() => {
    if(!props.species.gender_rate){
        return;
    }

    let arrayTest = [] as string[];

    if(props.species.gender_rate == -1){
        arrayTest.push('genderless');
        return arrayTest;
    };

    const femaleRate = props.species.gender_rate/8*100;
    const maleRate = 100-femaleRate;

    arrayTest.push(`${femaleRate}% female`, `${maleRate}% male`)

    return arrayTest; 
})

const baseEggSteps = computed(() => {
    if(!props.species.hatch_counter){
        return;
    }

    const steps = Math.round(props.species.hatch_counter*255);
    return steps;
})

</script>

<template>
    <InformationSection>
        <div class="overflow-x-auto">
            <table class="table-auto w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <tr class="border-b border-gray-200 dark:border-gray-700">
                    <td><span>Generation</span> <br> {{ generationName }}</td>
                    <td><span>gender ratio</span><br>
                        <p class="text-xs" v-for="gender in genderRatio">
                        {{ gender }}
                        </p>
                    </td>
                    <td><span>effort values</span><br>
                        <p class="text-xs" v-for="e in effortValues">
                        {{ e.effort }} x {{ getStatLabel(e.stat.name) }}
                        </p>
                    </td>
                    <td><span>capture rate</span><br>{{ species.capture_rate }}</td>
                </tr>
                <tr>
                    <td><span>Happiness</span><br>{{ species.base_happiness }}</td>
                    <td><span>Egg Groups</span> <br> {{ eggGroups }}</td>
                    <td><span>Egg Steps</span><br>{{ baseEggSteps }}</td><td><span>Forms</span><br></td>
                </tr>
            </table>
        </div>
    </InformationSection>
</template>

<style scoped>

td {
    @apply p-3 align-top;
}

span {
    @apply font-bold capitalize;
}

</style>