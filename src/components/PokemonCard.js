// src/components/PokemonCard.js
import React, { useRef } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
} from 'react-native';
import { getTypeColor } from '../services/pokeApi';

const formatId = (id) => `#${String(id).padStart(3, '0')}`;

export default function PokemonCard({ pokemon, onPress }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.93,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const primaryType = pokemon.types?.[0]?.type?.name || 'normal';
  const accentColor = getTypeColor(primaryType);
  const sprite =
    pokemon.sprites?.other?.['official-artwork']?.front_default ||
    pokemon.sprites?.front_default;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.card, { borderColor: accentColor + '55' }]}
      >
        {/* Color accent strip */}
        <View style={[styles.colorStrip, { backgroundColor: accentColor }]} />

        <View style={styles.content}>
          <View style={styles.info}>
            <Text style={styles.id}>{formatId(pokemon.id)}</Text>
            <Text style={styles.name}>
              {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
            </Text>
            <View style={styles.types}>
              {pokemon.types?.map((t) => (
                <View
                  key={t.type.name}
                  style={[styles.typeBadge, { backgroundColor: getTypeColor(t.type.name) + '33', borderColor: getTypeColor(t.type.name) }]}
                >
                  <Text style={[styles.typeText, { color: getTypeColor(t.type.name) }]}>
                    {t.type.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {sprite ? (
            <Image source={{ uri: sprite }} style={styles.sprite} />
          ) : (
            <View style={[styles.sprite, styles.spritePlaceholder]}>
              <Text style={{ fontSize: 32 }}>❓</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  colorStrip: {
    width: 5,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  info: {
    flex: 1,
  },
  id: {
    color: '#555',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  types: {
    flexDirection: 'row',
    gap: 6,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sprite: {
    width: 80,
    height: 80,
  },
  spritePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#222',
    borderRadius: 8,
  },
});
