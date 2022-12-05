import React, {useEffect, useState} from 'react';
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
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Api from '../../utils/Api';
import Colors from '../../utils/Colors';
import Images from '../../utils/Images';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import MyBookings from './MyBookings';
import AvailableBookings from './AvailableBookings';
import Geolocation, {watchPosition} from 'react-native-geolocation-service';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {wp, hp} from '../../components/Responsive';
import {setUserInfo, setUserType} from '../../redux/reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FSLoader from '../../components/FSLoader';
import BookingsCard from '../../components/Supplier/BookingsCard';
import {Alert} from 'react-native';

const Bookings = ({navigation, route}) => {
  const dispatch = useDispatch();
  const dashboardReducer = useSelector(state => state.dashboardReducer);
  const {userInfo, userType} = dashboardReducer;
  const layout = Dimensions.get('window');
  const {width, height} = useWindowDimensions();
  const [location, setLocation] = useState(null);
  const [myBookings, setMyBookings] = useState([]);
  const [availableBookings, setAvailableBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [updateStatus, setupdatestatus] = useState(false);
  const [loadingSecond, setLoadingSecond] = useState(true);
  const [index, setIndex] = React.useState(1);
  const [routes] = React.useState(
    userInfo?.user?.bid_allowed == false
      ? [{key: 'first', title: 'My Bookings'}]
      : [
          {key: 'first', title: 'My Bookings'},
          {key: 'second', title: 'Available Bookings'},
        ],
  );
  useEffect(() => {
    requestLocationPermission('useEffect');
  }, [!myBookings && !availableBookings]);

  const getData = (position, type) => {
    if (type == 'useEffect') {
      setLoading(true);
      setLoadingSecond(true);
    }
    let enableArray = [];
    let disableArray = [];
    Api.getOperatorBookings(userInfo?.token, position)
      .then(res => {
        if (res.message == 'Unauthenticated.') {
          AsyncStorage.removeItem('userInfo').then(() => {
            dispatch(setUserInfo(null));
          });
          return;
        }
        if (res.response == 101) {
          setLoadingSecond(false);

          setAvailableBookings(res.data ? res.data.data : []);
        }
      })
      .catch(e => Alert.alert('Error', e.message));

    Api.getOperatorMyBookings(userInfo?.token, position)
      .then(res => {
        if (res.message == 'Unauthenticated.') {
          AsyncStorage.removeItem('userInfo').then(() => {
            dispatch(setUserInfo(null));
            dispatch(setUserType(null));
          });
          return;
        }
        if (res.response == 101 && res.data != null) {
          setLoading(false);
          // setRefresh(false);
          setupdatestatus(false);

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
        }
      })
      .catch(e => {
        setupdatestatus(false);
        Alert.alert('Error', e.message);
        console.log(e);
      });
  };

  const getUserLocation = type => {
    Geolocation.getCurrentPosition(
      position => {
        getData(position, type);
        setLocation(position);
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
            // buttonNeutral: 'Ask Me Later',
            // buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getUserLocation(type);
        } else {
          Alert.alert('Required Permission', 'Permission Not Granted');
          console.log('Permission Not Granted');
          getData();
        }
      } else {
        const granted = await Geolocation.requestAuthorization('whenInUse');
        if (granted === 'granted') {
          getUserLocation(type);
        } else {
          Alert.alert('Required Permission', 'Permission Not Granted');
          console.log('Permission Not Granted');
          getData();
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefresh(true);
    requestLocationPermission('Refresh').then(() => setRefresh(false));
  }, []);
  const statusChange = props => {
    setupdatestatus(true);
    requestLocationPermission('statusChange');
  };
  const FirstRoute = () =>
    loading ? (
      <View style={styles.indicator}>
        <FSLoader />
      </View>
    ) : (
      <>
        {myBookings.length == 0 ? (
          <View style={styles.noavailabel}>
            <Text>No available bookings</Text>
          </View>
        ) : (
          <FlatList
            onRefresh={onRefresh}
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
                  operator={true}
                  updateStatus={updateStatus}
                  statusChange={statusChange}
                  setupdatestatus={setupdatestatus}
                />
                <View style={styles.seperator} />
              </>
            )}
          />
        )}
      </>
    );

  const SecondRoute = () =>
    loadingSecond ? (
      <View style={styles.indicator}>
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
        return <FirstRoute />;
        break;
      case 'second':
        return <SecondRoute />;
        break;
      default:
        break;
    }
  };

  const renderItem =
    ({navigationState, position}) =>
    ({route, index}) => {
      const inputRange = navigationState.routes.map((_, i) => i);

      let activeOpacity;
      let inactiveOpacity;

      if (inputRange.length == 1) {
        (activeOpacity = 1), (inactiveOpacity = 0);
      } else {
        activeOpacity = position.interpolate({
          inputRange,
          outputRange: inputRange.map(i => (i === index ? 1 : 0)),
        });
        inactiveOpacity = position.interpolate({
          inputRange,
          outputRange: inputRange?.map(i => (i === index ? 0 : 1)),
        });
      }

      return (
        <View style={styles.tab}>
          <Animated.View
            style={[
              styles.item,
              {opacity: inactiveOpacity ? inactiveOpacity : 0},
            ]}>
            <Text style={[styles.label, styles.inactive]}>{route.title}</Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.item,
              styles.activeItem,
              {opacity: activeOpacity ? activeOpacity : 0},
            ]}>
            <Text style={[styles.label, styles.active]}>{route.title}</Text>
          </Animated.View>
        </View>
      );
    };

  const renderTabBar = props => (
    <View
      style={{
        ...styles.tabbar,
        width: userInfo?.user?.bid_allowed == false ? wp(46) : wp(91),
      }}>
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
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('DashboardStack')}
          style={styles.back}>
          <Ionicons name="chevron-back" size={24} color={'#23262F'} />
        </TouchableOpacity>
        <Text style={styles.headtxt}>Bookings</Text>

        <Image
          source={
            userInfo?.user?.photo
              ? {uri: userInfo?.user?.photo}
              : Images.Placeholder
          }
          style={styles.img}
        />
      </View>

      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width, height: 0}}
        style={{marginTop: 15}}
        renderTabBar={renderTabBar}
        lazy={true}
        removeClippedSubviews={Platform.OS == 'android' ? true : false}
        renderLazyPlaceholder={() => <View style={{flex: 1}}></View>}
      />
      {updateStatus && <FSLoader />}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safearea: {flex: 1, backgroundColor: Colors.Background},
  seperator: {
    height: 0.5,
    backgroundColor: '#E6E8F0',
    marginTop: 8,
    width: wp(94),
    alignSelf: 'center',
    zIndex: 1,
  },
  noavailabel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headtxt: {fontSize: 20, color: Colors.Black},
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
    fontSize: hp(1.6),
    color: '#23262F',
    textAlign: 'center',
    fontWeight: '700',
  },
  tabstyle: {
    borderRadius: 25,
    height: hp(6.5),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
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
