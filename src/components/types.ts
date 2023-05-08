
export interface SearchItem {
    id: string, 
    name: string,
    "national id": string,
    types: string,
    url: string,
} 

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
  