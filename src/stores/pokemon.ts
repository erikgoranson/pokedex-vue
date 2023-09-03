import {defineStore} from 'pinia';
import type { GridItem, PokemonData } from '@/components/types';


export const usePokemonStore = defineStore('pokemon', {
    state: () => {
        return{
            data: <GridItem>{},
            isDefault: true,
        }
    }, 
    actions:{
        changePokemon(id: number) {
            this.setDefaultPokemon(id);
            this.isDefault = false;
        },
        setDefaultPokemon(id: number) {
            if(this.data.id != id){
                this.data = <GridItem>{
                    id: id,
                };
            }
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