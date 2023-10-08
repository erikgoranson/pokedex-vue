import type DefaultDTO from "./DefaultDTO"
import type PokemonMoveVersion from "./PokemonMoveVersion"

type PokemonMove = {
  move: DefaultDTO,
  version_group_details: PokemonMoveVersion[],
}

export default PokemonMove 
