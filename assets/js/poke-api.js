
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type
    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    pokemon.hp = pokeDetail.stats[0].base_stat;
    pokemon.attack = pokeDetail.stats[1].base_stat;
    pokemon.defense = pokeDetail.stats[2].base_stat;
    pokemon.abilities = pokeDetail.abilities.map((slot) => slot.ability.name);
    pokemon.abilityUrl = pokeDetail.abilities[0].ability.url; // Pega o link da 1ª habilidade

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
     }


 pokeApi.getAbilityDescription = (url) => {
    return fetch(url)
        .then((response) => response.json())
        .then((abilityData) => {
            // Filtra para pegar a entrada de efeito em inglês ('en') ou português ('pt')
            const effectEntry = abilityData.effect_entries.find(
                (entry) => entry.language.name === 'en' || entry.language.name === 'pt'
            );
            return effectEntry ? effectEntry.short_effect : "No description available.";
        });

}