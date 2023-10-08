import type DefaultDTO from "./DefaultDTO"
import type FlavorText from "./FlavorText"
import type Genus from "./Genus"

type PokemonSpecies = {
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

export default PokemonSpecies 
