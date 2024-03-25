<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { initTE, Offcanvas } from "tw-elements"
import PkmnSearch from '@/components/SearchComponent.vue';

onMounted(() => {
  initTE({ Offcanvas })
});

</script>

<template>

<button
  class="me-1.5 inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
  type="button"
  data-te-offcanvas-toggle
  data-te-target="#offcanvasRight"
  aria-controls="offcanvasRight"
  data-te-ripple-init
  data-te-ripple-color="light">
  Toggle right offcanvas
</button>

<div
  class="invisible fixed bottom-0 right-0 top-0 z-[1045] flex w-3/4 max-w-full translate-x-full flex-col border-none bg-white bg-clip-padding text-neutral-700 shadow-sm outline-none transition duration-300 ease-in-out data-[te-offcanvas-show]:transform-none dark:bg-body-dark dark:text-white"
  tabindex="-1"
  id="offcanvasRight"
  aria-labelledby="offcanvasRightLabel"
  data-te-offcanvas-init>
  <div class="flex items-center justify-between p-4 h-[129px] bg-red-700 text-white shadow-md shadow-black/5 dark:bg-neutral-600 dark:shadow-black/10 lg:flex-wrap">
    <h5
      class="mb-0 font-semibold leading-normal "
      id="offcanvasRightLabel">
      Select Pokemon
    </h5>
    <button
      type="button"
      class="box-content rounded-none border-none text-neutral-500 hover:text-neutral-800 hover:no-underline focus:text-neutral-800 focus:opacity-100 focus:shadow-none focus:outline-none dark:text-neutral-400 dark:hover:text-neutral-300 dark:focus:text-neutral-300"
      data-te-offcanvas-dismiss
      aria-label="Close">
      <span class="[&>svg]:h-6 [&>svg]:w-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12" />
        </svg>
      </span>
    </button>
  </div>
  <div class="offcanvas-body flex-grow overflow-y-auto p-4">
    <PkmnSearch />
  </div>
  <div class="w-screen h-screen" data-te-backdrop-show></div>
  
</div>

</template>

<style>



</style>