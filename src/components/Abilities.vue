<script setup lang="ts">
import type { PokemonAbility, Ability } from '@/components/types';
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
    if(!genHasAbilities){
        return; //is this necessary if we're gonna use a v-if / v-else?
        //no, but it's sterile and I like the taste
    }

    const versionGroup = store.data.version_group.name;
    const match = props.abilitiesInfo.find(x => x.id == id);

    if(match){ 
        const test = match.flavor_text_entries.find(x => 
        x.version_group.name == versionGroup && x.language.name == 'en'
        )

        if(test){
            return test.flavor_text
        }
    }
}

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
                <div></div>

                <div v-if="genHasAbilities" class="mb-2" v-for="ability, index in abilitiesInfo">
                    <div v-if="ability.generation.name == store.data.generationName">
                        <p class="uppercase font-semibold">{{ ability.name }} {{ getHiddenState(index) ? ' (Hidden Ability)' : '' }}</p>
                        <p class="text-xs md:text-sm">{{ getFlavorText(ability.id) }}</p>
                    </div>
                    
                </div>

                <div v-else class="mb-2">Abilities were not introduced until Generation III</div>

            </div>
        </div>
    </InformationSection>
</template>

<style scoped></style>