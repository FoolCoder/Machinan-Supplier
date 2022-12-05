import React, {useEffect, useMemo, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  useWindowDimensions,
  PermissionsAndroid,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Api from '../../utils/Api';
import Colors from '../../utils/Colors';
import Global from '../../utils/Global';
import Images from '../../utils/Images';
import {
  TabView,
  SceneMap,
  TabBar,
  NavigationState,
} from 'react-native-tab-view';
import MyBookings from './MyBookings';
import AvailableBookings from './AvailableBookings';
import {useFocusEffect} from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import BookingFilter from '../../components/Supplier/BookingFilter';
import {setUserInfo} from '../../redux/reducer';
import {Platform} from 'react-native';
import BookingsCard from '../../components/Supplier/BookingsCard';
import FSLoader from '../../components/FSLoader';

const Bookings = ({navigation}) => {
  const dispatch = useDispatch();
  const layout = useWindowDimensions();
  const {width, height} = useWindowDimensions();

  const [location, setLocation] = useState(null);
  const [visible, setVisible] = useState(false);

  const dashboardReducer = useSelector(state => state.dashboardReducer);
  const {userInfo} = dashboardReducer;
  const [myBookings, setMyBookings] = useState([]);
  const [availableBookings, setAvailableBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [loadingSecond, setLoadingSecond] = useState(true);
  const [updateStatus, setupdatestatus] = useState(false);
  const [index, setIndex] = React.useState(0);
  const [page, setpage] = useState('first');

  const [routes] = React.useState([
    {key: 'first', title: 'My Booking'},
    {key: 'second', title: 'Available Booking'},
  ]);

  const [Bookings, setBookings] = useState({
    open: [],
    disputed: [],
    booked: [],
  });

  useEffect(() => {
    requestLocationPermission('useEffect');
  }, []);

  const refreshData = props => {
    setRefresh(true);
    requestLocationPermission('Refresh');
  };
  const statusChange = props => {
    setupdatestatus(true);
    requestLocationPermission('statusChange');
  };

  const getData = (position, type) => {
    if (type == 'useEffect') {
      console.log('getData', type);

      setLoading(true);
      setLoadingSecond(true);
    }

    Api.getSupplierBookings(userInfo.token, position)
      .then(res => {
        setLoadingSecond(false);
        if (res.message == 'Unauthenticated.') {
          AsyncStorage.removeItem('userInfo').then(() => {
            dispatch(setUserInfo(null));
            // dispatch({
            //   type: 'setUserInfo',
            //   payload: {userInfo: null, userType: 'Supplier'},
            // });
          });
          return;
        }
        if (res.response == 101) {
          setAvailableBookings(res.data?.data);
        }
      })
      .catch(e => {
        setLoadingSecond(false);
        setRefresh(false);
        setupdatestatus(false);
        Alert.alert('Error', e.message);
      });

    Api.getSupplierMyBookings(userInfo.token, position)
      .then(res => {
        if (res.message == 'Unauthenticated.') {
          dispatch(setUserInfo(null));
          // dispatch({
          //   type: 'setUserInfo',
          //   payload: {userInfo: null, userType: 'Supplier'},
          // });

          return;
        }
        if (res.response == 101 && res.data != null) {
          let enableArray = [];
          let disableArray = [];

          res.data.data?.map((item, index) => {
            if (
              item?.status == 'Expired' ||
              item?.bid?.status == 'Expired' ||
              item?.bid?.status == 'Rejected'
            ) {
              disableArray.push(item);
            } else {
              enableArray.push(item);
            }
          });
          setMyBookings([...enableArray, ...disableArray]);
          setLoading(false);
          setRefresh(false);
          setupdatestatus(false);
        }
      })
      .catch(e => {
        setRefresh(false);
        setupdatestatus(false);
        setLoading(false);
        Alert.alert('Error', e.message);
      });
  };

  const getUserLocation = type => {
    Geolocation.getCurrentPosition(
      position => {
        getData(position, type);
        setLocation(position);
        setRefresh(!refresh);
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const requestLocationPermission = async type => {
    try {
      if (Platform.OS == 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Machinan needs Location Permission',
            message: 'Machinan needs access to your location.' + ' ',
            //buttonNeutral: 'Ask Me Later',
            //buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Permission Granted');
          getUserLocation(type);
        } else {
          console.log('Permission Not Granted');
          getData();
        }
      } else {
        const granted = await Geolocation.requestAuthorization('whenInUse');
        if (granted === 'granted') {
          console.log('Permission Granted');
          getUserLocation(type);
        } else {
          console.log('Permission Not Granted');
          getData();
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };
  // const cachedValue = useMemo(() => multiply(x, y), [x, y]);
  const FirstRoute = () =>
    loading ? (
      <View style={styles.route}>
        <FSLoader />
      </View>
    ) : myBookings.length == 0 ? (
      <View style={styles.nobooking}>
        <Text>No available bookings</Text>
      </View>
    ) : (
      <FlatList
        onRefresh={refreshData}
        refreshing={refresh}
        style={{marginTop: 10, backgroundColor: Colors.White}}
        data={myBookings}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        removeClippedSubviews={true}
        windowSize={10}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{height: 10}}></View>}
        renderItem={({item, index}) => (
          <>
            <BookingsCard
              item={item}
              index={index}
              bookings={myBookings}
              available={false}
              location={location}
              operator={false}
              updateStatus={updateStatus}
              statusChange={statusChange}
              setupdatestatus={setupdatestatus}
            />
            <View style={styles.seperator} />
          </>
        )}
      />
    );

  const SecondRoute = () =>
    loadingSecond ? (
      <View style={styles.route}>
        <FSLoader />
      </View>
    ) : (
      <AvailableBookings
        bookings={availableBookings}
        location={location}
        getData={requestLocationPermission}
      />
    );

  const renderScene = ({route}) => {
    switch (route.key) {
      case 'first':
        return React.memo(<FirstRoute />);
        break;
      case 'second':
        return React.memo(<SecondRoute />);
        break;
      default:
        break;
    }
  };

  const renderItem =
    ({navigationState, position}) =>
    ({route, index}) => {
      const inputRange = navigationState.routes.map((_, i) => i);

      const activeOpacity = position.interpolate({
        inputRange,
        outputRange: inputRange.map(i => (i === index ? 1 : 0)),
      });
      const inactiveOpacity = position.interpolate({
        inputRange,
        outputRange: inputRange.map(i => (i === index ? 0 : 1)),
      });

      return (
        <View style={styles.tab}>
          <Animated.View style={[styles.item, {opacity: inactiveOpacity}]}>
            <Text style={[styles.label, styles.inactive]}>{route.title}</Text>
          </Animated.View>
          <Animated.View
            style={[styles.item, styles.activeItem, {opacity: activeOpacity}]}>
            <Text style={[styles.label, styles.active]}>{route.title}</Text>
          </Animated.View>
        </View>
      );
    };

  const renderTabBar = props => (
    <View style={styles.tabbar}>
      {props.navigationState.routes.map((route, index) => {
        return (
          <TouchableWithoutFeedback
            key={route.key}
            onPress={() => props.jumpTo(route.key)}>
            {renderItem(props)({route, index})}
          </TouchableWithoutFeedback>
        );
      })}
    </View>
  );

  return (
    <SafeAreaView style={styles.safearea}>
      {visible ? (
        <BookingFilter visible={visible} setVisible={setVisible} />
      ) : null}
      <View style={styles.mainbox}>
        <TouchableOpacity
          onPress={() => navigation.navigate('DashboardStack')}
          style={styles.backbtn}>
          <FontAwesome
            name={'chevron-left'}
            color="#23262F"
            size={RFValue(14)}
          />
        </TouchableOpacity>

        <View>
          <Text style={styles.headtxt}>Booking</Text>
        </View>

        <View>
          <Image
            source={
              userInfo?.user?.photo
                ? {uri: userInfo?.user?.photo}
                : Images.Placeholder
            }
            style={styles.userimg}
          />
        </View>
      </View>
      <TabView
        navigationState={{index, routes}}
        renderScene={SceneMap({
          first: FirstRoute,
          second: SecondRoute,
        })}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
        style={{marginVertical: 15}}
        renderTabBar={renderTabBar}
      />
      {updateStatus && <FSLoader />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  nobooking: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  seperator: {
    height: 0.5,
    backgroundColor: '#E6E8F0',
    marginTop: 8,
    width: wp(94),
    alignSelf: 'center',
    zIndex: 1,
  },
  tabbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    width: wp(91),
    alignSelf: 'center',
    height: hp(6.8),
    borderRadius: hp(6.8) / 2,
    borderColor: '#E6E8EC',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(44),
    height: hp(6.1),
    borderRadius: hp(6.1) / 2,
  },
  activeItem: {
    marginLeft: 2,
    width: wp(44),
    height: hp(6.1),
    borderRadius: hp(6.1) / 2,
    backgroundColor: 'black',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  active: {
    color: '#fff',
  },
  inactive: {
    color: 'black',
  },
  icon: {
    height: 26,
    width: 26,
  },
  label: {
    fontSize: hp(2),
    color: '#23262F',
    textAlign: 'center',
    fontWeight: '700',
  },
  safearea: {
    flex: 1,
    backgroundColor: Colors.Background,
  },
  route: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headtxt: {fontSize: 20, color: Colors.Black},
  tabstyle: {
    borderRadius: 25,
    height: hp(6.5),
    backgroundColor: '#fff',
  },
  mainbox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 15,
    marginBottom: 8,
  },
  backbtn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(3.9),
    width: hp(3.9),
    borderRadius: hp(3.9) / 2,
    backgroundColor: '#E6E8EC',
  },
  userimg: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 40,
  },
  tabbarcontainer: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 1)',
    borderRadius: 8,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    marginTop: 15,
    // borderWidth:1,
    width: wp(92),
    alignSelf: 'center',
  },
  back: {
    // marginLeft: 10,
    backgroundColor: '#E6E8EC',
    width: 25,
    height: 25,
    borderRadius: 15,
    elevation: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: '#23262F',
    textAlign: 'center',
    fontWeight: '700',
  },
  img: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 40,
  },
  tabbarView: {
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    width: wp(92),
    alignSelf: 'center',
    borderWidth: 0.5,
    borderRadius: 25,
    borderColor: '#E6E8EC',
  },
  tabbarItem: {
    width: wp(45),
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(6),
    borderRadius: 25,
    position: 'absolute',
    alignSelf: 'center',
    top: hp(-3),
  },
});

export default Bookings;
