import type DefaultDTO from "./DefaultDTO"

type EvolutionDetail = {
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

export default EvolutionDetail 
