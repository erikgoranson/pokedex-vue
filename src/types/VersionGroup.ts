import type DefaultDTO from "./DefaultDTO"

type VersionGroup = {
  id: number,
  generation?: DefaultDTO,
  move_learn_methods?: Array<DefaultDTO>,
  name: string,
  order?: number,
  pokedexes: Array<DefaultDTO>,
  regions: Array<DefaultDTO>,
  versions?: Array<DefaultDTO>,
}

export default VersionGroup 
