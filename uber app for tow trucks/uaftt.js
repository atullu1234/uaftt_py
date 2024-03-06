/*
 * Copyright (c) [Year] [Your Name or Organization]
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

// Your code goes here

// This is a simplified example to get you started. Actual app development would require much more code and complexity.

// Import necessary modules
// App.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, Alert, Text } from 'react-native';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    // Fetch location once when the component mounts
    getLocationAsync();
  }, []);

  const getLocationAsync = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location.coords);
  };

  const toggleAvailability = () => {
    setIsAvailable(!isAvailable);
    // Send availability status to backend
    // You can use fetch or any other method to send the data to the backend
    // Example: fetch('http://localhost:5000/set_availability', {
    //              method: 'POST',
    //              headers: {
    //                'Content-Type': 'application/json'
    //              },
    //              body: JSON.stringify({ available: !isAvailable })
    //          });
  };

  const requestTowTruck = async () => {
    try {
      const response = await fetch('http://localhost:5000/request_tow_truck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          latitude: location.latitude,
          longitude: location.longitude
        })
      });
      const data = await response.json();
      Alert.alert(data.message);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error requesting tow truck');
    }
  };

  return (
    <View style={styles.container}>
      <Button title={isAvailable ? "Go Offline" : "Go Online"} onPress={toggleAvailability} />
      <Text style={styles.status}>{isAvailable ? "You are online" : "You are offline"}</Text>
      <Button title="Request Tow Truck" onPress={requestTowTruck} disabled={!location || !isAvailable} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  status: {
    marginVertical: 10,
    fontWeight: 'bold'
  }
});

