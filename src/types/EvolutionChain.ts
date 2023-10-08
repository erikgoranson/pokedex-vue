import type ChainLink from "./ChainLink"
import type DefaultDTO from "./DefaultDTO"

type EvolutionChain = {
  id: number,
  baby_trigger_item: DefaultDTO,
  chain: ChainLink,
}

export default EvolutionChain 
