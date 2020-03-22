import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from './Home'
import GPSRequest from './GPSRequest'

const Stack = createStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator
            headerMode="none"
        >
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="GPSRequest" component={GPSRequest} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}