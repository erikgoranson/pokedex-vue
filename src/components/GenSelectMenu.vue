<script setup lang="ts">
import { ref, onMounted, watch, reactive, computed } from 'vue';
import type { DefaultDTO, VersionGroup, SelectionGroup, Selection } from '@/types';
import { useVersionStore } from '@/stores/version';
import pokeAPI from '@/services/pokeAPI';
import helpers from '@/helpers';

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

function getNationalSelectionGroup() {
    const nationalData = <SelectionGroup>{
        name:'natianal-dex',
        generationName: 'national',
        version_groups: [
            <VersionGroup>{
                name: 'natianal',
                pokedexes: [<DefaultDTO>{
                    name: 'nat',
                    url: 'https://pokeapi.co/api/v2/pokedex/1/'
                }],
                versions: [<DefaultDTO>{
                    name: 'every',
                }],
                generation: <DefaultDTO>{
                    name: 'national',
                }
            }
        ]
    };
    return nationalData;
}

async function populateGenerationData() {

    console.log('retreiving generation and version group data...')
    const generations = await pokeAPI.getGenerations();
    const versionGroups = await pokeAPI.getVersionGroups();
            
    //grouping the versiongroups by generation for the dropdown selection
    const selectionData = generations.map((g) => {
        const filter = versionGroups.filter(f => 
            f.generation?.name === g.name &&
            !excludedVersionGroups.includes(f.name)
        )
        
        return <SelectionGroup>{
            generationName: g.name,
            version_groups: filter, 
        };
    });
    
    const nationalData = getNationalSelectionGroup();
    selectionData.push(nationalData);

    selectData.value = selectionData; 
    localStorage.setItem(selectDataKey, JSON.stringify(selectionData));
}

function getSelectData(){
    selectData.value = helpers.retrieveLocalStorageData(selectDataKey); 
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

function changeVersion( selectedGroup: VersionGroup ){
    const output = <Selection>{ 
        name:buildPrettyVersionName(selectedGroup.versions as DefaultDTO[]), generationName: selectedGroup.generation?.name, 
        version_group: selectedGroup
    }
    versionStore.changeVersion(output);
}

onMounted(async () => {
    getSelectData();
    if (!selectData.value){
        await populateGenerationData();
    }
});

watch(versionStore, (newValue, oldValue) => {
    localStorage.setItem(selectedVersionKey, JSON.stringify(versionStore.data));
});

</script>

<template>
    <div class="absolute left-0 right-0 top-full z-[1000] mt-0 hidden w-full border-none bg-white bg-clip-padding text-neutral-600 shadow-lg dark:bg-neutral-700 dark:text-neutral-200 [&[data-te-dropdown-show]]:block" aria-labelledby="dropdownMenuButtonX" data-te-dropdown-menu-ref>
        <div class="flex justify-center mt-1">Select a version group</div>
        <div class="px-6 py-5 lg:px-8">
            <div class="grid gap-6 grid-cols-2 lg:grid-cols-4">
                <div v-for="(sd, index) in selectData" >
                    <h1>{{ sd.generationName }}</h1>
                    <a v-for="vg in (sd.version_groups as VersionGroup[])" class="" @click="changeVersion(vg)">
                        {{ buildPrettyVersionName(vg.versions as DefaultDTO[]) }}
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

a {
    @apply capitalize truncate;
}

h1 {
    @apply capitalize border-b;
}

a {
@apply block w-full whitespace-nowrap bg-transparent px-2 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30;
}

</style>