<script setup lang="ts">
import type { ChainLink } from './types';
import { computed, ref } from 'vue';

const props = defineProps({
  chain: {
    type: Object as () => ChainLink,
    required: true
  },
  isVertical: {
    type: Boolean,
    required: false,
  }
})

interface EvoDetail {
    conditionLabel: string,
    conditionValue: any,
}

interface EvolutionCondition {
    trigger: string,
    conditions: EvoDetail[],
}

//formats gender as a string from its provided int
function formatGender(detail: EvoDetail){
    if(detail.conditionLabel == "gender" && detail.conditionValue != null){
        const rawGender = detail.conditionValue;
        let formattedGender = "";

        if(rawGender === 2){
            formattedGender = "male";
        } 
        else if(rawGender === 1) { 
            formattedGender = "female";
        }

        detail.conditionValue = formattedGender;
        return detail;
    }
    
    return detail;
}

const chainStyle = computed(() => {
    let style = "h-full";
    arrow.value = "⟶"

    if( props.isVertical ){
        style = "h-24";
        arrow.value = "↓"
    }
    return style;
})

const arrow = ref<string>("⟶");

const formattedEvolutionDetails = computed(() => {
    
    const details = props.chain.evolution_details;
    //let formattedDetails = [] as EvolutionCondition[];
    
    let formattedDetails = details.map(x => {
        let trigger = x.trigger.name;
        
        //cast all conditions to an array
        let conditions: EvoDetail[] = Object.entries(x)
        .map(( [k, v]: any) => {
            let detail = formatGender(<EvoDetail>{ conditionLabel: k, conditionValue: v});
            //get lowest level of condition where applicable
            detail.conditionValue = detail.conditionValue?.name ? detail.conditionValue.name : detail.conditionValue;
            return detail;
        }) as EvoDetail[];

        conditions = conditions.filter(x => 
            x.conditionLabel != "trigger" 
            && x.conditionValue != null 
            && x.conditionValue != false
            && x.conditionLabel != "min_level"
            && x.conditionLabel != "item"
        );

        console.log(conditions);
            
        switch(trigger) {
            case "level-up":
                if(x.min_level){
                    trigger = `level ${x.min_level}`;
                } 
                else {
                    trigger = "level up";
                }
                break;
            case "trade":
                break;
            case "use-item":
                trigger = `${x.item.name}`;
                break;
            case "tower-of-darkness":
            case "tower-of-waters":
                trigger = `complete ${trigger}`;
                break;
            //BEGIN single pokemon evolutions
            case "shed":
                trigger = "level 20";
                conditions.push(<EvoDetail>{conditionLabel: "shed", conditionValue: "empty slot in party"});
                conditions.push(<EvoDetail>{conditionLabel: "shed", conditionValue: "one empty pokeball"});
                break;
            case "spin":
                conditions.push(<EvoDetail>{conditionLabel: "see", conditionValue: "https://www.serebii.net/pokedex-swsh/alcremie/"});
                break;
            case "three-critical-hits":
                trigger = "get 3 critical hits in one battle";
                break;
            case "take-damage":
                trigger = "have 49+ damage taken by Yamask in one battle and walk under stone sculpture in Dusty BowlWild Are";
                break;
            case "agile-style-move":
                trigger = "Use Agile Style Psyshield 20 times";
                break;
            case "strong-style-move":
                trigger = "Use Strong Style Barb Barrage 20 times";
                break;
            case "recoil-damage":
                trigger = "Gain a total 294 damage in recoil from your moves without fainting";
                break;
            //END single pokemon evolutions 
            case "other":
                conditions.push(<EvoDetail>{conditionLabel: "see", conditionValue: "url goes here"});
                //kingambit//pawmot//maushold//brambleghast//rabsca//palafin//annihilape//gholdengo
                break;
            default:
                trigger = "no trigger found";
                break;
        }
    
        return <EvolutionCondition>{
            trigger: trigger,
            conditions: conditions,
        };
    })
    
    //sometimes the pokeapi is just... missing info?
    //see: phione/manaphy
    if(details.length == 0){
        const trigger = "not found";
        const conditions = [] as EvoDetail[];
        formattedDetails.push(<EvolutionCondition>{trigger:trigger, conditions:conditions});
    }
    
    return formattedDetails.pop(); //the api doesn't have any way to programmatically filter evo conditions by generation or versiongroup, either. returning the last element for now instead
})

</script>

<template>
    <div :class="chainStyle" class="flex flex-col items-center justify-center rounded-lg w-20 my-1 mr-2 py-3 text-xs">
        <div class="font-bold">{{ formattedEvolutionDetails?.trigger }}</div>
        <div v-html="arrow"></div>
        <div class="flex items-center justify-center break-words w-20" v-for="c in formattedEvolutionDetails?.conditions">
            {{ c.conditionLabel }}:<br>{{ c.conditionValue }}
        </div>
    </div>
</template>