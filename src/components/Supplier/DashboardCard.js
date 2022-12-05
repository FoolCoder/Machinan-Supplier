import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Api from '../../utils/Api';
import Colors from '../../utils/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Images from '../../utils/Images';
import Global from '../../utils/Global';
import {useIsFocused} from '@react-navigation/native';
import {RFValue, RFPercentage} from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {BarChart} from 'react-native-chart-kit';

const DashboardCard = ({data, name, Timage, alert, ImgBack}) => {
  return (
    <TouchableOpacity style={styles.cardContainer}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: hp(6.8),
            height: hp(6.8),
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: ImgBack,
            borderRadius: hp(6.8) / 2,
          }}>
          <Image
            source={Timage}
            resizeMode="contain"
            style={{
              width: hp(3.8),
              height: hp(3.8),
            }}
          />
          {alert >= 0 ? <Text style={styles.alertText}>{alert}</Text> : null}
        </View>

        <View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <FontAwesome
              name={'arrow-up'}
              //arrow-down
              color="#0049C6"
              size={14}
            />
            <Text
              style={{
                fontSize: 16,
                marginLeft: 3,
                color: '#0049C6',
              }}>
              18%
            </Text>
          </View>
          <Text style={{color: '#8F95B2', fontSize: RFPercentage(1.5)}}>
            This Week
          </Text>
        </View>
      </View>

      <Text
        style={{
          marginTop: 10,
          color: '#8F95B2',
          fontWeight: '700',
          fontSize: wp(3.5),
        }}>
        {name}
      </Text>
      <Text
        style={{
          fontSize: RFValue(22),
          alignSelf: 'flex-start',
          color: '#081735',
          fontWeight: '700',
        }}>
        {data}
      </Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  alertText: {
    position: 'absolute',
    right: -3,
    top: 1,
    color: '#fff',
    backgroundColor: '#000',
    width: hp(2.28),
    height: hp(2.28),
    borderRadius: hp(2.28) / 2,
    textAlign: 'center',
  },
  cardContainer: {
    padding: 18,
    justifyContent: 'space-between',
    width: wp(100) / 2 - 20,
    height: hp(100) * 0.24,
    backgroundColor: Colors.White,
    elevation: 3,
    borderRadius: 25,
  },
});
export default DashboardCard;
