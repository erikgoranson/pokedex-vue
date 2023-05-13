import {defineStore} from 'pinia';
import type { SearchItem } from '@/components/types';


export const usePokemonStore = defineStore('pokemon', {
    state: () => {
        return{
            data: <SearchItem>{},
            isDefault: true,
        }
    }, 
    actions:{
        changePokemon (payload: SearchItem) {
            this.changeDefaultPokemon(payload);
            this.isDefault = false;
        },
        changeDefaultPokemon(payload: SearchItem) {
            this.data = payload;
        }
    }
})