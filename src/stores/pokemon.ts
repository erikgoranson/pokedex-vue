import {defineStore} from 'pinia';
import type { GridItem, PokemonData } from '@/components/types';
import { ref } from 'vue';


export const usePokemonStore = defineStore('pokemon', () => {
    const data = ref<GridItem>({} as GridItem);
    const isDefaultSelection = ref(true); //indicates the currently stored pokemon data should overwrite the user's selection

    function changePokemon(id: number) {
        if(data.value.id != id){
            data.value = <GridItem>{
                id: id,
            };
        }
        isDefaultSelection.value = false;
    };
    function fillPokemonData(pokemonDetail: PokemonData){
        data.value = <GridItem>{
            id: pokemonDetail.id,
            name: pokemonDetail.name,
            type1: pokemonDetail.types[0].type.name,
            type2: pokemonDetail.types[0]?.type.name,
        }
    }

    return { data, isDefaultSelection, changePokemon, fillPokemonData };
});