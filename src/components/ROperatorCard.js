import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import Images from '../utils/Images';
import Colors from '../utils/Colors';
import Global from '../utils/Global';
import React from 'react';
import {wp} from './Responsive';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { memo } from 'react';

const ROperatorCard = ({item, index, type, navigation}) => {
  const {navigate} = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigate('OperatorRiggerDetail', {id: item?.id, type: type})}
      style={styles.card}>
      {item.photo ? (
        <FastImage
          style={styles.image}
          source={{
            uri: item?.photo,

            priority: FastImage.priority.high,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      ) : (
        <Image style={styles.image} source={Images.logo} resizeMode="contain" />
      )}
      <View
        style={{
          width: wp(60),
          height: Global.SCREEN_WIDTH * 0.23,
        }}>
        <Text style={{fontWeight: 'bold', fontSize: 16}}>{item?.name}</Text>
        <Text style={{}}>{item.phone}</Text>
        {item?.equipment && (
          <Text style={{fontWeight: 'bold'}}>
            Equipment:{' '}
            <Text style={{fontWeight: '300'}}>{item?.equipment?.info}</Text>
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default memo(ROperatorCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.White,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    marginTop: 10,
    marginHorizontal: 10,
  },
  image: {
    width: Global.SCREEN_WIDTH * 0.25,
    height: Global.SCREEN_WIDTH * 0.23,
    borderWidth: 1,
    borderColor: Colors.LightGray,
    borderRadius: 10,
    margin: 8,
  },
});
