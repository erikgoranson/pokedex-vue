import {defineStore} from 'pinia'
import type { DefaultDTO } from '@/components/types';

interface Selection {
    name: string, 
    generationName: string,
    version_group: VersionGroup, 
}

interface VersionGroup {
    id: number,
    generation?: DefaultDTO,
    move_learn_methods?: Array<DefaultDTO>,
    name: string,
    order?: number,
    pokedexes: Array<DefaultDTO>,
    regions: Array<DefaultDTO>,
    versions?: Array<DefaultDTO>,
}

export const useVersionStore = defineStore('version', {
    state: () => {
        return{
            data: <Selection>{}
        }
    }, 
    actions:{
        changeVersion (payload: Selection) {
            this.data = payload
        }
    }
})