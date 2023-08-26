<script setup lang="ts">
import InformationSection from './InformationSection.vue';
import { computed, reactive, ref, type Ref, watch} from 'vue';
import type { Move } from '@/components/types';
import { useVersionStore } from '@/stores/version';

const props = defineProps({
  data: {
    type: Array as () => Move[],
    required: true
  },
})

const store = useVersionStore();
const version = reactive(store);

//categories for all possible move learn methods
const learnMethods = ['level-up' , 'machine', 'egg' , 'tutor' , 'transfer' , 'other'] as const; 

//for creating a filter allowing only one of the six learnmethod categories
type FilterableKey = typeof learnMethods[number];

//the current filter being applied to move output
const filterKey = ref<FilterableKey>('level-up');

const filteredMoveData = computed(() => {
    let { data } = props;
    let results: Move[] = [] as Move[];

    //let generation = 'red-blue'; //need to set this reactively
    //let generation = JSON.parse(localStorage.getItem('selectedVersion') || '').version_group.name;//not sure if this works without being reactive
    let generation = store.data.version_group?.name;
    //console.log(store.data);

    data
        .filter((element: Move) => 
            element.version_group_details.some((subElement: any) => subElement.version_group.name === generation)) 
        .map((element: Move) => {
            let newElement = Object.assign({}, element);
            newElement.version_group_details = newElement.version_group_details.filter((subElement: any) => subElement.version_group.name === generation );
            results.push(newElement);
    })

    return results
})

const filteredMoveDataByMethod = computed(() => {
    const data = filteredMoveData.value; 
    const filter = filterKey.value; 

    //now kiss
    switch (filter) {
        case 'level-up':
            return data
                .filter(r => r.version_group_details[0].move_learn_method.name === filter)
                .sort((a, b) => a.version_group_details[0].level_learned_at - b.version_group_details[0].level_learned_at) as Move[];
        case 'egg':
        case 'tutor':
        case 'machine':
            return data
                .filter(r => r.version_group_details[0].move_learn_method.name === filter)
                .sort((a, b) => a.move.name.localeCompare(b.move.name)) as Move[];
        case 'transfer':
            return data
                .filter(r => 
                    r.version_group_details[0].move_learn_method.name === 'stadium-surfing-pikachu' || 
                    r.version_group_details[0].move_learn_method.name === 'colosseum-purification' || 
                    r.version_group_details[0].move_learn_method.name === 'xd-shadow' || 
                    r.version_group_details[0].move_learn_method.name === 'xd-purification')
                .sort((a, b) => a.move.name.localeCompare(b.move.name)) as Move[];
        case 'other':
            return data
                .filter(r => 
                    r.version_group_details[0].move_learn_method.name === 'light-ball-egg' || 
                    r.version_group_details[0].move_learn_method.name === 'form-change' || 
                    r.version_group_details[0].move_learn_method.name === 'zygarde-cube')
                .sort((a, b) => a.move.name.localeCompare(b.move.name)) as Move[];
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
    const data = filteredMoveData.value as Move[];

    let filteredMoveLearnMethods: string[] = [];
    data.map((m: Move) => {
        filteredMoveLearnMethods.push(m.version_group_details[0].move_learn_method.name);
    })

    //the actual names for 'transfer' learn methods in the API
    const transfer = ['stadium-surfing-pikachu','colosseum-purification','xd-shadow','xd-purification'];

    //the actual names for 'other' learn methods in the API
    const other = ['light-ball-egg','form-change','zygarde-cube'];

    //let test: boolean;
    switch (key) {
        case 'level-up':
        case 'egg':
        case 'tutor':
        case 'machine':
            return filteredMoveLearnMethods.includes(key);
            //break;
        case 'transfer':
            return filteredMoveLearnMethods.some(r=> transfer.includes(r));
            //break;
        case 'other':
            return filteredMoveLearnMethods.some(r=> other.includes(r));
            //break;
        default:
            //
    }
}

watch(version, (newValue, oldValue) => {
    //localStorage.setItem(selectedVersionKey, JSON.stringify(selectedVersion.value));
}); 

</script>

<template>
    <InformationSection>

        <div class="flex flex-col justify-center items-center">
            <div class="mb-2">MOVES</div>
            <div class="m-2 grid grid-cols-3 gap-4 content-center ..." >
                <button v-for="(method, index) in learnMethods" 
                :key="index" @click="filterBy(method)" 
                :class="{ 'bg-red-300': method === filterKey, 'border-red-300': testPossibleSelection(method), 'text-slate-800/50': !testPossibleSelection(method) }" 
                :disabled="!testPossibleSelection(method)" 
                class="px-4 py-2 rounded border-2">
                    {{ method.replace('-',' ') }}
                </button>
            </div>
            <div>
                <table>
                    <tbody>
                        <tr>
                            <td>Move Name</td>
                            <td>power</td>
                            <td>PP</td>
                            <td>type</td>
                        </tr>
                        <tr v-for="m in (filteredMoveDataByMethod as any)" :key="m">
                            <td>
                                <span class="font-semibold">{{m.move.name}}</span>
                                <p v-if="m.version_group_details[0].level_learned_at">
                                    Level {{ m.version_group_details[0].level_learned_at }}
                                </p>
                            </td>
                            <td>TBD</td>
                            <td>TBD</td>
                            <td>TBD</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    </InformationSection>
</template>

<style scoped>
button {
    text-transform: capitalize;
}
</style>