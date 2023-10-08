import type DefaultDTO from "./DefaultDTO"

type NamedAPIResourceList = {
  count: number,
  next: string,
  previous: string,
  results: Array<DefaultDTO>;
}

export default NamedAPIResourceList 
