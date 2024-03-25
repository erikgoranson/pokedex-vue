<script setup lang="ts">
import { computed, onRenderTracked, ref, watch } from 'vue';
import { usePokemonStore } from '@/stores/pokemon';
import type { GridItem } from '@/types';

const props = defineProps({
    data: {
        type: Array as () => GridItem[],
        required: true,
    },
    filterKey: {
        type: String,
        required: false,
    }
});

//not sure how to accomplish this without manualy entering the keys from GridItem
//type SortableKey = 'id' | 'name' | 'type1' | 'type2';
const gridItemKeys = ['id','name','type1','type2'] as const;



type SortableKey = typeof gridItemKeys[number] | null;
const sortKey = ref<SortableKey>(null);

const pokemonStore = usePokemonStore();

const sortOrder = ref<number>(1); //asc default

const sortedData = computed(() => {

    //dynamically sort through every property and key for filter match
    let { data, filterKey } = props; 
    if (filterKey) {
        filterKey = filterKey.toLowerCase();
        data = data?.filter((row: any) => {
            return Object.keys(row).some((key) => {
                return String(row[key]).toLowerCase().indexOf(filterKey ?? '') > -1
            })
        })
    }

    switch (sortKey.value) {
        case 'name':
            return [...data].sort((a: GridItem, b: GridItem) => {
                return a.name.localeCompare(b.name) * sortOrder.value;
            })
        case 'id':
            return [...data].sort((a: GridItem, b: GridItem) => {
                return a.id - b.id * sortOrder.value;
            })
        case 'type1':
            return [...data].sort((a: GridItem, b: GridItem) => {
                return a.type1.localeCompare(b.type1) * sortOrder.value;
            })
        case 'type2':
            return [...data].sort((a: GridItem, b: GridItem) => {
                return a.type2.localeCompare(b.type2) * sortOrder.value;
            })
        default: 
            return data; //initial sort 
    }
})

function sortOnClick(key: string){
   const testplz: SortableKey = key as SortableKey;

   if(sortKey.value === testplz){
    sortOrder.value *= -1;
   }

   sortKey.value = testplz;
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

  <table >
    <thead>
        <tr>
            <th scope="col" v-for="key in gridItemKeys" @click="sortOnClick(key)">
                {{ key }}
            </th>
        </tr>
    </thead>
    <tbody v-if="sortedData?.length">
        <tr v-for="entry in sortedData" class="nonHeaderRow cursor-pointer" @click="storeSelectedPokemon(entry)" type="button" data-te-offcanvas-toggle data-te-target="#offcanvasRight" aria-controls="offcanvasRight"> 
            <td>{{ entry.id }}</td>
            <td>{{ entry.name }}</td>
            <td><span :class="getTypeStyle(entry.type1)">{{ entry.type1 }}</span></td>
            <td><span :class="getTypeStyle(entry.type2)">{{ entry.type2 }}</span></td>
        </tr>
    </tbody>
    <tbody v-else>
        <tr class="nonHeaderRow">No matches found</tr>
    </tbody>
  </table>

</template>

<style scoped>
th {
  text-transform: capitalize;
  @apply px-2 py-4;
} 
td {
  text-transform: capitalize;
  @apply whitespace-nowrap px-2 py-4 font-medium;
}
table {
  @apply w-full text-left text-sm font-light h-fit;
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