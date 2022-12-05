import React from 'react';
import {Image, View} from 'react-native';
import Colors from '../utils/Colors';
import {wp, hp} from './Responsive';
import {ActivityIndicator} from 'react-native';
import FastImage from 'react-native-fast-image';
import Images from '../utils/Images';
import Wheel from '../assets/wheel.gif';
function FSLoader() {
  return (
    <View
      style={{
        backfaceVisibility: 'visible',
        alignSelf: 'center',
        width: wp(100),
        height: hp(100),
        position: 'absolute',
        backgroundColor: 'rgba(255,255,255,0.5)',
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image
        style={{
          height: hp(70),
          width: wp(80),
        }}
        source={Images.wheel}
      />
    </View>
  );
}

export default FSLoader;
