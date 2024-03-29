import axios from 'axios';
import type { PokemonData, PokemonSpecies, Ability, EvolutionChain, LocationAreaEncounter, PokemonAbility, VersionGroup, Move, PokedexInfo, GridItem, PokemonTypes, DefaultDTO, NamedAPIResourceList, PokemonMove, PokemonSpeciesVariety } from '@/types';

//base url for fragments only
const PARTIAL_URL = 'https://pokeapi.co';

//base url for all normal calls
const BASE_URL = `${PARTIAL_URL}/api/v2`;

type Slots = 1 | 2;

///retrieves the provided pokemon type as a string at the given slot
function getPokemonType(types: PokemonTypes[], slot: Slots){ 
    let final: string = ''
    const theType: PokemonTypes = types.find((t) => t.slot === slot) || {} as PokemonTypes;
    
    if ( theType.slot ) {
      final = theType.type.name;
    }
    return final;
}

function getEndpointFromFragment(urlFragment: string){
    return urlFragment;
}

async function getPokemon(id: number){
    const endpoint = `${BASE_URL}/pokemon/${id}/`;
    const response = await axios.get<PokemonData>(endpoint);
    return response.data;
}

async function getPokemonByURL(url: string){
    const response = await axios.get<PokemonData>(url);
    return response.data;
}

async function getPokemonSpecies(id: number){
    const endpoint = `${BASE_URL}/pokemon-species/${id}/`;
    const response = await axios.get<PokemonSpecies>(endpoint);
    return response.data;
}

async function getAbility(partialPath: string){
    const endpoint = getEndpointFromFragment(partialPath);
    const response = await axios.get<Ability>(endpoint);
    return response.data;
}

async function getAbilities(abilities: PokemonAbility[]){
    const promises = abilities.map(ability => {
        const urlFragment = ability.ability.url;
        return getAbility(urlFragment);
    });

    return await Promise.all(promises);
}

async function getEvolutionChain(partialPath: string){
    const endpoint = getEndpointFromFragment(partialPath);
    const response = await axios.get<EvolutionChain>(endpoint);
    return response.data;
}

async function getPokemonLocationAreas(id: number){
    const endpoint = `${BASE_URL}/pokemon/${id}/encounters/`;
    const response = await axios.get<LocationAreaEncounter[]>(endpoint);
    return response.data;
}

async function getGenerations() {
    const endpoint = `${BASE_URL}/generation/`;
    const response = await axios.get<NamedAPIResourceList>(endpoint);
    return response.data.results;
}

async function getVersionGroups(){
    const endpoint = `${BASE_URL}/version-group/`;

    const versionGroupUrls = await axios
        .get<NamedAPIResourceList>(endpoint, { 
            params: { limit: '50'}
        });
    const versionGroups = await axios.all(
        versionGroupUrls.data.results.map((vg, index) => {
            return getVersionGroup(index+1);
        })
    );
    return versionGroups;
}

async function getVersionGroup(id: number){
    const endpoint = `${BASE_URL}/version-group/${id}/`;
    const response = await axios.get<VersionGroup>(endpoint);
    return response.data;
}

async function getMove(partialPath: string){
    const endpoint = getEndpointFromFragment(partialPath);
    const response = await axios.get<Move>(endpoint); 
    return response.data;
}

async function getMoves(pokemonMoves: PokemonMove[]) {
    let moves: Move[];

    const promises = pokemonMoves.map(m => {
        const urlFragment = m.move.url;
        return getMove(urlFragment);
    });

    return await Promise.all(promises);
}

async function getPokedex(id: number){
    const endpoint = `${BASE_URL}/pokedex/${id}/`;
    const response = await axios.get<PokedexInfo>(endpoint);
    return response.data;
}

async function getGridItems(pokedex: PokedexInfo){
    const promises = pokedex.pokemon_entries.map(entry => {
        const nationalId = entry.entry_number;
        return getGridItem(nationalId);
    });

    return await Promise.all(promises);
}

async function getGridItem(id: number){
    const response = await getPokemon(id);
    return <GridItem>{
        id: id,
        name: response.name,
        type1: getPokemonType(response.types, 1),
        type2: getPokemonType(response.types, 2),
    }
}

async function getPokedexEntries(pokedexes: DefaultDTO[]){
    const promises = pokedexes.map(pokedex => {
        const pokedexID = pokedex.url.split("/").slice(0, -1).pop() || 1;
        return getPokedex(Number(pokedexID));
    });
    const response = await Promise.all(promises);

    let allUrls: string[] = [];
    response.forEach(pokedex => {
        allUrls.push(...pokedex.pokemon_entries.map(entry => entry.pokemon_species.url)) 
    });
    const uniqueUrls = [...new Set(allUrls)];

    return uniqueUrls;
}

async function getPokemonVarieties(varieties: PokemonSpeciesVariety[]){
    const promises = varieties.map(v => {
        //const Id = v.pokemon.url
        //    .replace('https://pokeapi.co/api/v2/pokemon/','')
        //    .replace('','');
        return getPokemonByURL(v.pokemon.url);
    })

    return await Promise.all(promises);
}

export default { getPokemon, getPokemonSpecies, getAbility, getEvolutionChain, getPokemonLocationAreas, getGenerations, getVersionGroup, getVersionGroups, getMove, getMoves, getPokedex, getGridItem, getGridItems, getPokedexEntries, getAbilities, getPokemonVarieties }