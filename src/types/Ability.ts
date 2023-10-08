import type DefaultDTO from "./DefaultDTO"
import type AbilityFlavorText from "./AbilityFlavorText"
import type AbilityPokemon from "./AbilityPokemon"

type Ability = {
  id: number,
  name: string,
  is_main_series: boolean,
  generation: DefaultDTO,
  //names:
  //effect_entries: {},
  //effect_changes: {}, 
  flavor_text_entries: Array<AbilityFlavorText>,
  pokemon: Array<AbilityPokemon>,
}

export default Ability 
