<script setup lang="ts">
import InformationSection from './InformationSection.vue';
import type { PokemonData, } from '@/types';

const props = defineProps({
  data: {
    type: Object as () => PokemonData,
    required: true
  },
})

</script>

<template>
    <InformationSection>
        <div class="flex items-center justify-center">
            <img class="" :src="props.data.sprites.other['official-artwork'].front_default"/>
        </div>
    </InformationSection>
</template>