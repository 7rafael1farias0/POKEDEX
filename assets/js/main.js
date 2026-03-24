const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const modal = document.getElementById('modal-overlay')
const modalBody = document.getElementById('modal-body')
const closeModal = document.getElementById('close-modal')

const maxRecords = 151
const limit = 10
let offset = 0;

// Função que cria o HTML de cada card
function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" 
            onclick="showPokemonDetail('${pokemon.name}', '${pokemon.photo}', ${pokemon.hp}, ${pokemon.attack}, ${pokemon.defense}, '${pokemon.abilityUrl}', '${pokemon.abilities[0]}')">
            
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>
    `
}

// Função para carregar os Pokémons
function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

// Inicialização
loadPokemonItens(offset, limit)

// Evento do botão "Load More"
loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNextPage = offset + limit

    if (qtdRecordsWithNextPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)
        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})


// Função assíncrona para mostrar detalhes (chamada pelo onclick no LI)
async function showPokemonDetail(name, photo, hp, attack, defense, abilityUrl, abilityName) {
    modalBody.innerHTML = "Loading details...";
    modal.style.display = 'flex';

    try {
        const description = await pokeApi.getAbilityDescription(abilityUrl);
        
        modalBody.innerHTML = `
            <div class="modal-header">
                <h2 class="name" style="text-transform: capitalize">${name}</h2>
            </div>
            <img src="${photo}" alt="${name}" style="width: 150px">
            <div class="stats-row">
                <p><strong>HP:</strong> ${hp} | <strong>ATK:</strong> ${attack} | <strong>DEF:</strong> ${defense}</p>
            </div>
            <hr>
            <div class="ability-info">
                <h3>Ability: ${abilityName}</h3>
                <p><em>"${description}"</em></p>
            </div>
        `;
    } catch (error) {
        modalBody.innerHTML = "Error loading details.";
    }
}

// Fechar o modal no botão X
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
})

// Fechar o modal ao clicar na parte escura (fora do card)
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
})