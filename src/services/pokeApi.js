// src/services/pokeApi.js
import axios from 'axios';

const BASE_URL = 'https://pokeapi.co/api/v2';

const api = axios.create({ baseURL: BASE_URL });

export const getPokemonList = async (limit = 20, offset = 0) => {
  const { data } = await api.get(`/pokemon?limit=${limit}&offset=${offset}`);
  return data;
};

export const getPokemonDetail = async (nameOrId) => {
  const { data } = await api.get(`/pokemon/${nameOrId}`);
  return data;
};

export const getPokemonSpecies = async (id) => {
  const { data } = await api.get(`/pokemon-species/${id}`);
  return data;
};

// Paleta de cores por tipo de Pokémon
export const typeColors = {
  fire:     '#FF6B35',
  water:    '#4A9EFF',
  grass:    '#56C17B',
  electric: '#FFD93D',
  ice:      '#74D7E8',
  fighting: '#D6544D',
  poison:   '#A45DAB',
  ground:   '#D9A85B',
  flying:   '#7FA8E8',
  psychic:  '#FF6AA0',
  bug:      '#8FCB3C',
  rock:     '#B89D6A',
  ghost:    '#6B5DA8',
  dragon:   '#5A72E3',
  dark:     '#4A3D56',
  steel:    '#7D8FA8',
  fairy:    '#F2A8C8',
  normal:   '#9A9FA8',
};

export const getTypeColor = (type) => typeColors[type] || '#9A9FA8';
