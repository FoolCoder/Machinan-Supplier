import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Colors from '../utils/Colors';
import Images from '../utils/Images';
import Loader from './Loader';
import {hp, wp} from './Responsive';

function Card(props) {
  const {id, value, img, name} = props.item;
  const checkColor = index => {
    if (index == 0) {
      return '#E7FAFF';
    } else if (index == 1) {
      return '#6C5DD310';
    } else if (index == 2) {
      return '#FFF3DC';
    } else if (index == 3) {
      return '#FFEBF6';
    }
  };

  return (
    <View
      key={props.index}
      style={{
        ...styles.flist,
        left: props.index % 2 != 0 ? 5 : 0,
      }}>
      <View style={styles.fupperView}>
        <View
          style={{
            ...styles.img,
            backgroundColor: checkColor(props.index),
          }}>
          <Image
          resizeMode='contain'
            style={{
              width: wp(8),
              height: hp(4),
            }}
            source={img}
          />
          {name == 'Message Alerts' ? (
            <View style={styles.alertmini}>
              <Text
                numberOfLines={1}
                lineBreakMode="tail"
                style={styles.alerminitext}>
                {value}
              </Text>
            </View>
          ) : null}
        </View>
        <View
          style={{
            // borderWidth:1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              style={{
                width: wp(3),
                height: hp(2.4),
                top: 1,
              }}
              source={Images.arrowup}
            />
            <Text
              style={{
                fontSize: 14,
                fontWeight: '700',
                color: '#0049C6',
                marginLeft: 5,
              }}>
              28%
            </Text>
          </View>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '400',
              color: '#8F95B2',
            }}>
            This Week
          </Text>
        </View>
      </View>
      <View
        style={{
          width: wp(36),
        }}>
        <Text
          numberOfLines={1}
          style={{
            fontSize: 14,
            fontWeight: '700',
            color: '#8F95B2',
          }}>
          {name}
        </Text>

        <Text
          style={{
            fontSize: hp(2.5),
            fontWeight: '700',
            color: '#081735',
            marginTop: 5,
          }}>
          {value < 10 ? `0${value}` : `${value}`}
        </Text>
      </View>
    </View>
  );
}

export default Card;
const styles = StyleSheet.create({
  name: {
    color: '#000',
    fontSize: 24,
    marginTop: 10,
    fontWeight: '400',
    width: wp(60),
  },

  flist: {
    alignItems: 'center',
    padding: 10,
    justifyContent: 'space-between',
    width: wp(43.5),
    height: hp(22),
    backgroundColor: Colors.White,
    elevation: 5,
    borderRadius: 20,
    marginVertical: 8,
    marginHorizontal: 5,
  },
  fupperView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: wp(36),
    alignSelf: 'center',
  },
  img: {
    width: wp(16),
    height: hp(7.5),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: hp(7.5)/2,
    // alignSelf:'flex-start'
  },
  alertmini: {
    position: 'absolute',
    right: -4,
    top: -1,
    backgroundColor: '#000',
    width: hp(2.28),
    height: hp(2.28),
    borderRadius: hp(2.28) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alerminitext: {
    fontSize: hp(1),
    color: '#fff',
  },
});
