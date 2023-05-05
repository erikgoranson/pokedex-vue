<script setup lang="ts">
//based on https://vuejs.org/examples/#grid
import { computed, ref } from 'vue';
import { usePokemonStore } from '@/stores/pokemon';

const props = defineProps({
  data: Array,
  columns: Array<string>,
  filterKey: String
})

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

function storeSelectedPokemon(str: string){
  const store = usePokemonStore();
  store.changePokemon(str);
}

</script>

<template>
  <section class="h-1/6 overflow-x-auto">
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
      <tr v-for="entry in filteredData" class="nonHeaderRow">
        <td v-for="key in columns"  @click="storeSelectedPokemon(entry)">
          {{entry[key]}}
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

<style>
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
</style>