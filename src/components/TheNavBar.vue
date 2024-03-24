<script setup lang="ts">
import { computed, onMounted } from 'vue';
import GenSelectMenu from './GenSelectMenu.vue';
import { useVersionStore } from '@/stores/version';
import { initTE, Collapse, Dropdown } from "tw-elements"

const navigation = [
  { name: 'Home', href: '/' },
];

const versionStore = useVersionStore();

onMounted(() => {
  initTE({ Collapse, Dropdown })
});

const transformedGenerationName = computed(() => {
  const generationName = versionStore.data.generationName;
  const romanNumeral = generationName.replace('generation-','').toUpperCase();

  return `Generation ${romanNumeral}`;
})

const transformedVersionName = computed(() => {
  const versionName = versionStore.data.name;

  //do not add 'version' label if already exists
  if (versionName.includes('version')){
    return versionName;
  }
  return `${versionName} Version`;
})

</script>

<template>

  <nav class="flex-no-wrap relative flex w-full items-center justify-between bg-red-700 py-2 text-white shadow-md shadow-black/5 dark:bg-neutral-600 dark:shadow-black/10 lg:flex-wrap lg:justify-start lg:py-4"
  data-te-navbar-ref>
  <div class="flex w-full flex-wrap items-center justify-between px-3">

    <button
      class="border-0 bg-transparent py-3 text-xl leading-none transition-shadow duration-150 ease-in-out hover:text-neutral-700 focus:text-neutral-700 dark:hover:text-white dark:focus:text-white lg:hidden"
      type="button"
      data-te-collapse-init
      data-te-target="#navbarSupportedContentX"
      aria-controls="navbarSupportedContentX"
      aria-expanded="false"
      aria-label="Toggle navigation">
      <span class="[&>svg]:w-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="h-8 w-8">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </span>
    </button>

    <!-- collapsible menu container-->
    <div class="!visible hidden flex-grow basis-[100%] items-center lg:!flex lg:basis-auto" id="navbarSupportedContentX" data-te-collapse-item>
      <ul class="mr-auto flex flex-col pl-0 lg:flex-row" data-te-navbar-nav-ref>

        <li v-for="item in navigation" data-te-nav-item-ref>
          <RouterLink :key="item.name" :to="item.href" class="block py-2 pr-2  transition duration-150 ease-in-out hover:text-neutral-700 focus:text-neutral-700 dark:hover:text-white dark:focus:text-white lg:px-2" data-te-ripple-init data-te-ripple-color="light">
            {{ item.name }}
          </RouterLink>
        </li>

      </ul>
    </div>

    <div class="flex  items-center lg:!flex lg:basis-auto">
      <!-- generation name -->
      <span class="mr-2 text-gray-300">{{ transformedGenerationName }}</span>
      
      <!-- gen menu -->
      <ul class="mr-2 flex flex-row" data-te-navbar-nav-ref>
        <li class="static" data-te-nav-item-ref data-te-dropdown-ref>
          <a class="flex items-center whitespace-nowrap py-2 pr-2  transition duration-150 ease-in-out hover:text-neutral-700 focus:text-neutral-700 dark:hover:text-white dark:focus:text-white lg:px-2" href="#" data-te-ripple-init data-te-ripple-color="light" type="button" id="dropdownMenuButtonX" data-te-dropdown-toggle-ref aria-expanded="false" data-te-nav-link-ref>
            {{ transformedVersionName }}
            <span class=" w-2"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" /></svg></span>
          </a>
          <GenSelectMenu/>
        </li>
      </ul>

      <!-- pokemon/logo container -->
      <div class="relative">
        <span class="hidden-arrow flex items-center whitespace-nowrap transition duration-150 ease-in-out motion-reduce:transition-none">
          <img class="h-8 w-8 rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" src="@/assets/images/defaultPokemon.png" alt="" loading="lazy" />
        </span>
      </div>

    </div>

  </div>
  </nav>
</template>

<style scoped>
a {
  @apply capitalize;
}
</style>