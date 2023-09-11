<script setup lang="ts">
import InformationSection from './InformationSection.vue';
import type { EvolutionChain, ChainLink, DefaultDTO, EvolutionDetail } from './types';
import { computed } from 'vue';
import { usePokemonStore } from '@/stores/pokemon';
import EvolutionConditions from './EvolutionConditions.vue';

const pokemonStore = usePokemonStore();

const props = defineProps({
  chain: {
    type: Object as () => EvolutionChain,
    required: true
  },
  previous: {
    type: Object as () => DefaultDTO,
    required: false
  },
})

//custom obj for sorting evolutions after transforming into a list
class StagedChainLink implements ChainLink {

    constructor(data: ChainLink, evolution_stage: number){
        Object.assign(this, data);
        this.evolution_stage = evolution_stage;
    }

    is_baby!: boolean;
    species!: DefaultDTO;
    evolution_details!: Array<EvolutionDetail>;
    evolves_to!: Array<ChainLink>;
    evolution_stage: number; //indexed from 1 //max of 3
}

//transform chain into a list for output
const evolutionChainList = computed(() => {
    if(props.chain.chain == undefined){
        return [];
    }

    const evoList = [] as StagedChainLink[];
    const firstChain = new StagedChainLink(props.chain.chain, 1);
    let nextChain = {} as StagedChainLink;
    evoList.push(firstChain);
    let currentChain = firstChain; 

    if(currentChain.evolves_to.length == 0){
        //don't advance if zero evolutions
        return [];
    }

    while(currentChain.evolves_to.length && currentChain.evolves_to.length > 0){

        //check for branching evolutions
        if(currentChain.evolves_to.length > 1){
            currentChain.evolves_to.forEach(x => {
                let next = new StagedChainLink(x, currentChain.evolution_stage+1);
                evoList.push(next);

                //only wurmple and goomy have branched evolutions that THEN evolve
                //no (current) pokemon have branched evolutions which then branch again
                if(x.evolves_to.length > 0){
                    x.evolves_to.forEach(y => {
                        next = new StagedChainLink(y, currentChain.evolution_stage+2)
                        evoList.push(next);
                    })
                }
            })
            break;
        }
        
        if (currentChain.evolves_to.length > 0){
            nextChain = new StagedChainLink(currentChain.evolves_to[0], currentChain.evolution_stage+1);
            evoList.push(nextChain);
            currentChain = nextChain;
        }
    }

    return evoList;
})

function getNationalID(url: string){
    return url.slice(0, -1).split("/").pop();
}

const evolutionStages = computed(() => {
    let stages = [... new Set(evolutionChainList.value.map(x=>x.evolution_stage))];
    return stages;
})

const eeveeTest = computed(() => {
    if(props.chain.chain == undefined){
        return [];
    }

    if(props.chain.chain.species.name == 'eevee'){
        return true;
    }

    return false;
})

function changeStoredPokemon(url: string){
    //check if the current ID is already the same before doing  this
    const id = getNationalID(url);
    if (id) {
        pokemonStore.changePokemon(Number(id));
    }
}

function getCursorStyle(url: string){
    const id = Number(getNationalID(url));
    const currentID = pokemonStore.data.id;
    let style = "bg-yellow-100"; //change pokemon style if not clickable
    if(id && currentID != id){
        style = "cursor-pointer";
    }
    return style;
}

</script>

<template>
    <InformationSection>
        <div class="flex justify-center items-center">EVOLUTIONS</div>
        <div v-if="eeveeTest == true" class="overflow-x-auto">
            <table>
                <tr class="flex flex-col items-center justify-center">
                    <td class="w-full flex flex-wrap  items-center justify-center" v-for="stage in evolutionStages">
                        <div class="flex items-center justify-center flex flex-col" v-for="e in evolutionChainList.filter(f => f.evolution_stage == stage)">

                            <span v-if="stage!=1">
                                <EvolutionConditions :chain="e" :isVertical="true"/>
                            </span>
                            
                            <img class="bg-gray-100 rounded-lg mr-1 mb-1" :class="getCursorStyle(e.species.url)" :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getNationalID(e.species.url)}.png`" @click="changeStoredPokemon(e.species.url)"/>

                        </div>
                    </td>
                </tr>
            </table>
        </div>
        <div v-else-if="evolutionChainList.length > 0" class="overflow-x-auto w-auto">
            <div id="fullchain" class="flex place-content-center ">
                <div id="stage" class=" p-1 flex flex-col " v-for="stage in evolutionStages">
                    <div class="h-full flex flex-col items-center justify-center">
                        <div id="condition+pkmn" class="h-full flex flex-row mb-1" v-for="e in evolutionChainList.filter(f => f.evolution_stage == stage)">

                            <span v-if="stage!=1" id="condition" >
                                <EvolutionConditions :chain="e"/>
                            </span>

                            <div id="pkmn" class="h-full flex flex-col items-center justify-center bg-gray-100 rounded-lg my-1 py-3 w-14" :class="getCursorStyle(e.species.url)" @click="changeStoredPokemon(e.species.url)" ><img class="" src="@/assets/images/defaultPokemon.png" /></div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="overflow-x-auto">No evolutions</div>


    </InformationSection>
</template>

<style scoped>

table {
    @apply table-auto w-full text-sm text-center  ;
    /* text-gray-500 dark:text-gray-400*/
}

tr {
    @apply border-b border-gray-200 dark:border-gray-700;
}

td {
    @apply p-1 align-top;
}

</style>