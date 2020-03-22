import React, { Component } from 'react';
import {
  View,
  Text,
  Platform,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  PixelRatio
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import database, { firebase } from '@react-native-firebase/database';

const { width, height } = Dimensions.get("window")

export default class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: -3.736655,
        longitude: -38.526502,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      },
      shelfs: []
    };
  }

  componentDidMount() {
    //this.getGPSPosition();
    this.getDatabaseInfo();
  }

  getGPSPosition = () => {
    Platform.OS === 'android'
      ? request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(result => {
        check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
          .then(result => {
            console.log('result', result)
            switch (result) {
              case RESULTS.UNAVAILABLE:
                console.log(
                  'This feature is not available (on this device / in this context)',
                );
                break;
              case RESULTS.DENIED:
                console.log(
                  'The permission has not been requested / is denied but requestable',
                );
                break;
              case RESULTS.GRANTED:
                Geolocation.getCurrentPosition(info => {
                  this.setState({
                    region: {
                      latitude: info.coords.latitude,
                      longitude: info.coords.longitude,
                      latitudeDelta: 0,
                      longitudeDelta: 0,
                    },
                  });
                });
                break;
              case RESULTS.BLOCKED:
                console.log(
                  'The permission is denied and not requestable anymore',
                );
                break;
            }
          })
          .catch(error => {
            // …
          });
      })
      : request(PERMISSIONS.IOS.LOCATION_ALWAYS).then(result => {
        check(PERMISSIONS.IOS.LOCATION_ALWAYS)
          .then(result => {
            switch (result) {
              case RESULTS.UNAVAILABLE:
                console.log(
                  'This feature is not available (on this device / in this context)',
                );
                break;
              case RESULTS.DENIED:
                console.log(
                  'The permission has not been requested / is denied but requestable',
                );
                break;
              case RESULTS.GRANTED:
                console.log('The permission is granted');
                Geolocation.getCurrentPosition(info => {
                  this.setState({
                    region: {
                      latitude: info.coords.latitude,
                      longitude: info.coords.longitude,
                      latitudeDelta: 0,
                      longitudeDelta: 0,
                    },
                  });
                });
                break;
              case RESULTS.BLOCKED:
                console.log(
                  'The permission is denied and not requestable anymore',
                );
                break;
            }
          })
          .catch(error => {
            // …
          });
      });
  }

  getDatabaseInfo = () => {
    database()
      .ref('shelf')
      .once('value')
      .then(snapshot => {
        snapshot.forEach(shelf => {
          console.log("shelf", shelf.val())
          this.setState({ shelfs: [...this.state.shelfs, shelf.val()] })
        })
        this.fitShelfsOnMap();
      })
  }

  fitShelfsOnMap = () => {
    var locationsArray = []
    this.state.shelfs.forEach(shelf => {
      locationsArray.push({latitude: shelf.coords.lat, longitude: shelf.coords.lng})
    })
    this.map.fitToCoordinates(locationsArray, {
      edgePadding: {
        top: (Platform.OS === 'android') ? PixelRatio.getPixelSizeForLayoutSize(height * 0.25) : height * 0.25,
        right: (Platform.OS === 'android') ? PixelRatio.getPixelSizeForLayoutSize(80) : 80,
        left: (Platform.OS === 'android') ? PixelRatio.getPixelSizeForLayoutSize(80) : 80,
        bottom: (Platform.OS === 'android') ? PixelRatio.getPixelSizeForLayoutSize(360) : 400
      },
      animated: true,
    });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={{ flex: 1 }}
          region={this.state.region}
          ref={map => {
            this.map = map;
          }}
        >
          {this.state.shelfs.map(shelf => {
            console.log('shelfff', shelf)
            console.log('products', shelf.products)
            return (
              <Marker
                coordinate={{
                  latitude: shelf.coords.lat,
                  longitude: shelf.coords.lng,
                  latitudeDelta: 0.015,
                  longitudeDelta: 0.0121,
                }}
              >
                <Image
                  source={require('./assets/png/marker.png')}
                  style={{ width: 32, height: 32 }}
                />
                <Callout tooltip style={styles.callout}>
                  <View style={styles.calloutBallon}>
                    <Text>{shelf.name}</Text>
                    <Text style={{fontWeight: 'bold', marginTop: 8}}>Telefone</Text>
                    <Text>{shelf.tel}</Text>
                    <Text style={{fontWeight: 'bold'}}>Endereço</Text>
                    <Text>{shelf.address}</Text>
                    <Text style={{fontWeight: 'bold'}}>Produtos</Text>
                    <Text>{shelf.products}</Text>
                    <Text style={{fontWeight: 'bold'}}>Última atualização:</Text>
                    <Text>{shelf.lastUpdated}</Text>
                  </View>

                </Callout>
              </Marker>
            )
          })}

        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  calloutBallon: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgb(221,221,221)',
  },
  callout: {
    width: width/2,
  },
  
})
