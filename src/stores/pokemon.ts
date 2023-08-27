import {defineStore} from 'pinia';
import type { GridItem } from '@/components/types';


export const usePokemonStore = defineStore('pokemon', {
    state: () => {
        return{
            data: <GridItem>{},
            isDefault: true,
        }
    }, 
    actions:{
        changePokemon(id: number) {
            this.changeDefaultPokemon(id);
            this.isDefault = false;
        },
        changeDefaultPokemon(id: number) {
            this.data = <GridItem>{
                id: id,
            }
        },
    }
})