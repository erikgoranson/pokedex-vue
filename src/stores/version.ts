import {defineStore} from 'pinia'
import type { DefaultDTO, Selection, VersionGroup  } from '@/types';
import helpers from '@/helpers';
import { ref } from 'vue';

const selectedVersionKey: string = 'selectedVersion';
const selectedVersion: Selection = helpers.retrieveLocalStorageData(selectedVersionKey);

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

const defaultSelection: Selection = (selectedVersion) ? selectedVersion : rbVersion;

export const useVersionStore = defineStore('version', () => {
    const data = ref(defaultSelection);
    function changeVersion (payload: Selection) {
        data.value = payload;
    }

    return { data, changeVersion }
});
