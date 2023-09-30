<script setup lang="ts">
import type { PokemonAbility, Ability } from '@/types';
import InformationSection from './InformationSection.vue';
import { computed} from "vue";
import { useVersionStore } from '@/stores/version';

const props = defineProps({
  abilities: {
    type: Array as () => PokemonAbility[],
    required: true
  },
  abilitiesInfo: {
    type: Array as () => Ability[],
    required: true
  },
})

const store = useVersionStore();
const generationsWithoutAbilities = ['generation-i','generation-ii'];

const genHasAbilities = computed(() => {
    const generation = store.data.generationName;
    const hasAbilities = !generationsWithoutAbilities.includes(generation);

    return hasAbilities;
})

function getFlavorText(id: number){
    const match = filteredAbilities.value.find(x => x.id == id);

    if(match){
        const text = match.flavor_text_entries.find(x => x.language.name == 'en')
        return (text !== undefined) ? text.flavor_text : '';
    }

    return '';
}

const filteredAbilities = computed(() => {
    const versiongroup = store.data.version_group.name;

    //list matches where the ability's versiongroup (nested in flavor_text_entries) matches the store's versiongroup
    const vgMatches = props.abilitiesInfo
    .filter(ability => 
        ability.flavor_text_entries
            .some(f => 
            f.version_group.name == versiongroup 
            && f.language.name == 'en'
        ) 
    );

    //list matches where the ability is not hidden
    const nonHiddenMatches = vgMatches.filter((a, index) => !props.abilities[index].is_hidden)

    /* 
    - apparently none of the abilities for pokemon in gen iX have generation name matching 'generation-ix' or version group name matching 'scarlet-violet'. the only reliable way to get abilities to display properly for gen ix seems to be by returning all of them
    - version group legends-arceus seems to behave the same way, however, the other game in gen viii (sword/shield) works fine using the logic that the rest of the generations expect. this version group has a unique conditional block to handle this
    - hidden abilities didn't exist before gen v, so these are filtered out
    */

    if(store.data.version_group.name == 'legends-arceus'){
        return props.abilitiesInfo
    }
    
    switch (store.data.generationName) {
        case 'generation-i':
        case 'generation-ii':
        case 'generation-iii':
        case 'generation-iv':
            return nonHiddenMatches; 
        case 'generation-ix':
            return props.abilitiesInfo;
        default:
            return vgMatches;
    };
})

function getHiddenState(index: number){
    const ability = props.abilities[index];
    return ability.is_hidden;
}

</script>

<template>
    <InformationSection>
        <div class="relative overflow-x-auto mx-6">
            <div class="flex flex-col mb-2">

                <div class="flex items-center justify-center">ABILITIES</div>

                <div class="flex items-center justify-center" v-if="!genHasAbilities">Abilities were not introduced until Generation III</div>
                <div class="mb-2" v-else-if="filteredAbilities.length > 0" v-for="ability, index in filteredAbilities">
                    <p class="uppercase font-semibold">
                        {{ ability.name }} {{ getHiddenState(index) ? ' (Hidden Ability)' : '' }}</p>
                    <p class="text-xs md:text-sm">{{ getFlavorText(ability.id) }}</p>
                </div>
                <div class="flex items-center justify-center" v-else>Ability information not found for {{ abilitiesInfo.length }} abilities</div>

            </div>
        </div>
    </InformationSection>
</template>

<style scoped></style>