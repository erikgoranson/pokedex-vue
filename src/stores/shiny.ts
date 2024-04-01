import {defineStore} from 'pinia';
import { ref } from 'vue';

export const useShinyStore = defineStore('shiny', () => {
    const isShiny = ref(false); 

    function toggle() {
        isShiny.value = !isShiny.value;
    }

    return { isShiny, toggle };
});