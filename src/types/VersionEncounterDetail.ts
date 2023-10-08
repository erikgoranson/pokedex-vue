import type DefaultDTO from "./DefaultDTO"
import type Encounter from "./Encounter"

type VersionEncounterDetail = {
  version: DefaultDTO,
  max_chance: number,
  encounter_details: Array<Encounter>,
}

export default VersionEncounterDetail 
