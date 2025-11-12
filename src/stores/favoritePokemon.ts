import { defineStore } from 'pinia';
import helpers from '@/helpers';
import { ref } from 'vue';

const favoriteListKey: string = 'pokedex_favorites';
const favorites: number[] = helpers.retrieveLocalStorageData(favoriteListKey) ?? [];

export const useFavoritePokemonStore = defineStore('favoritePokemon', () => {
    const data = ref(favorites);

    function toggleFavorite (id: number){
        if (!data.value.includes(id)){
            data.value.push(id);
        }
        else {
            data.value = data.value.filter(d => d !== id);
        }
        localStorage.setItem(favoriteListKey, JSON.stringify(data.value));
    }

    return { data, toggleFavorite }
});