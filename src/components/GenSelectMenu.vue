<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import axios, { all } from 'axios';
import type { DefaultDTO } from '@/components/types';

interface VersionGroup {
    id: number,
    generation?: DefaultDTO,
    move_learn_methods?: Array<DefaultDTO>,
    name: string,
    order?: number,
    pokedexes?: Array<DefaultDTO>,
    regions: Array<DefaultDTO>,
    versions?: Array<DefaultDTO>,
}

interface SelectionGroup {
    generationName: string,
    version_groups: Array<VersionGroup>, 
}

interface Selection {
    name: string, 
    generationName: string,
    version_group?: VersionGroup, 
}

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

const selectedVersion = ref<Selection>({} as Selection);
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
    
    //console.log(selectionData);
    selectData.value = selectionData;
    localStorage.setItem(selectDataKey, JSON.stringify(selectionData));
}

function retrieveLocalStorageData(key: string){
    const data = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key) || '') : [];
    return data;
}

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
            }
        }
    }

    selectedVersion.value = retrievedSelection.length === 0 ? defaultSelection : retrievedSelection;
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

function constructSelection(selectedGroup: VersionGroup ){
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

watch(selectedVersion, (newValue, oldValue) => {
    localStorage.setItem(selectedVersionKey, JSON.stringify(selectedVersion.value));
});

</script>

<template>
    <div class="grid grid-cols-1 gap-0 text-sm overflow-x-auto">
        <div>
            <select v-model="selectedVersion">
                <option selected disabled :value="selectedVersion">{{ selectedVersion.name }} version</option><!--default selection text-->
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
            Generation {{ selectedVersion.version_group?.generation?.name.split('-')[1].toUpperCase() }}
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