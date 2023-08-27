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
        changePokemon (payload: GridItem) {
            this.changeDefaultPokemon(payload);
            this.isDefault = false;
        },
        changeDefaultPokemon(payload: GridItem) {
            this.data = payload;
        },
        setPokemonID(id: number ): void {
            this.data = <GridItem>{
                id: id,
            }
        }
    }
})