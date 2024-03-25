<script setup lang="ts">
const year = new Date().getFullYear();
</script>

<template>
    <!-- Footer container -->
    <footer class="bg-zinc-50 text-center flex-no-wrap relative flex w-full items-center mt-5">
        <div class="flex w-full items-center p-6 justify-center text-center space-x-4 divide-dashed mr-5">
            <div><span>Built by <a href="https://erikgoranson-portfolio.vercel.app/">Erik Goranson</a></span></div>
            <div>Data by <a href="https://pokeapi.co/">PokeAPI</a></div>
            <div>Pokémon © {{ year }} Nintendo </div>
        </div>
        <div>
            <a href="#top">
                <button type="button" data-twe-ripple-init data-twe-ripple-color="light" class=" rounded-full bg-gray-600 p-3 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-red-700 hover:shadow-lg focus:bg-red-400 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg"><span class="[&>svg]:w-4"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" /></svg></span></button>
            </a>
        </div>
    </footer>
</template>

<style scoped>

a {
  @apply text-gray-500;
}

</style>