<script setup lang="ts">
import InformationSection from './InformationSection.vue';
import type { EvolutionChain, PokemonSpecies, ChainLink, DefaultDTO, EvolutionDetail } from './types';
import { computed, ref } from 'vue';
import { usePokemonStore } from '@/stores/pokemon';

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

const previousEvolution = computed(() => {
    if(props.previous){
        return props.previous;
    }
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

const evolutionDetails = ref<EvolutionDetail[]>([] as EvolutionDetail[]);

function setEvolutionDetails(currentChain: StagedChainLink){
    if(currentChain.species.name == pokemonStore.data.name){
        evolutionDetails.value = currentChain.evolution_details;
    } 

    if(!previousEvolution.value){
        evolutionDetails.value = [] as EvolutionDetail[];
    }
}

interface EvoCondition {
    conditionLabel: string,
    conditionValue: any,
}

const formattedEvolutionDetails = computed(() => {
    const details = evolutionDetails.value;
    let formattedDetails = [] as string[];

    details.forEach(d => {

        const trigger = d.trigger.name;
        let detail = "";

        //cast all required evolution conditions into an array
        const result2 = Object.entries(d).map(( [k, v]: any) => (<EvoCondition>{ conditionLabel: k, conditionValue: v})) as EvoCondition[];

        //gender is a bit. needs to be also cleaned up

        switch (trigger) {
            case "level-up":
            
                if(d.min_level){
                    detail = `Level ${d.min_level}`;
                } 
                else {
                    detail = "Level up";
                }

                const filterAgain = result2.filter(r => 
                    r.conditionValue != null && 
                    r.conditionValue != false && 
                    r.conditionLabel != "trigger" &&
                    r.conditionLabel != "min_level"
                );
                filterAgain.forEach(x => {
                    detail += " and "
                    const value = x.conditionValue?.name ? x.conditionValue?.name : x.conditionValue;
                    detail += `${x.conditionLabel} is ${value}`;
                });
                
                break; //strange cases: magnezone, vikavolt
            case "trade":
                detail = "Trade"; //doesn't handle combinations. see magmortar

                const filterAgain2 = result2.filter(r => 
                    r.conditionValue != null && 
                    r.conditionValue != false && 
                    r.conditionLabel != "trigger" 
                );
                filterAgain2.forEach(x => {
                    detail += " and "
                    const value = x.conditionValue?.name ? x.conditionValue?.name : x.conditionValue;
                    detail += `${x.conditionLabel} is ${value}`;
                });


                break;
            case "use-item":
                detail = `Use ${d.item.name}`;

                //not sure if this applies to use item evos
                const filterAgain3 = result2.filter(r => 
                    r.conditionValue != null && 
                    r.conditionValue != false && 
                    r.conditionLabel != "trigger" &&
                    r.conditionLabel != "item"
                );
                filterAgain3.forEach(x => {
                    detail += " and "
                    const value = x.conditionValue?.name ? x.conditionValue?.name : x.conditionValue;
                    detail += `${x.conditionLabel} is ${value}`;
                });
                break;
            //urshifu //not working
            case "tower-of-darkness":
            case "tower-of-waters":
                detail = `Complete ${trigger}`;
                break;
            //BEGIN single pokemon evolutions
            case "shed":
                detail = "Level 20, empty slot in party, and one empty pokeball"
                break;
            case "spin":
                detail = "https://www.serebii.net/pokedex-swsh/alcremie/";
                break;
            case "three-critical-hits":
                detail = "explain sirfetchd";
                break;
            case "take-damage":
                detail = "explain runerigus";
                break;
            case "agile-style-move":
                detail = "explain wyrdeer";
                break;
            case "strong-style-move":
                detail = "explain overqwil";
                break;
            case "recoil-damage":
                detail = "explain basculegion";
                break;
            //END single pokemon evolutions 
            case "other":
                detail = `they stopped making new evolution types and grouped these together. plz look up ${d.trigger.url}`;
                //kingambit
                //pawmot
                //maushold
                //brambleghast
                //rabsca
                //palafin
                //annihilape
                //gholdengo
                break;
            default:
                detail = "no trigger found";
                break;
        }

        formattedDetails.push(detail);

    })

    return formattedDetails;
})

//transform chain into a list for output
const evolutionChainList = computed(() => {
    //console.log('recomputing evochain')
    if(props.chain.chain == undefined){
        return [];
    }

    const evoList = [] as StagedChainLink[];
    const firstChain = new StagedChainLink(props.chain.chain, 1);
    let nextChain = {} as StagedChainLink;
    evoList.push(firstChain);
    let currentChain = firstChain; 
    console.log(firstChain);

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
                setEvolutionDetails(next);

                //only wurmple and goomy have branched evolutions that THEN evolve
                //no (current) pokemon have branched evolutions which then branch again
                if(x.evolves_to.length > 0){
                    x.evolves_to.forEach(y => {
                        next = new StagedChainLink(y, currentChain.evolution_stage+2)
                        evoList.push(next);
                        setEvolutionDetails(next);
                    })
                }
            })
            break;
        }
        
        if (currentChain.evolves_to.length > 0){
            nextChain = new StagedChainLink(currentChain.evolves_to[0], currentChain.evolution_stage+1);
            evoList.push(nextChain);
            setEvolutionDetails(nextChain);
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

                            <span v-if="stage!=1">↓ </span>
                            <img class="bg-gray-100 rounded-lg mr-1 mb-1" :class="getCursorStyle(e.species.url)" :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getNationalID(e.species.url)}.png`" @click="changeStoredPokemon(e.species.url)"/>

                        </div>
                    </td>
                </tr>
            </table>
        </div>
        <div v-else-if="evolutionChainList.length > 0" class="overflow-x-auto">
            <div id="fullchain" class="flex place-content-center ">
                <div id="stage" class=" p-1 flex flex-col " v-for="stage in evolutionStages">
                    <div class="h-full flex flex-col items-center justify-center">
                        <div id="condition+pkmn" class="h-full flex flex-row mb-1" v-for="e in evolutionChainList.filter(f => f.evolution_stage == stage)" @click="changeStoredPokemon(e.species.url)">

                            <div v-if="stage!=1" id="condition" class="h-full flex flex-col items-center justify-center rounded-lg w-12 my-1 mr-2 py-3 text-xs">lvl 1<br>⟶</div>

                            <div id="pkmn" class="h-full flex flex-col items-center justify-center bg-gray-100 rounded-lg my-1 py-3" :class="getCursorStyle(e.species.url)"><img class="" :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getNationalID(e.species.url)}.png`" /></div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="overflow-x-auto">No evolutions</div>

        <div v-if="evolutionDetails.length > 0">
            <p>Conditions for evolution:</p>
            <span v-for="ex in formattedEvolutionDetails">
                {{ ex }}<br>
            </span>
        </div>

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