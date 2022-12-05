import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {StyleSheet} from 'react-native';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useDispatch, useSelector} from 'react-redux';
import FSLoader from '../../components/FSLoader';
import {wp} from '../../components/Responsive';
import {setUserInfo} from '../../redux/reducer';
import Api from '../../utils/Api';
import Colors from '../../utils/Colors';
import Global from '../../utils/Global';
import Images from '../../utils/Images';

const Equipments = ({navigation}) => {
  const dispatch = useDispatch();
  const {navigate} = useNavigation();

  const dashboardReducer = useSelector(state => state.dashboardReducer);
  const {userInfo} = dashboardReducer;
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData();

    return () => {};
  }, []);

  const getData = () => {
    setLoading(true);
    Api.getSupplierEquipment(userInfo.token)
      .then(res => {
        if (res.message == 'Unauthenticated.') {
          AsyncStorage.removeItem('userInfo').then(() => {
            dispatch(setUserInfo(null));
            // dispatch({ type: 'setUserInfo', payload: { userInfo: null, userType: 'supplier' } })
          });
          return;
        }
        if (res.response == 101) {
          setEquipment(res.data);
        }
        setLoading(false);
      })
      .catch(e => Alert.alert('Error', e.message));
  };

  const renderEquipment = ({item, index}) => {
    // console.log(item?.product?.icon);
    return (
      <TouchableOpacity
        onPress={() => navigate('EquipmentDetail', {item: item})}
        style={styles.card}>
        {item?.product?.icon ? (
          <FastImage
            style={styles.image}
            source={{
              uri: item?.product?.icon,

              priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
        ) : (
          <Image
            style={styles.image}
            source={Images.logo}
            resizeMode="contain"
          />
        )}

        <View
          style={{
            width: wp(60),
            height: Global.SCREEN_WIDTH * 0.2,
          }}>
          <Text style={{fontWeight: 'bold', fontSize: 16}}>
            {item.product.name.en}
          </Text>
          <Text style={{}}>{item.info}</Text>
          {/* <Text style={{ fontWeight: 'bold' }}>Capacity: <Text style={{ fontWeight: '300' }}>{item.capacity}</Text></Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.White}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          margin: 10,
        }}>
        {/* <Image source={Images.Logo} resizeMode={'contain'} style={{ width: 100, height: 30 }}></Image> */}
        <Text style={{flex: 1, fontSize: 20, color: Colors.Black}}>
          Equipment
        </Text>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={
              userInfo?.user?.photo
                ? {uri: userInfo?.user?.photo}
                : Images.Placeholder
            }
            style={{
              width: 40,
              height: 40,
              borderWidth: 1,
              borderRadius: 40,
            }}></Image>
          <Text style={{marginLeft: 5, fontSize: 16}}>
            {userInfo?.user?.name}
          </Text>
        </View>
      </View>

      {loading ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <FSLoader />
        </View>
      ) : equipment?.length == 0 ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>No Equipment found</Text>
        </View>
      ) : (
        <FlatList
          onRefresh={() => getData()}
          refreshing={loading}
          data={equipment}
          renderItem={renderEquipment}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id.toString()}
          ListFooterComponent={() => {
            return <View style={{marginTop: 10}} />;
          }}
        />
      )}
    </SafeAreaView>
  );
};

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
    width: Global.SCREEN_WIDTH * 0.2,
    height: Global.SCREEN_WIDTH * 0.2,
    // borderRadius: Global.SCREEN_WIDTH * 0.2,
    margin: 8,
  },
});

export default Equipments;
