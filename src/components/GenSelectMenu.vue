<script setup lang="ts">
import { ref, onMounted, watch, reactive } from 'vue';
import axios, { all } from 'axios';
import type { DefaultDTO, VersionGroup, SelectionGroup, Selection } from '@/components/types';
import { useVersionStore } from '@/stores/version';

///version groups to be excluded for the marked reasons
const excludedVersionGroups: string[] = [
    //unreleased yet so pokedexes are empty; but will also require some additional handling when they go live
    'the-teal-mask',
    'the-indigo-disk',
    
    //galar DLC (and their pokedexes are already part of the main VG entry for sword/shield)
    'the-isle-of-armor',
    'the-crown-tundra',
    
    //empty pokedexexs
    'brilliant-diamond-and-shining-pearl',
    'colosseum',
    'xd'
];

const selectData = ref<SelectionGroup[]>([]);
const selectDataKey: string = 'versionSelectData';

const versionStore = useVersionStore();
const selectedVersionKey: string = 'selectedVersion';

async function populateGenerationData() {

    console.log('retreiving generation and version group data...')

    //all generations
    const generations: DefaultDTO[] = await axios
        .get('/src/assets/data/api/v2/generation/index.json')
        .then((response) => {
            return response.data.results
        })
        .catch( async (error) => {
            console.log(JSON.parse(await error.response.data.text()));
        });
    
    //all versiongroups
    const versionGroups: DefaultDTO[] = await axios
        .get('/src/assets/data/api/v2/version-group/index.json')
        .then((response) => {
            return response.data.results;
        })
        .catch( async (error) => {
            console.log(JSON.parse(await error.response.data.text()));
        });
    
    //versiongroup details using the count of provided all versiongroups earlier
    const generationData: VersionGroup[] = await axios
        .all(
            versionGroups.map((vg, index) => axios
                .get<VersionGroup>(`/src/assets/data/api/v2/version-group/${index+1}/index.json`)
                .then((response) => {
                    return response.data;
                })
            )
        );
            
    //grouping the versiongroups by generation for the dropdown selection
    const selectionData = generations.map((g) => {
        const filter = generationData.filter(f => 
            f.generation?.name === g.name &&
            !excludedVersionGroups.includes(f.name)
        )
        
        return <SelectionGroup>{
            generationName: g.name,
            version_groups: filter, 
        };
    });
    
    selectData.value = selectionData;
    localStorage.setItem(selectDataKey, JSON.stringify(selectionData));
}

function retrieveLocalStorageData(key: string){
    const data = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key) || '') : [];
    return data;
}

//for mount only
function getSelectedVersion(){
    const retrievedSelection = retrieveLocalStorageData(selectedVersionKey);

    const defaultSelection = <Selection>{
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

    versionStore.changeVersion(retrievedSelection.length === 0 ? defaultSelection : retrievedSelection);
}

function getSelectData(){
    selectData.value = retrieveLocalStorageData(selectDataKey);
}

function buildPrettyVersionName(versions: DefaultDTO[]){
    const output = versions.map((v) => {
        return v.name
            .replace('-',' ')
            .replace('-',' ') //more variants of -
            .replace('-',' '); //yet more, wat
    }).join(' / ');
    return output;
}

function constructSelection( selectedGroup: VersionGroup ){
    const output = <Selection>{ 
        name:buildPrettyVersionName(selectedGroup.versions as DefaultDTO[]), generationName: selectedGroup.generation?.name, 
        version_group: selectedGroup
    }
    return output;
}

onMounted(async () => {
    getSelectData();
    getSelectedVersion();
    if (selectData.value.length === 0){
        await populateGenerationData();
    }
});

watch(versionStore, (newValue, oldValue) => {
    localStorage.setItem(selectedVersionKey, JSON.stringify(versionStore.data));
});

</script>

<template>
    <div class="grid grid-cols-1 gap-0 text-sm overflow-x-auto">
        <div>
            <select v-model="versionStore.data">
                <option selected disabled :value="versionStore.data">{{ versionStore.data.name }} version</option><!--default selection text-->
                <optgroup 
                    v-for="(sd, index) in selectData" 
                    :key="sd.generationName" 
                    :label="sd.generationName.toUpperCase().replace('-',' ')">
                    <option 
                        v-for="vg in (sd.version_groups as VersionGroup[])" 
                        :value="constructSelection(vg)" 
                        :key="vg.id">
                            {{ buildPrettyVersionName(vg.versions as DefaultDTO[]) }}
                    </option>
                </optgroup>
            </select>
        </div>
        <div class="capitalize">
            Generation {{ versionStore.data.version_group?.generation?.name.split('-')[1].toUpperCase() }}
        </div>
    </div>
</template>

<style scoped>

optgroup {
    @apply text-slate-800/50;
    @apply bg-neutral-800;
}

option {
    text-transform: capitalize;
    @apply text-slate-800;
    @apply bg-neutral-800;
    @apply capitalize;
}

select {
    text-transform: capitalize;
    @apply bg-red-800;
}

</style>