import type DefaultDTO from "./DefaultDTO"

type Encounter = {
  min_level: number,
  max_level: number,
  condition_values: Array<DefaultDTO>,
  chance: number,
  method: DefaultDTO,
}

export default Encounter 
