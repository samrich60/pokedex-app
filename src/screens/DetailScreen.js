// src/screens/DetailScreen.js
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { getPokemonDetail, getPokemonSpecies, getTypeColor } from '../services/pokeApi';
import { addFavorite, getFavorites, updateNickname, removeFavorite } from '../services/favoritesService';

const StatBar = ({ label, value, color }) => {
  const barAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(barAnim, {
      toValue: Math.min(value / 255, 1),
      duration: 800,
      delay: 200,
      useNativeDriver: false,
    }).start();
  }, [value]);

  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <View style={styles.statTrack}>
        <Animated.View
          style={[
            styles.statFill,
            {
              width: barAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </View>
  );
};

export default function DetailScreen({ route }) {
  const { id } = route.params;
  const [pokemon, setPokemon] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [favDoc, setFavDoc] = useState(null);
  const [nickname, setNickname] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [nicknameInput, setNicknameInput] = useState('');
  const [favLoading, setFavLoading] = useState(false);

  // Animações
  const spriteAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [data, favorites] = await Promise.all([
        getPokemonDetail(id),
        getFavorites(),
      ]);
      setPokemon(data);

      // Checar se já é favorito
      const found = favorites.find((f) => f.pokemonId === data.id);
      if (found) {
        setIsFav(true);
        setFavDoc(found);
        setNickname(found.nickname || '');
      }

      // Buscar descrição
      try {
        const species = await getPokemonSpecies(data.id);
        const ptDesc = species.flavor_text_entries.find((e) => e.language.name === 'pt-BR');
        const enDesc = species.flavor_text_entries.find((e) => e.language.name === 'en');
        const desc = (ptDesc || enDesc)?.flavor_text?.replace(/\f/g, ' ') || '';
        setDescription(desc);
      } catch {}

      // Animar entrada do sprite
      Animated.sequence([
        Animated.timing(spriteAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(bounceAnim, { toValue: 1.08, useNativeDriver: true, speed: 5 }),
        Animated.spring(bounceAnim, { toValue: 1, useNativeDriver: true, speed: 5 }),
      ]).start();

      Animated.timing(fadeAnim, { toValue: 1, duration: 600, delay: 300, useNativeDriver: true }).start();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    setFavLoading(true);
    try {
      if (isFav && favDoc) {
        // DELETE
        await removeFavorite(favDoc.firestoreId);
        setIsFav(false);
        setFavDoc(null);
        setNickname('');
        // Animação de "desfavoritar"
        Animated.sequence([
          Animated.spring(bounceAnim, { toValue: 0.85, useNativeDriver: true, speed: 30 }),
          Animated.spring(bounceAnim, { toValue: 1, useNativeDriver: true, speed: 20 }),
        ]).start();
      } else {
        // CREATE
        const newId = await addFavorite(pokemon);
        const favorites = await getFavorites();
        const found = favorites.find((f) => f.firestoreId === newId);
        setFavDoc(found || { firestoreId: newId });
        setIsFav(true);
        // Animação de "favoritar"
        Animated.sequence([
          Animated.spring(bounceAnim, { toValue: 1.2, useNativeDriver: true, speed: 20 }),
          Animated.spring(bounceAnim, { toValue: 1, useNativeDriver: true, speed: 15 }),
        ]).start();
      }
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar no Firebase. Verifique as credenciais.');
    } finally {
      setFavLoading(false);
    }
  };

  const handleUpdateNickname = async () => {
    if (!favDoc) return;
    try {
      await updateNickname(favDoc.firestoreId, nicknameInput.trim());
      setNickname(nicknameInput.trim());
      setModalVisible(false);
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar o apelido.');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#FF6B35" size="large" />
      </View>
    );
  }

  if (!pokemon) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Pokémon não encontrado</Text>
      </View>
    );
  }

  const primaryType = pokemon.types?.[0]?.type?.name || 'normal';
  const accentColor = getTypeColor(primaryType);
  const sprite =
    pokemon.sprites?.other?.['official-artwork']?.front_default ||
    pokemon.sprites?.front_default;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <View style={[styles.hero, { backgroundColor: accentColor + '22' }]}>
        <Animated.Image
          source={{ uri: sprite }}
          style={[
            styles.sprite,
            {
              opacity: spriteAnim,
              transform: [
                { scale: Animated.multiply(spriteAnim, bounceAnim) },
                {
                  translateY: spriteAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [40, 0],
                  }),
                },
              ],
            },
          ]}
        />
      </View>

      <Animated.View style={[styles.body, { opacity: fadeAnim }]}>
        {/* Nome e ID */}
        <View style={styles.nameRow}>
          <View>
            <Text style={styles.pokeId}>#{String(pokemon.id).padStart(3, '0')}</Text>
            <Text style={styles.pokeName}>
              {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
            </Text>
            {nickname ? (
              <Text style={[styles.nickname, { color: accentColor }]}>"{nickname}"</Text>
            ) : null}
          </View>
          <Animated.View style={{ transform: [{ scale: bounceAnim }] }}>
            <TouchableOpacity
              onPress={handleFavorite}
              disabled={favLoading}
              style={[styles.favBtn, { backgroundColor: isFav ? accentColor : '#1A1A1A' }]}
            >
              <Text style={styles.favIcon}>{isFav ? '⭐' : '☆'}</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Tipos */}
        <View style={styles.types}>
          {pokemon.types.map((t) => (
            <View
              key={t.type.name}
              style={[styles.typeBadge, { backgroundColor: getTypeColor(t.type.name) }]}
            >
              <Text style={styles.typeText}>{t.type.name.toUpperCase()}</Text>
            </View>
          ))}
        </View>

        {/* Apelido (se favorito) */}
        {isFav && (
          <TouchableOpacity
            style={[styles.nicknameBtn, { borderColor: accentColor }]}
            onPress={() => {
              setNicknameInput(nickname);
              setModalVisible(true);
            }}
          >
            <Text style={[styles.nicknameBtnText, { color: accentColor }]}>
              {nickname ? '✏️ Editar apelido' : '✏️ Adicionar apelido'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Descrição */}
        {description ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Descrição</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
        ) : null}

        {/* Medidas */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Medidas</Text>
          <View style={styles.measures}>
            <View style={styles.measureItem}>
              <Text style={styles.measureValue}>{(pokemon.height / 10).toFixed(1)} m</Text>
              <Text style={styles.measureLabel}>Altura</Text>
            </View>
            <View style={[styles.measureDivider, { backgroundColor: accentColor }]} />
            <View style={styles.measureItem}>
              <Text style={styles.measureValue}>{(pokemon.weight / 10).toFixed(1)} kg</Text>
              <Text style={styles.measureLabel}>Peso</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Status Base</Text>
          {pokemon.stats.map((s) => (
            <StatBar
              key={s.stat.name}
              label={s.stat.name.replace('special-', 'Sp. ').replace('-', ' ')}
              value={s.base_stat}
              color={accentColor}
            />
          ))}
        </View>

        {/* Habilidades */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Habilidades</Text>
          <View style={styles.abilities}>
            {pokemon.abilities.map((a) => (
              <View
                key={a.ability.name}
                style={[styles.abilityBadge, { backgroundColor: accentColor + '22', borderColor: accentColor + '55' }]}
              >
                <Text style={[styles.abilityText, { color: accentColor }]}>
                  {a.ability.name.replace('-', ' ')}
                  {a.is_hidden ? ' 🔒' : ''}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Animated.View>

      {/* Modal de apelido */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Apelido do Pokémon</Text>
            <TextInput
              style={styles.modalInput}
              value={nicknameInput}
              onChangeText={setNicknameInput}
              placeholder="Digite um apelido..."
              placeholderTextColor="#555"
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[styles.modalBtn, styles.cancelBtn]}
              >
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleUpdateNickname}
                style={[styles.modalBtn, { backgroundColor: accentColor }]}
              >
                <Text style={styles.saveBtnText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0D0D0D' },
  hero: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  sprite: { width: 200, height: 200 },
  body: { paddingHorizontal: 16, paddingBottom: 40 },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  pokeId: { color: '#555', fontSize: 14, fontWeight: '600' },
  pokeName: { color: '#FFF', fontSize: 28, fontWeight: 'bold' },
  nickname: { fontSize: 15, fontStyle: 'italic', marginTop: 2 },
  favBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favIcon: { fontSize: 22 },
  types: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  typeBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  typeText: { color: '#FFF', fontWeight: '800', fontSize: 12, letterSpacing: 1 },
  nicknameBtn: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  nicknameBtnText: { fontWeight: '600', fontSize: 14 },
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  sectionTitle: {
    color: '#777',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  description: { color: '#CCC', fontSize: 14, lineHeight: 22 },
  measures: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24 },
  measureItem: { alignItems: 'center' },
  measureValue: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  measureLabel: { color: '#555', fontSize: 12, marginTop: 4 },
  measureDivider: { width: 1, height: 40 },
  statRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 },
  statLabel: { color: '#888', fontSize: 12, width: 80, textTransform: 'capitalize' },
  statValue: { color: '#FFF', fontSize: 12, fontWeight: 'bold', width: 30, textAlign: 'right' },
  statTrack: { flex: 1, height: 6, backgroundColor: '#2A2A2A', borderRadius: 3, overflow: 'hidden' },
  statFill: { height: '100%', borderRadius: 3 },
  abilities: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  abilityBadge: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  abilityText: { fontSize: 13, fontWeight: '600', textTransform: 'capitalize' },
  errorText: { color: '#888', fontSize: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000AA',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  modalInput: {
    backgroundColor: '#0D0D0D',
    color: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    marginBottom: 16,
  },
  modalButtons: { flexDirection: 'row', gap: 12 },
  modalBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  cancelBtn: { backgroundColor: '#2A2A2A' },
  cancelBtnText: { color: '#AAA', fontWeight: '600', fontSize: 15 },
  saveBtnText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
});
