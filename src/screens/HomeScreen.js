// src/screens/HomeScreen.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  TextInput,
  StyleSheet,
  Text,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
} from 'react-native';
import PokemonCard from '../components/PokemonCard';
import { getPokemonList, getPokemonDetail } from '../services/pokeApi';

const LIMIT = 20;

export default function HomeScreen({ navigation }) {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState(false);
  const [searching, setSearching] = useState(false);

  // Animação do header
  const headerAnim = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [60, 0],
    extrapolate: 'clamp',
  });
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
    loadPokemons(0);
  }, []);

  const loadPokemons = async (currentOffset) => {
    try {
      const data = await getPokemonList(LIMIT, currentOffset);
      const details = await Promise.all(
        data.results.map((p) => getPokemonDetail(p.name))
      );
      if (currentOffset === 0) {
        setPokemonList(details);
      } else {
        setPokemonList((prev) => [...prev, ...details]);
      }
      setHasMore(!!data.next);
    } catch (e) {
      console.error('Erro ao carregar Pokémons:', e);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore && !search) {
      setLoadingMore(true);
      const newOffset = offset + LIMIT;
      setOffset(newOffset);
      loadPokemons(newOffset);
    }
  };

  const handleSearch = async () => {
    const term = search.trim().toLowerCase();
    if (!term) return;
    setSearching(true);
    setSearchError(false);
    setSearchResult(null);
    try {
      const result = await getPokemonDetail(term);
      setSearchResult([result]);
    } catch {
      setSearchError(true);
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearch('');
    setSearchResult(null);
    setSearchError(false);
  };

  const displayedList = search && searchResult ? searchResult : pokemonList;

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <Animated.View
        style={[
          styles.searchContainer,
          {
            opacity: headerAnim,
            transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
          },
        ]}
      >
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nome ou número..."
          placeholderTextColor="#444"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoCapitalize="none"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearBtn}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </Animated.View>

      {searching && (
        <View style={styles.center}>
          <ActivityIndicator color="#FF6B35" size="large" />
        </View>
      )}

      {searchError && (
        <View style={styles.center}>
          <Text style={styles.errorEmoji}>😕</Text>
          <Text style={styles.errorText}>Pokémon não encontrado</Text>
          <TouchableOpacity onPress={clearSearch} style={styles.retryBtn}>
            <Text style={styles.retryText}>Limpar busca</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading && !searchError ? (
        <View style={styles.center}>
          <ActivityIndicator color="#FF6B35" size="large" />
          <Text style={styles.loadingText}>Carregando Pokédex...</Text>
        </View>
      ) : (
        !searchError && (
          <Animated.FlatList
            data={displayedList}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <PokemonCard
                pokemon={item}
                onPress={() => navigation.navigate('Detail', { id: item.id, name: item.name })}
              />
            )}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
            contentContainerStyle={styles.list}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.4}
            ListFooterComponent={
              loadingMore ? (
                <ActivityIndicator color="#FF6B35" style={{ marginVertical: 20 }} />
              ) : null
            }
            ListEmptyComponent={
              <View style={styles.center}>
                <Text style={styles.emptyText}>Nenhum resultado</Text>
              </View>
            }
          />
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    color: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  clearBtn: {
    position: 'absolute',
    right: 14,
    padding: 4,
  },
  clearText: { color: '#555', fontSize: 16 },
  list: { paddingVertical: 8, paddingBottom: 24 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  loadingText: { color: '#555', marginTop: 12, fontSize: 14 },
  errorEmoji: { fontSize: 48, marginBottom: 12 },
  errorText: { color: '#888', fontSize: 16, marginBottom: 16 },
  retryBtn: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryText: { color: '#FFF', fontWeight: '700' },
  emptyText: { color: '#555', fontSize: 16 },
});
