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
    }
})