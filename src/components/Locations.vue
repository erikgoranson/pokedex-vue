<script setup lang="ts">
import InformationSection from './InformationSection.vue';
import type { PokemonData, PokemonSpecies, Ability, EvolutionChain, LocationAreaEncounter } from '@/components/types';

const props = defineProps({
  data: {
    type: Array as () => LocationAreaEncounter[],
    required: false,
  }
})

</script>

<template>
    <InformationSection>
        {{ props.data }}
    </InformationSection>
</template>