import type PokemonSpecies from "./PokemonSpecies"
import type PokemonType from "./PokemonType"

type EvolutionTrigger = {
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

export default EvolutionTrigger 
