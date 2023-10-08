import type DefaultDTO from "./DefaultDTO"
import type MoveFlavorText from "./MoveFlavorText"

type Move = {
  id: number,
  name: string,
  accuracy: number,
  effect_chance: number,
  pp: number,
  priority: number,
  power: number,
  //contest_combos
  //contest_type: DefaultDTO,
  //contest_effect
  damage_class: DefaultDTO,
  //effect_entries
  //effect_changes
  //learned_by_pokemon
  flavor_text_entries: Array<MoveFlavorText>,
  //generation
  //machines
  //meta
  //names
  //past_values
  //stat_changes
  //super_contest_effect
  //target
  type: DefaultDTO,
}

export default Move
