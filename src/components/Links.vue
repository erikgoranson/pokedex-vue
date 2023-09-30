<script setup lang="ts">
import InformationSection from './InformationSection.vue';
import { useVersionStore } from '@/stores/version';
import type { PokemonSpecies } from '@/types';
import { computed } from 'vue';

const props = defineProps({
  data: {
    type: Object as () => PokemonSpecies,
    required: true
  },
})

interface ExternalLinks {
    serebii: string,
    smogon: string,
    bulbapedia: string,
}

const store = useVersionStore();

const links = computed(() => {
    if(props.data.id == undefined){
        return;
    }

    let output = <ExternalLinks>{};
    let generation = store.data.generationName; 
    const pokemonID = String(props.data.id).padStart(3,'0');

    switch (generation){
        case 'generation-i':
            output.serebii = `https://www.serebii.net/pokedex/${pokemonID}.shtml`;
            output.smogon = `https://www.smogon.com/dex/rb/pokemon/${props.data.name}/`;
            break;
        case 'generation-ii':
            output.serebii = `https://www.serebii.net/pokedex-gs/${pokemonID}.shtml`;
            output.smogon = `https://www.smogon.com/dex/gs/pokemon/${props.data.name}/`;
            break;
        case 'generation-iii':
            output.serebii = `https://www.serebii.net/pokedex-rs/${pokemonID}.shtml`;
            output.smogon = `https://www.smogon.com/dex/rs/pokemon/${props.data.name}/`;
            break;
        case 'generation-iv':
            output.serebii = `https://www.serebii.net/pokedex-dp/${pokemonID}.shtml`;
            output.smogon = `https://www.smogon.com/dex/dp/pokemon/${props.data.name}/`;
            break;
        case 'generation-v':
            output.serebii = `https://www.serebii.net/pokedex-bw/${pokemonID}.shtml`;
            output.smogon = `https://www.smogon.com/dex/bw/pokemon/${props.data.name}/`;
            break;
        case 'generation-vi':
            output.serebii = `https://www.serebii.net/pokedex-xy/${pokemonID}.shtml`;
            output.smogon = `https://www.smogon.com/dex/xy/pokemon/${props.data.name}/`;
            break;
        case 'generation-vii':
            output.serebii = `https://www.serebii.net/pokedex-sm/${pokemonID}.shtml`;
            output.smogon = `https://www.smogon.com/dex/sm/pokemon/${props.data.name}/`;
            break;
        case 'generation-viii':
            output.serebii = `https://www.serebii.net/pokedex-swsh/${props.data.name}`;
            output.smogon = `https://www.smogon.com/dex/ss/pokemon/${props.data.name}/`;
            break;
        case 'generation-ix':
            output.serebii = `https://www.serebii.net/pokedex-sv/${props.data.name}`;
            output.smogon = `https://www.smogon.com/dex/sv/pokemon/${props.data.name}/`;
            break;
    }

    output.bulbapedia = `https://bulbapedia.bulbagarden.net/wiki/${props.data.name}`;

    return output;
}) 

</script>

<template>
    <InformationSection>
        <div class="flex flex-col mb-2 justify-center items-center">LINKS</div>
        <div class="flex flex-col mb-2 justify-center items-center">
            <a :href="links?.bulbapedia"> Bulbapedia </a>
            <a :href="links?.serebii"> Serebii </a>
            <a :href="links?.smogon"> Smogon </a>
        </div>
    </InformationSection>
</template>