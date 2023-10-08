import type DefaultDTO from "./DefaultDTO"
import type PokemonAbility from "./PokemonAbility"
import type PokemonMove from "./PokemonMove"
import type PokemonStat from "./PokemonStat"
import type PokemonType from "./PokemonType"
import type Sprites from "./Sprites"

type PokemonData = {
  name: string,
  id: number,
  height: number,
  weight: number,
  types: Array<PokemonType>,
  //temp
  moves: Array<PokemonMove>,
  order: number,
  species: DefaultDTO, //genus comes from this endpoint "genera"; flavor-text comes from flaror_text_entries. could also get the species name from here for ease of printing. seems to prefer a single name over 'mimikyu-disguised' and other shit
  sprites: Sprites,
  stats: Array<PokemonStat>,
  abilities: Array<PokemonAbility>,
}

export default PokemonData 
