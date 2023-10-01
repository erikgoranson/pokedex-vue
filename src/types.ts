//PokeAPI types

export interface DefaultDTO {
    name: string,
    url: string,
}

export interface NamedAPIResourceList {
    count: number,
    next: string,
    previous: string,
    results: Array<DefaultDTO>;
}

export interface Move {
    id: number,
    name: string,
    accuracy: number,
    effect_chance: number, 
    pp: number,
    priority: number,
    power: number,
    //contest_combos
    //contest_type: DefaultDTO,
    //contest_effect
    damage_class: DefaultDTO,
    //effect_entries
    //effect_changes
    //learned_by_pokemon
    flavor_text_entries: Array<MoveFlavorText>,
    //generation
    //machines
    //meta
    //names
    //past_values
    //stat_changes
    //super_contest_effect
    //target
    type: DefaultDTO,
}

export interface MoveFlavorText {
    flavor_text: string,
    language: DefaultDTO,
    version_group: DefaultDTO,
}

export interface PokemonMove { 
    move: DefaultDTO,
    version_group_details: PokemonMoveVersion[],
}
  
export interface PokemonMoveVersion  {
    move_learn_method: DefaultDTO,
    version_group: DefaultDTO,
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

export interface PokemonData {
    name: string,
    id: number,
    height: number,
    weight: number,
    types: Array<PokemonTypes>,
    //temp
    moves: Array<PokemonMove>, 
    order: number,
    species: DefaultDTO, //genus comes from this endpoint "genera"; flavor-text comes from flaror_text_entries. could also get the species name from here for ease of printing. seems to prefer a single name over 'mimikyu-disguised' and other shit
    sprites: Sprites,
    stats: Array<PokemonStat>,
    abilities: Array<PokemonAbility>,
}

export interface PokemonAbility {
    is_hidden: boolean,
    slot: number,
    ability: DefaultDTO,
}

export interface Ability {
    id: number,
    name: string,
    is_main_series: boolean,
    generation: DefaultDTO,
    //names:
    //effect_entries: {},
    //effect_changes: {}, 
    flavor_text_entries: Array<AbilityFlavorText>,
    pokemon: Array<AbilityPokemon>,
}

export interface AbilityFlavorText  {
    flavor_text: string,
    language: DefaultDTO,
    version_group: DefaultDTO,
}

export interface AbilityPokemon  {
    is_hidden: boolean,
    slot: number,
    pokemon: Array<DefaultDTO>,
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
    entry_number: number, //may need to update types.ts
    pokemon_species: DefaultDTO
}

export interface PokemonSpecies {
    base_happiness: number,
    capture_rate: number,
    color: {},
    egg_groups: Array<DefaultDTO>,
    evolution_chain: DefaultDTO,
    evolves_from_species: DefaultDTO,
    flavor_text_entries: Array<FlavorText>, 
    //form_descriptions	[],
    forms_switchable: boolean,
    gender_rate: number,
    genera: Array<Genus>, 
    generation: DefaultDTO,
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

export interface EvolutionChain {
    id: number,
    baby_trigger_item: DefaultDTO,
    chain: ChainLink,
}

export interface ChainLink  {
    is_baby: boolean,
    species: DefaultDTO,
    evolution_details: Array<EvolutionDetail>,
    evolves_to: Array<ChainLink>
}

export interface EvolutionDetail {
    item: DefaultDTO,
    trigger: DefaultDTO,
    gender: number,
    held_item: DefaultDTO,
    known_move: DefaultDTO,
    known_move_type: DefaultDTO,
    location: DefaultDTO,
    min_level: number,
    min_happiness: number,
    min_beauty: number,
    min_affection: number,
    needs_overworld_rain: boolean,
    party_species: DefaultDTO,
    party_type: DefaultDTO,
    relative_physical_stats: number,
    time_of_day: string,
    trade_species: DefaultDTO,
    turn_upside_down: boolean,
}

export interface EvolutionTrigger    {
    id: number,
    name: string,
    //names,
    pokemon_species: Array<PokemonSpecies>,
    min_level: number,
    min_happiness: number,
    min_beauty: number,
    min_affection: number,
    needs_overworld_rain: boolean,
    party_species: PokemonSpecies,
    party_type: PokemonType,
    relative_physical_stats: number,
    time_of_day: string,
    trade_species: PokemonSpecies,
    turn_upside_down: boolean,
}

//item

export interface LocationAreaEncounter {
    location_area: DefaultDTO,
    version_details: Array<VersionEncounterDetail>,
}

export interface VersionEncounterDetail {
    version: DefaultDTO,
    max_chance: number,
    encounter_details: Array<Encounter>,
}

export interface Encounter {
    min_level: number,
    max_level: number,
    condition_values: Array<DefaultDTO>,
    chance: number,
    method: DefaultDTO,
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

export interface GridItem { 
    id: number,  //nationalID
    name: string,
    type1: string,
    type2: string,
} 
