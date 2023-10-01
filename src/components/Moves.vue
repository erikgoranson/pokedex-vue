<script setup lang="ts">
import InformationSection from './InformationSection.vue';
import { computed, reactive, ref, watch } from 'vue';
import type { PokemonMove, Move, DefaultDTO, MoveFlavorText } from '@/types';
import { useVersionStore } from '@/stores/version';
import pokeAPI from '@/services/pokeAPI';

const props = defineProps({
  data: {
    type: Array as () => PokemonMove[],
    required: true
  },
})

const store = useVersionStore();
const version = reactive(store);

const moveData = ref<Move[]>([] as Move[]);
const isLoaded = ref(false);

//categories for all possible move learn methods
const learnMethods = ['level-up' , 'machine', 'egg' , 'tutor' , 'transfer' , 'other'] as const; 

//for creating a filter allowing only one of the six learnmethod categories
type FilterableKey = typeof learnMethods[number];

//the current filter being applied to move output
const filterKey = ref<FilterableKey>('level-up');

const filteredPokemonMoveData = computed(() => {
    let { data } = props;
    let results: PokemonMove[] = [] as PokemonMove[];
    let generation = store.data.version_group?.name;

    data
        .filter((element: PokemonMove) => 
            element.version_group_details.some((subElement: any) => subElement.version_group.name === generation)) 
        .map((element: PokemonMove) => {
            let newElement = Object.assign({}, element);
            newElement.version_group_details = newElement.version_group_details.filter((subElement: any) => subElement.version_group.name === generation );
            results.push(newElement);
    })

    populateMoveData(results);
    return results
})

async function populateMoveData(pokemonMoves: PokemonMove[]){
    moveData.value = [];
    isLoaded.value = false;
    
    const moves = await pokeAPI.getMoves(pokemonMoves);
    if (moves.length > 0 ){
        moveData.value = moves;
        isLoaded.value = true;
    }
}

function getMoveData(name: string){
    const move = moveData.value.find(m => m.name === name);
    if(move === undefined){
        return <Move>{
            power: 0,
            pp: 0,
            type: <DefaultDTO>{
                name: "bird",
            },
            flavor_text_entries: [] as MoveFlavorText[],
            damage_class: <DefaultDTO>{
                name: "???",
            },
            accuracy: 0,
            effect_chance: 0
        };
    }
    return move;
}

 function getMoveFlavorText(name: string){
    const move = getMoveData(name);

    const generation = store.data.version_group?.name;
    const flavortexts = move.flavor_text_entries.filter(m => m.language.name == "en" && m.version_group.name == generation);

    if(flavortexts.length > 0){
        return flavortexts[0].flavor_text;
    }

    return "???"; 
}

function getMoveAccuracy(name: string){
    const move = getMoveData(name);

    if(move.damage_class.name === "status"){
        return "--";
    }
    return move.accuracy;
};

function getMovePower(name: string){
    const move = getMoveData(name);

    if(move.damage_class.name === "status"){
        return "--";
    }
    return move.power;
};

function getMoveEffectChance(name: string){
    const move = getMoveData(name);
    
    if(move.effect_chance === null){
        return "--";
    }
    return move.effect_chance;
};

const filteredPokemonMoveDataByMethod = computed(() => {
    const data = filteredPokemonMoveData.value; 
    const filter = filterKey.value; 

    //now kiss
    switch (filter) {
        case 'level-up':
            return data
                .filter(r => r.version_group_details[0].move_learn_method.name === filter)
                .sort((a, b) => a.version_group_details[0].level_learned_at - b.version_group_details[0].level_learned_at) as PokemonMove[];
        case 'egg':
        case 'tutor':
        case 'machine':
            return data
                .filter(r => r.version_group_details[0].move_learn_method.name === filter)
                .sort((a, b) => a.move.name.localeCompare(b.move.name)) as PokemonMove[];
        case 'transfer':
            return data
                .filter(r => 
                    r.version_group_details[0].move_learn_method.name === 'stadium-surfing-pikachu' || 
                    r.version_group_details[0].move_learn_method.name === 'colosseum-purification' || 
                    r.version_group_details[0].move_learn_method.name === 'xd-shadow' || 
                    r.version_group_details[0].move_learn_method.name === 'xd-purification')
                .sort((a, b) => a.move.name.localeCompare(b.move.name)) as PokemonMove[];
        case 'other':
            return data
                .filter(r => 
                    r.version_group_details[0].move_learn_method.name === 'light-ball-egg' || 
                    r.version_group_details[0].move_learn_method.name === 'form-change' || 
                    r.version_group_details[0].move_learn_method.name === 'zygarde-cube')
                .sort((a, b) => a.move.name.localeCompare(b.move.name)) as PokemonMove[];
        default:
            return data;
    }
})

//applies the provided FilterableKey to the final moveset output
function filterBy(key: string){
    const filterkey = <FilterableKey>(key); 
    filterKey.value = filterkey;
}

//evaluates the provided learnMethod category against the available move data's learn methods
function testPossibleSelection(key: string){
    const data = filteredPokemonMoveData.value as PokemonMove[];

    let filteredMoveLearnMethods: string[] = [];
    data.map((m: PokemonMove) => {
        filteredMoveLearnMethods.push(m.version_group_details[0].move_learn_method.name);
    })

    //the actual names for 'transfer' learn methods in the API
    const transfer = ['stadium-surfing-pikachu','colosseum-purification','xd-shadow','xd-purification'];

    //the actual names for 'other' learn methods in the API
    const other = ['light-ball-egg','form-change','zygarde-cube'];

    switch (key) {
        case 'level-up':
        case 'egg':
        case 'tutor':
        case 'machine':
            return filteredMoveLearnMethods.includes(key);
        case 'transfer':
            return filteredMoveLearnMethods.some(r=> transfer.includes(r));
        case 'other':
            return filteredMoveLearnMethods.some(r=> other.includes(r));
        default:
    }
}

</script>

<template>
    <InformationSection>
        <div class="flex flex-col mb-2 justify-center items-center">MOVES</div>

        <div class="flex flex-col">
            <div class="mb-2 grid grid-cols-3 content-center" role="group">
                <button v-for="(method, index) in learnMethods" :key="index" @click="filterBy(method)" :class="{ 'bg-red-300': method === filterKey, 'border-red-300': testPossibleSelection(method), 'text-slate-800/50': !testPossibleSelection(method) }" :disabled="!testPossibleSelection(method)">
                    {{ method.replace('-',' ') }}
                </button>
            </div>
        </div>

        <div v-if="!isLoaded" role="status" class="w-full p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700">
            <div v-for="i in learnMethods" class="flex items-center justify-between">
                <div class="mt-1">
                    <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                    <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
            </div>
            <span class="sr-only">Loading...</span>
        </div>
        <div v-else class="mb-8 overflow-x-auto sm:rounded-lg ">
            <table class="w-full text-sm text-left border">
                <thead class="text-xs uppercase bg-gray-200">
                    <tr>
                        <th class="px-1 py-1">Name</th>
                        <th class="px-1 py-1 text-center">PWR</th>
                        <th class="px-1 py-1 text-center">PP</th>
                        <th class="px-1 py-1 text-center">acc.</th>
                        <th class="px-1 py-1 overflow-clip text-center">Effect %</th>
                        <th class="px-1 py-1 text-center">Category</th>
                        <th class="px-1 py-1 text-center">Type</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="m in (filteredPokemonMoveDataByMethod as any)" :key="m" class="border">
                        <td class="px-1 py-1">
                            <span class="font-semibold">{{m.move.name.replace('-',' ')}}</span>
                            <p v-if="m.version_group_details[0].level_learned_at">
                                Level {{ m.version_group_details[0].level_learned_at }}
                            </p>
                        </td>
                        <td class="statCell">{{ getMovePower(m.move.name) }}</td>
                        <td class="statCell">{{ getMoveData(m.move.name).pp }}</td>
                        <td class="statCell">{{ getMoveAccuracy(m.move.name) }}</td>
                        <td class="statCell">{{ getMoveEffectChance(m.move.name) }}</td>
                        <td class="typeCell">
                            <span class="type-container" :class="getMoveData(m.move.name).damage_class.name">{{ getMoveData(m.move.name).damage_class.name }}</span>
                        </td>
                        <td class="typeCell">
                            <span class="type-container" :class="getMoveData(m.move.name).type.name">{{ getMoveData(m.move.name).type.name }}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </InformationSection>
</template>

<style scoped>
button {
    @apply px-4 py-2 rounded border enabled:hover:bg-red-500 focus:z-10 focus:ring-2 focus:ring-red-500 focus:bg-red-900 focus:text-white capitalize;
}

table {
    @apply capitalize;
}

.typeCell {
    @apply py-1 text-center w-16 border-x;
}

.statCell {
    @apply px-1 py-1 text-center border-x;
}

.type-container {
  @apply px-1 py-1 bg-red-300 text-xs rounded-sm font-bold align-middle whitespace-nowrap text-center inline-block min-w-[60px] text-white; 
  text-transform: uppercase; 
}

.bird {
  background-color: #B5C6F7;
}

.bug {
  background-color: #A8B820;
}

.dark {
  background-color: #705848;
}

.dragon {
  background-color: #7038F8;
}

.electric {
  background-color: #F8D030;
}

.fairy {
  background-color: #F7B5F7;
}

.flying {
  background-color: #A890F0;
}

.fighting {
  background-color: #C03028;
}

.fire {
  background-color: #F08030;
}

.ghost {
  background-color: #705898;
}

.grass {
  background-color: #78C850;
}

.ground {
  background-color: #E0C068;
}

.ice {
  background-color: #98D8D8;
}

.normal {
  background-color: #A8A878;
}

.poison {
  background-color: #A040A0;
}

.psychic {
  background-color: #F85888;
}

.rock {
  background-color: #B8A038;
}
.steel {
  background-color: #DBDBE8;
}

.water {
  background-color: #6890F0;
}

.status {
    background-color: #A19B8B;
}

.physical {
    background-color: #E47B66;
}

.special {
    background-color: #6D85AB;
}
</style>