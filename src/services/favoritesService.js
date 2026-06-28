// src/services/favoritesService.js
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION = 'favorites';

// CREATE - Adicionar favorito
export const addFavorite = async (pokemon) => {
  const docRef = await addDoc(collection(db, COLLECTION), {
    pokemonId: pokemon.id,
    name: pokemon.name,
    nickname: '',
    types: pokemon.types.map((t) => t.type.name),
    sprite: pokemon.sprites?.other?.['official-artwork']?.front_default || pokemon.sprites?.front_default,
    addedAt: new Date().toISOString(),
  });
  return docRef.id;
};

// READ - Listar favoritos
export const getFavorites = async () => {
  const q = query(collection(db, COLLECTION), orderBy('addedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ firestoreId: d.id, ...d.data() }));
};

// UPDATE - Atualizar apelido
export const updateNickname = async (firestoreId, nickname) => {
  const docRef = doc(db, COLLECTION, firestoreId);
  await updateDoc(docRef, { nickname });
};

// DELETE - Remover favorito
export const removeFavorite = async (firestoreId) => {
  await deleteDoc(doc(db, COLLECTION, firestoreId));
};
