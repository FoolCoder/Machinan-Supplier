import React, {useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  StatusBar,
  View,
} from 'react-native';
import Colors from '../utils/Colors';
import {useDispatch, useSelector} from 'react-redux';
import Images from '../utils/Images';
import {CommonActions} from '@react-navigation/native';
import Api from '../utils/Api';

export default ({navigation}) => {
  const dispatch = useDispatch();
  const dashboardReducer = useSelector(state => state.dashboardReducer);
  const {userInfo, userType} = dashboardReducer;
  useEffect(() => {
    if (userInfo) {
      Api.getDashboardData(userInfo?.token, userType, navigation, dispatch);
      
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{name: 'AuthStack'}],
        }),
      );
    }
  }, []);
  return (
    <>
      <SafeAreaView style={styles.container}>
        <Image source={Images.logo} style={{width: 185, height: 150}} />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.White,
    alignItems: 'center',
  },
});
