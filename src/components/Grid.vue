<script setup lang="ts">
//based on https://vuejs.org/examples/#grid
import { computed, ref, watch } from 'vue';
import { usePokemonStore } from '@/stores/pokemon';
import type { GridItem } from '@/types';

const props = defineProps({
  data: Array,
  columns: Array<string>,
  filterKey: String
});
const pokemonStore = usePokemonStore();
const sortKey = ref('');
const sortOrders = ref<[]>(
  props.columns?.reduce((o: any, key: any) => ((o[key] = 1), o), {}) as []
);

const filteredData = computed(() => {
  let { data, filterKey } = props;
  if (filterKey) {
    filterKey = filterKey.toLowerCase();
    data = data?.filter((row: any) => {
      return Object.keys(row).some((key) => {
        return String(row[key]).toLowerCase().indexOf(filterKey ?? '') > -1
      })
    })
  }
  const key: any = sortKey.value
  if (key) {
    const order = sortOrders.value[key]
    data = data?.slice().sort((a: any, b: any) => {
      a = a[key]
      b = b[key]
      return (a === b ? 0 : a > b ? 1 : -1) * order
    })
  }
  return data as [];
})

function sortBy(key: string) {
  sortKey.value = key;
  sortOrders.value[key] *= -1; 
}

function capitalize(str:string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function storeSelectedPokemon(entry: GridItem){ 
  pokemonStore.changePokemon(entry.id);
}

function getTypeStyle(key: string){
  switch(key){
    case 'bird':
    case 'bug':
    case 'dark':
    case 'dragon':
    case 'electric':
    case 'fairy':
    case 'flying':
    case 'fighting':
    case 'fire':
    case 'ghost':
    case 'grass':
    case 'ground':
    case 'ice':
    case 'normal':
    case 'poison':
    case 'psychic':
    case 'rock':
    case 'steel':
    case 'water':
      return `type-container ${key}`;
    default:
      return "";
  }
}

</script>

<template>
  <section class="">
  <table v-if="filteredData?.length">
    <thead>
      <tr>
        <th scope="col" v-for="key in columns"
          @click="sortBy(key)"
          :class="{ active: sortKey == key }">
          {{ capitalize(key) }}
          <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'">
          </span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="entry in filteredData" class="nonHeaderRow cursor-pointer">
        <td v-for="key in columns" @click="storeSelectedPokemon(entry)">
          <span :class="getTypeStyle(entry[key])">{{entry[key]}}</span>
          
        </td>
      </tr>
    </tbody>
  </table>
  <table v-else>
    <thead>
      <th scope="col" v-for="key in columns">
          {{ capitalize(key) }}
          <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'">
          </span>
        </th>
    </thead>
    <tr class="nonHeaderRow">No matches found</tr>
    </table>
  </section>
</template>

<style scoped>
th {
  text-transform: capitalize;
  @apply px-6 py-4;
} 
td {
  text-transform: capitalize;
  @apply whitespace-nowrap px-6 py-4 font-medium;
}
table {
  @apply min-w-full text-left text-sm font-light h-fit;
}
thead {
  @apply border-b font-medium dark:border-neutral-500
}
.nonHeaderRow {
  @apply border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600
}

.type-container {
  @apply px-1 py-1 mr-1 bg-red-300 text-xs rounded-sm font-bold align-middle whitespace-nowrap text-center inline-block min-w-[70px] text-white; 
  text-transform: uppercase; 
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