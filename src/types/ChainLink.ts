import type DefaultDTO from "./DefaultDTO"
import type EvolutionDetail from "./EvolutionDetail"

type ChainLink = {
  is_baby: boolean,
  species: DefaultDTO,
  evolution_details: Array<EvolutionDetail>,
  evolves_to: Array<ChainLink>
}

export default ChainLink 
