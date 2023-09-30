
export default {
    retrieveLocalStorageData(key: string){
        const data = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key) || '') : null; 
        return data;
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
}
