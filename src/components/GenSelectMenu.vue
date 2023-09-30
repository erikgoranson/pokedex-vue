<script setup lang="ts">
import { ref, onMounted, watch, reactive, computed } from 'vue';
import type { DefaultDTO, VersionGroup, SelectionGroup, Selection } from '@/components/types';
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

function constructSelection( selectedGroup: VersionGroup ){
    const output = <Selection>{ 
        name:buildPrettyVersionName(selectedGroup.versions as DefaultDTO[]), generationName: selectedGroup.generation?.name, 
        version_group: selectedGroup
    }
    return output;
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