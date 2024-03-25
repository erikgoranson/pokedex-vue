<script setup lang="ts">
import PkmnSearch from './SearchComponent.vue'
</script>

<template>
    <div class="invisible fixed bottom-0 right-0 top-0 z-[1045] flex w-3/4 max-w-full translate-x-full flex-col border-none bg-white bg-clip-padding text-neutral-700 shadow-sm outline-none transition duration-300 ease-in-out data-[te-offcanvas-show]:transform-none dark:bg-body-dark dark:text-white" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel" data-te-offcanvas-init>
        <div class="flex items-center justify-between p-4 h-36 text-black lg:flex-wrap">
            <h5 class="mb-0 font-semibold leading-normal " id="offcanvasRightLabel"> 
                Select Pokemon
            </h5>
            <button type="button" class="box-content rounded-none border-none text-neutral-500 hover:text-neutral-800 hover:no-underline focus:text-neutral-800 focus:opacity-100 focus:shadow-none focus:outline-none dark:text-neutral-400 dark:hover:text-neutral-300 dark:focus:text-neutral-300" data-te-offcanvas-dismiss aria-label="Close"> 
                <span class="[&>svg]:h-6 [&>svg]:w-6"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></span>
            </button>
        </div>
        <div class="offcanvas-body p-4 overscroll-y-contain">
            <PkmnSearch />
        </div>
        <div class="w-screen h-screen" data-te-backdrop-show></div>
    </div>
</template>

<style>
</style>