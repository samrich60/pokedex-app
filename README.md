# Pokédex App 🔴⚪

Aplicativo móvel desenvolvido em **React Native (Expo)** como projeto prático da disciplina de Programação de Banco de Dados SQL.

## 📱 Sobre o App

Uma Pokédex interativa que permite explorar Pokémons, ver seus detalhes, e gerenciar uma lista de favoritos personalizada com apelidos — tudo salvo na nuvem via Firebase.

## 🎯 Requisitos Técnicos Atendidos

| Requisito | Implementação |
|-----------|--------------|
| ✅ Navegação com 3+ telas | Bottom Tab + Stack Navigation (Home → Lista → Detalhes + Favoritos) |
| ✅ API Externa | [PokeAPI](https://pokeapi.co/) — listagem, busca e detalhes de Pokémons |
| ✅ CRUD Firebase | Favoritos: Create, Read, Update (apelido), Delete |
| ✅ Animações | Sprite com fade+bounce, barras de status animadas, cards com spring press, saída de items com slide |

## 🗂️ Estrutura do Projeto

```
pokedex-app/
├── App.js
├── src/
│   ├── navigation/
│   │   └── AppNavigator.js       # Stack + Tab Navigation
│   ├── screens/
│   │   ├── HomeScreen.js         # Lista + Busca de Pokémons
│   │   ├── DetailScreen.js       # Detalhes + Favoritar + Apelido
│   │   └── FavoritesScreen.js    # Lista de Favoritos (CRUD)
│   ├── components/
│   │   └── PokemonCard.js        # Card reutilizável com animação
│   └── services/
│       ├── firebase.js           # Configuração do Firebase
│       ├── pokeApi.js            # Consumo da PokeAPI (axios)
│       └── favoritesService.js   # CRUD Firestore
```

## 🔥 Configuração do Firebase

1. Acesse [console.firebase.google.com](https://console.firebase.google.com/)
2. Crie um novo projeto (ex: `pokedex-app`)
3. Vá em **Firestore Database** → Criar banco → Modo de teste
4. No menu lateral, clique em ⚙️ **Configurações do projeto** → **Seus apps** → adicione um app Web
5. Copie as credenciais e cole no arquivo `src/services/firebase.js`:

```js
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJECT.firebaseapp.com",
  projectId: "SEU_PROJECT",
  storageBucket: "SEU_PROJECT.appspot.com",
  messagingSenderId: "...",
  appId: "...",
};
```

## 🚀 Como Rodar

### Pré-requisitos
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Expo Go no celular (Android/iOS) **ou** emulador

### Instalação

```bash
# Instalar dependências
npm install

# Iniciar o projeto
npx expo start
```

Escaneie o QR Code com o **Expo Go** no celular ou pressione `a` para Android / `i` para iOS (emulador).

## 🌐 API Utilizada

**PokeAPI** — `https://pokeapi.co/api/v2`
- Gratuita, sem autenticação
- Endpoints usados:
  - `GET /pokemon?limit=20&offset=0` — listagem paginada
  - `GET /pokemon/{name|id}` — detalhes do Pokémon
  - `GET /pokemon-species/{id}` — descrição e lore

## ✨ Funcionalidades

- **Listagem** paginada de todos os Pokémons com scroll infinito
- **Busca** por nome ou número
- **Tela de detalhes** com sprite animado, tipos, stats, medidas, habilidades e descrição
- **Favoritar** Pokémons (salvo no Firestore)
- **Apelidos** personalizados (Update no Firestore)
- **Remover** favoritos com animação de saída (Delete no Firestore)
- Cores dinâmicas por tipo de Pokémon
- Interface dark com animações de spring e fade

## 👥 Dupla

- [Sammy Richard Alves Ferreira Mendes de Sousa]
- [João Victor ded Castro Souza]

---

*Disciplina: Programação Aplicativos Moveis — Prof. Karython Gomes — UNIDESC*
