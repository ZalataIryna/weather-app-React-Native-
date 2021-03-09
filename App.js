/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  PermissionsAndroid,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Geolocation from 'react-native-geolocation-service';

const API_KEY = '4fcca60f8ff0a3b32c67d208763938d4';

class App extends Component {
  state = {
    temperature: 0,
    humidity: 0,
    description: '',
    longitude: 0,
    latitude: 0,
    hasLocation: false,
  };

  componentDidMount() {
    this.getLocation();
    setTimeout(async () => {
      await this.getWeather();
    }, 5000);
  }

  async getLocation() {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (PermissionsAndroid.RESULTS.GRANTED === 'granted') {
      Geolocation.getCurrentPosition(
        ({coords: {longitude, latitude}}) => {
          console.log('From location function', longitude, latitude);
          this.setState({
            longitude: longitude,
            latitude: latitude,
          });
        },
        (error) => {
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }
  }

  async getWeather() {
    try {
      console.log('data from weather function', this.state.latitude);
      const result = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${this.state.latitude}&lon=${this.state.longitude}&appid=${API_KEY}`,
      );
      // console.log('api', await result.json());
      const {weather, main} = await result.json();
      console.log('From weather function', weather, main);
      const tempCelsius = Math.floor(main.temp - 273.15);
      this.setState({
        temperature: tempCelsius,
        humidity: main.humidity,
        description: weather[0].description,
        hasLocation: true,
      });
    } catch (err) {
      console.log('Api call error');
    }
  }

  render() {
    const hasLocation = this.state.hasLocation;
    return (
      <>
        {hasLocation ? (
          <>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>
                Today's temperature is {this.state.temperature} Celcius and
                humidity is {this.state.humidity}%
              </Text>
              <Text style={styles.sectionTitle}>
                It's {this.state.description} outside
              </Text>
            </View>
          </>
        ) : (
          <Text style={styles.sectionTitle}>
            Weather is not defined. Try later
          </Text>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
});

export default App;
