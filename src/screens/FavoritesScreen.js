// src/screens/FavoritesScreen.js
import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getFavorites, removeFavorite } from '../services/favoritesService';
import { getTypeColor } from '../services/pokeApi';

const FavoriteItem = ({ item, onPress, onDelete }) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handleDelete = () => {
    Alert.alert(
      'Remover favorito',
      `Deseja remover ${item.nickname || item.name} dos favoritos?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            // Animação de saída
            Animated.parallel([
              Animated.timing(slideAnim, { toValue: -300, duration: 300, useNativeDriver: true }),
              Animated.timing(opacityAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
            ]).start(() => onDelete(item.firestoreId));
          },
        },
      ]
    );
  };

  const primaryType = item.types?.[0] || 'normal';
  const accentColor = getTypeColor(primaryType);

  return (
    <Animated.View
      style={{
        transform: [{ translateX: slideAnim }],
        opacity: opacityAnim,
      }}
    >
      <TouchableOpacity
        style={[styles.item, { borderColor: accentColor + '44' }]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={[styles.colorStrip, { backgroundColor: accentColor }]} />

        {item.sprite ? (
          <Image source={{ uri: item.sprite }} style={styles.sprite} />
        ) : (
          <View style={[styles.sprite, styles.spritePlaceholder]}>
            <Text style={{ fontSize: 28 }}>❓</Text>
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.name}>
            {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
          </Text>
          {item.nickname ? (
            <Text style={[styles.nickname, { color: accentColor }]}>"{item.nickname}"</Text>
          ) : null}
          <View style={styles.types}>
            {item.types?.map((t) => (
              <View
                key={t}
                style={[styles.typeBadge, { backgroundColor: getTypeColor(t) + '33', borderColor: getTypeColor(t) }]}
              >
                <Text style={[styles.typeText, { color: getTypeColor(t) }]}>
                  {t}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
          <Text style={styles.deleteIcon}>🗑️</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Recarregar ao focar na tela
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const data = await getFavorites();
      setFavorites(data);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível carregar os favoritos. Verifique as credenciais do Firebase.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (firestoreId) => {
    try {
      await removeFavorite(firestoreId);
      setFavorites((prev) => prev.filter((f) => f.firestoreId !== firestoreId));
    } catch {
      Alert.alert('Erro', 'Não foi possível remover o favorito.');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#FF6B35" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyEmoji}>⭐</Text>
          <Text style={styles.emptyTitle}>Sem favoritos ainda</Text>
          <Text style={styles.emptySubtitle}>
            Explore a Pokédex e favorite seus Pokémons preferidos!
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.firestoreId}
          renderItem={({ item }) => (
            <FavoriteItem
              item={item}
              onPress={() =>
                navigation.navigate('Detail', { id: item.pokemonId, name: item.name })
              }
              onDelete={handleDelete}
            />
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  list: { paddingVertical: 8, paddingBottom: 24 },
  item: {
    backgroundColor: '#1A1A1A',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  colorStrip: { width: 5, alignSelf: 'stretch' },
  sprite: { width: 70, height: 70, marginHorizontal: 12 },
  spritePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#222',
    borderRadius: 8,
    margin: 12,
  },
  info: { flex: 1, paddingVertical: 14 },
  name: { color: '#FFF', fontSize: 17, fontWeight: 'bold', marginBottom: 2 },
  nickname: { fontSize: 13, fontStyle: 'italic', marginBottom: 6 },
  types: { flexDirection: 'row', gap: 6 },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
  },
  typeText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  deleteBtn: { padding: 16 },
  deleteIcon: { fontSize: 20 },
  emptyEmoji: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  emptySubtitle: { color: '#555', fontSize: 14, textAlign: 'center', lineHeight: 22 },
});
