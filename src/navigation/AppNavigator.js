// src/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, View } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import DetailScreen from '../screens/DetailScreen';
import FavoritesScreen from '../screens/FavoritesScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const PokeIcon = ({ name, focused }) => {
  const icons = { Home: '🔍', Favorites: '⭐' };
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: focused ? 22 : 18 }}>{icons[name]}</Text>
    </View>
  );
};

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0D0D0D', elevation: 0, shadowOpacity: 0 },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
        cardStyle: { backgroundColor: '#0D0D0D' },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Pokédex' }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={({ route }) => ({
          title: route.params?.name
            ? route.params.name.charAt(0).toUpperCase() + route.params.name.slice(1)
            : 'Detalhes',
        })}
      />
    </Stack.Navigator>
  );
}

function FavoritesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0D0D0D', elevation: 0, shadowOpacity: 0 },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
        cardStyle: { backgroundColor: '#0D0D0D' },
      }}
    >
      <Stack.Screen
        name="FavoritesList"
        component={FavoritesScreen}
        options={{ title: 'Meus Favoritos ⭐' }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={({ route }) => ({
          title: route.params?.name
            ? route.params.name.charAt(0).toUpperCase() + route.params.name.slice(1)
            : 'Detalhes',
        })}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#161616',
            borderTopColor: '#2A2A2A',
            borderTopWidth: 1,
            height: 60,
            paddingBottom: 8,
          },
          tabBarActiveTintColor: '#FF6B35',
          tabBarInactiveTintColor: '#555',
          tabBarIcon: ({ focused }) => <PokeIcon name={route.name} focused={focused} />,
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} options={{ title: 'Pokédex' }} />
        <Tab.Screen name="Favorites" component={FavoritesStack} options={{ title: 'Favoritos' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
