import {defineStore} from 'pinia'

interface TableItem {
    id: string, //then just set these as the custom headers I wanted?
    name: string,
    "national id": string,
    types: string,
    url: string,
  } 

export const usePokemonStore = defineStore('pokemon', {
    state: () => {
        return{
            data: <TableItem>{}
        }
    }, 
    actions:{
        changePokemon (payload: TableItem) {
            this.data = payload
        }
    }
})