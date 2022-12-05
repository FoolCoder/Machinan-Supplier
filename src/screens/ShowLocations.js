import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  useWindowDimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../utils/Colors';
import Images from '../utils/Images';
import {wp, hp} from '../components/Responsive';

const ShowLocations = ({navigation, route}) => {
  const {width, height} = useWindowDimensions();
  const {booking, locationA, locationB, currentLoc} = route.params;
  const region = {
    latitude: currentLoc.latitude,
    longitude: currentLoc.longitude,
    latitudeDelta: 0.0622,
    longitudeDelta: 0.0121,
  };

  return (
    <SafeAreaView
      style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <MapView
        style={{width: width, height: height}}
        provider={'google'}
        initialRegion={region}>
        <Marker
          coordinate={locationA}
          title={'Location A'}
          image={Images.locA}
        />

        <Marker coordinate={currentLoc} title={'currentLoc'}>
          <View style={{alignItems: 'center'}}>
            <Text style={{fontWeight: 'bold'}}>{'currentLocation'}</Text>
            <Ionicons name="location" color={Colors.Primary} size={20} />
          </View>
        </Marker>
        <MapViewDirections
          origin={currentLoc}
          destination={locationA}
          apikey={'AIzaSyDwpDMOezsYP1l-pqetH8Gc3aMMIc0iuB8'}
          strokeWidth={5}
          strokeColor={Colors.Secondary}
        />
        {locationB && (
          <>
            <Marker
              coordinate={locationB}
              title={'Location B'}
              image={Images.locB}
            />
            <Polyline
              coordinates={[locationA, locationB]}
              strokeColor="#F15223" // fallback for when `strokeColors` is not supported by the map-provider
              strokeWidth={4}
              lineDashPattern={[1, 1, 1, 1, 1]}
            />
            {/* <MapViewDirections
              origin={locationA}
              destination={locationB}
              apikey={'AIzaSyDwpDMOezsYP1l-pqetH8Gc3aMMIc0iuB8'}
              strokeWidth={5}
              strokeColor={Colors.Secondary}
            /> */}
          </>
        )}
      </MapView>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: 'absolute',
          left: 20,
          top: 20,
          width: 40,
          height: 40,
          borderRadius: 40,
          backgroundColor: Colors.White,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Ionicons name="chevron-back" size={20} />
      </TouchableOpacity>
      <View
        style={{
          position: 'absolute',
          backgroundColor: Colors.Black,
          borderRadius: 10,
          padding: 10,
          width: 'auto',
          height: hp(5),
          top: hp(2.5),
          right: hp(2),
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: Colors.White,
            fontWeight: '700',
            fontSize: 14,
          }}>
          {` Distance: ${Math.round(dis / 100) / 10} KM`}
        </Text>
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          backgroundColor: Colors.White,
          borderRadius: 10,
          padding: 10,
        }}>
        <Text style={{fontWeight: 'bold'}}>
          Location A:{' '}
          <Text style={{fontWeight: '300'}}>{booking.location_a_address}</Text>
        </Text>
        {booking.location_b_address && (
          <Text style={{fontWeight: 'bold', marginTop: 10}}>
            Location B:{' '}
            <Text style={{fontWeight: '300'}}>
              {booking.location_b_address}
            </Text>
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ShowLocations;
