<script setup lang="ts">
import InformationSection from './InformationSection.vue';
import type { PokemonStat } from '@/components/types';
import helpers from '@/helpers';
import { computed } from 'vue';

const props = defineProps({
  stats: {
    type: Array as () => PokemonStat[],
    required: true
  },
})

const totalStats = computed(() => {

  let total = 0;
  
  if(props.stats == undefined || props.stats.length == 0){
    return total;
  }
  total = props.stats.reduce((prev, next) => prev + next.base_stat, 0);
  return total;

})

function getStatWidthStyle(stat:number) {
  const calculatedStat = Math.round(stat/255*100);
  return calculatedStat;
}

function getStatColorStyle(base_stat:number){
  //max 255
  switch(true){
    case base_stat < 0: //error?
    case base_stat <= 50:
      return "bg-red-600 dark:bg-red-500";
    case base_stat <= 75:
      return "bg-orange-600 dark:bg-orange-500";
    case base_stat <= 100:
      return "bg-yellow-600 dark:bg-yellow-500";
    case base_stat <= 150:
      return "bg-green-600 dark:bg-green-500";
    case base_stat <= 255:
      return "bg-emerald-600"
    default:
      return "bg-blue-600 dark:bg-blue-500";
  }
}

</script>

<template>
    <InformationSection>
      <div class="relative overflow-x-auto mx-6">

        <div class="flex flex-col mb-2 justify-center items-center">BASE STATS</div>

        <div class="flex" v-for="stat in stats">
          <div class="flex-none w-8 ">{{ helpers.getStatLabel(stat.stat.name) }}</div>
          <div class="flex-none w-8 font-semibold">{{ stat.base_stat }}</div>
          <div class="flex-auto w-64 mt-2">
            <div class="w-full bg-gray-200 h-2.5 mb-4 dark:bg-gray-700">
              <div class="h-2.5" :style="{ width: (getStatWidthStyle(stat.base_stat)) + '%' }" :class="`${getStatColorStyle(stat.base_stat)}`"></div>
            </div>
          </div>
        </div>

        <div class="mb-2">TOTAL: <span class="font-semibold">{{ totalStats }}</span></div>

      </div>
    </InformationSection>
</template>
