## pokedex-vue

A pokedex made with Vue+TypeScript as a fun, personal project. This was largely meant for a good challenge (see: the PokeAPI) and for practice with Vue and TS. Will continue to make additions to this over time as my kids are a very particular audience. Next addition planned is to see all possible variants of the selected pokemon, including shinies. Open to feedback and suggestions

Viewable live at https://erikgoranson-pokedex-vue.vercel.app/

This pokedex draws from the PokeAPI and has data for all 1008 pokemon in all of the core games from generation 1 through 9. It includes:

- pokedex entries
- base stats  
- species details
- evolution tree(s)
- abilities
- moves (with a buttongroup for filtering by learn method)
- locations
- selection menu to choose between different game version groups
- searchable table that displays all pokemon from the currently selected version group
- links to external pokemon databases (in case you require additional exhaustive information provided by those sites)

## Screenshots 

![[pokedex-desktop](https://user-images.githubusercontent.com/54157038/205478600-09fc26b0-a816-40db-9a7e-8b30c9913bac.PNG)](https://raw.githubusercontent.com/erikgoranson/pokedex-vue/master/screenshot_v1.PNG)

![[pokedex-mobile](https://user-images.githubusercontent.com/54157038/205478600-09fc26b0-a816-40db-9a7e-8b30c9913bac.PNG)](https://raw.githubusercontent.com/erikgoranson/pokedex-vue/master/screenshot_v1-mobile.PNG)



https://raw.githubusercontent.com/erikgoranson/pokedex-vue/master/screenshot_v1-mobile.PNG

## Acknowledgments
 
[PokeAPI](https://github.com/PokeAPI/api-data) - all data

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
 

 