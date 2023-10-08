import type DefaultDTO from "./DefaultDTO"
import type VersionEncounterDetail from "./VersionEncounterDetail"

type LocationAreaEncounter = {
  location_area: DefaultDTO,
  version_details: Array<VersionEncounterDetail>,
}

export default LocationAreaEncounter 
