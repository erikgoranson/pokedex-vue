<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import UnfavoritedIcon from '@/assets/images/favoriteIcon0.svg';
import FavoritedIcon from '@/assets/images/favoriteIcon1.svg';
import { useFavoritePokemonStore } from '@/stores/favoritePokemon';

const props = defineProps({
  id: {
    type: Number,
    required: true,
  }
})

const favStore = useFavoritePokemonStore();
const { data } = storeToRefs(favStore);

const isFavorite = computed(() => {
    return data.value.includes(props.id);
});

const toggleFavorite = () => {
    favStore.toggleFavorite(props.id);
}

</script>


<template>
    <div class="absolute bottom-0 right-0 p-4 text-black" @click="toggleFavorite">
        <FavoritedIcon v-if="isFavorite" class="favoriteIcon" />
        <UnfavoritedIcon v-else class="favoriteIcon" />
    </div>
</template>

<style scoped>
.favoriteIcon {
    @apply fill-yellow-500 min-h-[30px] min-w-[30px] max-h-[30px] max-w-[30px] cursor-pointer hover:bg-yellow-100 rounded-full;
}
</style>