import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Colors from '../utils/Colors';
import Constants from '../utils/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import Images from '../utils/Images';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Api from '../utils/Api';
import Global from '../utils/Global';
import FSLoader from '../components/FSLoader';
import { Alert } from 'react-native';

const Notifications = ({navigation}) => {
  const dashboardReducer = useSelector(state => state.dashboardReducer);
  const {userInfo} = dashboardReducer;
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Api.getNotifications(userInfo.token)
      .then(res => {
        setLoading(false);
        if (res.response == 101) {
          setNotifications(res.data.notifications.data);
        }
      })
      .catch(e => Alert.alert('Error', e.message));

    Api.readNotifications(userInfo.token)
      .then(res => {})
      .catch(e => Alert.alert('Error', e.message));
    return () => {};
  }, []);

  const renderItem = ({item, index}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: Colors.White,
          padding: 10,
          borderRadius: 10,
          elevation: 5,
        }}>
        <Image
          source={Images.Placeholder}
          style={{
            width: Global.SCREEN_WIDTH * 0.2,
            height: Global.SCREEN_WIDTH * 0.2,
            borderRadius: Global.SCREEN_WIDTH * 0.2,
          }}></Image>
        <View style={{marginLeft: 10}}>
          <Text style={{fontWeight: 'bold', fontSize: 16}}>{item.title}</Text>
          <Text>{item.message}</Text>
        </View>
      </View>
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

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={Colors.Black} />
        </TouchableOpacity>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={Images.Placeholder}
            style={{
              width: 40,
              height: 40,
              borderWidth: 1,
              borderRadius: 40,
            }}></Image>
          <Text
            style={{
              fontFamily: Constants.FontFranklinGothic,
              marginLeft: 5,
              fontSize: 16,
            }}>
            {userInfo?.user.name}
          </Text>
        </View>
      </View>

      {loading ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <FSLoader />
        </View>
      ) : notifications.length == 0 ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text
            style={{fontFamily: Constants.FontSTCRegular, marginBottom: 10}}>
            No Notifications Yet
          </Text>
          <Ionicons
            name="notifications-off-outline"
            size={100}
            color={Colors.Primary}></Ionicons>
        </View>
      ) : (
        <FlatList
          style={{margin: 10}}
          data={notifications}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
        />
      )}
    </SafeAreaView>
  );
};

export default Notifications;
