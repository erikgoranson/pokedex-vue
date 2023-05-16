//PokeAPI types

export interface DefaultDTO {
    name: string,
    url: string,
}

export interface Move { 
    move: DefaultDTO,
    version_group_details: PokemonMoveVersion[],
}
  
export interface PokemonMoveVersion  {
    move_learn_method: DefaultDTO,
    version_group: {},
    level_learned_at: number,
}

export interface VersionGroup {
    id: number,
    generation?: DefaultDTO,
    move_learn_methods?: Array<DefaultDTO>,
    name: string,
    order?: number,
    pokedexes: Array<DefaultDTO>,
    regions: Array<DefaultDTO>,
    versions?: Array<DefaultDTO>,
}

export interface ExtendedPokemonData extends PokemonData {
    entry_number: string,
  }

export interface PokemonData {
    name: string,
    id: number,
    types: Array<PokemonTypes>,
    //temp
    moves: Array<Move>, 
    order: number,
    species: Array<DefaultDTO>,
    sprites: {}, //later
    stats: Array<Stat>,
}
  
export  interface PokemonTypes {
    slot: number,
    type: DefaultDTO,
}
  
export interface PokemonType { 
    name: string,
    url: string,
}
  
export interface Stat {
    base_stat: number,
    effort: 0,
    stat: DefaultDTO,
}

export interface PokedexInfo {
    name: string,
    pokemon_entries: PokemonEntry[]
}

export interface PokemonEntry {
    entry_number: string, //may need to update types.ts
    pokemon_species: PokemonSpecies
}

export interface PokemonSpecies {
    name: string,
    url: string
}

//custom types 

export interface SelectionGroup {
    generationName: string,
    version_groups: Array<VersionGroup>, 
}

export interface Selection {
    name: string, 
    generationName: string,
    version_group: VersionGroup, 
}

export interface GridItem { //should be gridrow or gridItem I think
    id: number, 
    name: string,
    "national ID": number,
    type1: string,
    type2: string,
    payload: PokemonData,
} 