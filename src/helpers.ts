import NameExceptions from '@/json/pokemonNameExceptions.json';

export default {
    retrieveLocalStorageData(key: string){
        const data = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key) || '') : null; 
        return data;
    },

    emptyLocalStorageData(){
      localStorage.clear();
    },

    getStatLabel(statName: string){
        let output = '';
        switch (statName) {
          case 'hp':
            output = statName; 
            break;
          case 'attack':
            output = 'atk';
            break;
          case 'defense':
            output = 'def';
            break;
          case 'special-attack':
            output = 'spa';
            break;
          case 'special-defense':
            output = 'spd';
            break;
          case 'speed':
            output = 'spe';
            break;
        }
        return output.toUpperCase();
    },

    transformGenerationName(generationName: string){
      //do not add 'generation' label if not applicable
      if (!generationName.includes('generation')){
        return generationName;
      }

      const romanNumerals = generationName.replace('generation-','').toUpperCase();
      return `Generation ${romanNumerals}`;
    },

    formatPokemonName(pokemonName: string) {
      const exceptions = NameExceptions.map(x => x.name);
      if(exceptions.includes(pokemonName)){
        return pokemonName;
      }
    
      const splits = pokemonName.split('-');
      return splits[0];
    },
}
