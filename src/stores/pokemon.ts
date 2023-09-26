import {defineStore} from 'pinia';
import type { GridItem, PokemonData } from '@/components/types';

export const usePokemonStore = defineStore('pokemon', {
    state: () => {
        return{
            data: <GridItem>{},
            //indicates the currently stored pokemon data should overwrite the user's selection
            isDefaultSelection: true, 
        }
    }, 
    actions:{
        changePokemon(id: number) {
            if(this.data.id != id){
                this.data = <GridItem>{
                    id: id,
                };
            }
            this.isDefaultSelection = false;
        },
        fillPokemonData(pokemonDetail: PokemonData){
            this.data = <GridItem>{
                id: pokemonDetail.id,
                name: pokemonDetail.name,
                type1: pokemonDetail.types[0].type.name,
                type2: pokemonDetail.types[0]?.type.name,
            }
        }
    }
})