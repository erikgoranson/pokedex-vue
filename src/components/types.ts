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
    entry_number: string, //what is this????
  }

export interface PokemonData {
    name: string,
    id: number,
    types: Array<PokemonTypes>,
    //temp
    moves: Array<Move>, 
    order: number,
    species: DefaultDTO, //genus comes from this endpoint "genera"; flavor-text comes from flaror_text_entries. could also get the species name from here for ease of printing. seems to prefer a single name over 'mimikyu-disguised' and other shit
    sprites: Sprites,
    stats: Array<PokemonStat>,
}

export interface Sprites {
    front_default: string,
    other: OtherArt,
}

interface OtherArt {
    ['official-artwork']: OfficialArtwork,
}

interface OfficialArtwork {
    front_default: string,
    front_shiny: string,
}
  
export interface PokemonTypes {
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
    pokemon_species: DefaultDTO
}

export interface PokemonSpecies {
    base_happiness: number,
    capture_rate: number,
    color: {},
    egg_groups: {},
    evolution_chain: {},
    evolves_from_species: {},
    flavor_text_entries: Array<FlavorText>, 
    //form_descriptions	[],
    forms_switchable: boolean,
    gender_rate: number,
    genera: Array<Genus>, 
    generation: boolean,
    growth_rate: boolean,
    habitat: boolean,
    has_gender_differences: boolean,
    hatch_counter: number,
    id: number,
    is_baby: boolean,
    is_legendary: boolean,
    is_mythical: boolean,
    name: string,
    //names	[…],
    order: number,
    //pal_park_encounters	[…],
    //pokedex_numbers	[…],
    shape: {},
    //varieties	[…],
}

export interface Genus {
    genus: string,
    language: DefaultDTO
}

export interface FlavorText {
    flavor_text: string,
    language: DefaultDTO,
    version: DefaultDTO,
}

export interface PokemonStat {
    stat: DefaultDTO,
    effort: number,
    base_stat: number,
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