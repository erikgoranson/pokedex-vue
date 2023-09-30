import {defineStore} from 'pinia'
import type { DefaultDTO, Selection } from '@/components/types';
import type { VersionGroup } from '@/components/types';
import helpers from '@/helpers';

const selectedVersionKey: string = 'selectedVersion';
const selectedVersion = helpers.retrieveLocalStorageData(selectedVersionKey);

const rbVersion = <Selection>{
    name: 'red / blue',
    generationName: 'generation-i',
    version_group: <VersionGroup>{
        id:1,
        name:'red-blue',
        generation: <DefaultDTO>{
            name: 'generation-i',
        },
        pokedexes: <DefaultDTO[]>[
            <DefaultDTO>{
                url: '/api/v2/pokedex/2/'
            }
        ]
    }
}

const defaultSelection = (selectedVersion) ? selectedVersion : rbVersion;

//rerwrite this as setup store
export const useVersionStore = defineStore('version', {
    state: () => {
        return{
            data: defaultSelection
        }
    }, 
    actions:{
        changeVersion (payload: Selection) {
            this.data = payload
        }
    }
})