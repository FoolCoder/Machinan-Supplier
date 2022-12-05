import {useNavigation} from '@react-navigation/native';
import moment, {duration} from 'moment';
import React, {memo, useCallback, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  useWindowDimensions,
  Animated,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  LayoutAnimation,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import {ListItem} from '@rneui/themed';
import Button from '../../components/Button';
import Api from '../../utils/Api';
import Colors from '../../utils/Colors';
import Global from '../../utils/Global';
import Images from '../../utils/Images';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {Alert} from 'react-native';
import AlertModal from '../AlertModal';
import FSLoader from '../FSLoader';
import Loader from '../Loader';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';

const BookingsCard = props => {
  const {
    item,
    index,
    bookings,
    available,
    location,
    operator,
    updateStatus,
    statusChange,
    setupdatestatus,
  } = props;
  const {navigate} = useNavigation();

  const dashboardReducer = useSelector(state => state.dashboardReducer);
  const {userInfo} = dashboardReducer;

  const [modalVisible, setModalVisible] = useState(false);
  const [msg, setMsg] = useState('');
  const [statusa, setStatusa] = useState('Successful');
  const [screen, setScreen] = useState('');
  const [expanded, setExpanded] = useState(false);
  let optionHeight = [];
  bookings.map((item, index) => {
    optionHeight[index] = new Animated.Value(0);
  });
  const AlertNav = () => {
    setModalVisible(false);
    cancelBid(item?.bid?.id);
  };
  const changeStatus = (id, status, location) => {
    setTimeout(() => {
      setupdatestatus(true);
    }, 100);
    Api.changeBookingStatus(userInfo.token, id, status, location)
      .then(res => {
        if (res.response == 101) {
          if (status == 'On My Way') {
            startWatch(item.id);
          } else if (status == 'In Progress') {
            statusChange();
            // BackgroundGeolocation.checkStatus(
            //   (isRunning, locationServicesEnabled, authorization) => {
            //     if (isRunning) {
            //       BackgroundGeolocation.stop();
            //       BackgroundGeolocation.removeAllListeners();
            //     }
            //   },
            // );
          } else {
            statusChange();
          }
        }
      })
      .catch(e => {
        setupdatestatus(false);
        Alert.alert('Network error');
      });
  };
  const cancelBid = id => {
    setTimeout(() => {
      setupdatestatus(!updateStatus);
    }, 100);
    Api.changeBidStatus(userInfo.token, id)
      .then(res => {
        setupdatestatus(false);

        if (res.response == 100) {
          Alert.alert('Bid Cancel', 'You Cannot Cancel this bid!');
        }
        if (res.response == 101) {
          Alert.alert('Bid Cancel', 'Bid Cancelled Successfully!');
        }
      })
      .catch(e => {
        setupdatestatus(false);
        Alert.alert('Network error');
      });
  };
  const startWatch = id => {
    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 50,
      distanceFilter: 50,
      notificationTitle: 'Background tracking',
      notificationText: 'enabled',
      // debug: true,
      startOnBoot: false,
      stopOnTerminate: true,
      locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
      interval: 100000,
      fastestInterval: 5000,
      // startForeground: true,
      activitiesInterval: 10000,
      stopOnStillActivity: false,
      url: 'http://192.168.81.15:3000/location',
      httpHeaders: {
        'X-FOO': 'bar',
      },
      // customize post properties
      postTemplate: {
        lat: '@latitude',
        lon: '@longitude',
        foo: 'bar', // you can also add your own properties
      },
    });

    BackgroundGeolocation.on('location', location => {
      Api.operatorUpdateLocation(
        id,
        location.latitude,
        location.longitude,
        userInfo.token,
      )
        .then(res => {
          console.log(res);
          if (res.response == 101) {
            statusChange();
          }
        })
        .catch(e => console.log(e));
      // handle your locations here
      // to perform long running operation on iOS
      // you need to create background task
      BackgroundGeolocation.startTask(taskKey => {
        // execute long running task
        // eg. ajax post location
        // IMPORTANT: task has to be ended by endTask
        BackgroundGeolocation.endTask(taskKey);
      });
    });

    // BackgroundGeolocation.on('stationary', (stationaryLocation) => {
    //     // handle stationary locations here
    //     Actions.sendLocation(stationaryLocation);
    // });

    // BackgroundGeolocation.on('error', (error) => {
    //     console.log('[ERROR] BackgroundGeolocation error:', error);
    // });

    // BackgroundGeolocation.on('start', () => {
    //     console.log('[INFO] BackgroundGeolocation service has been started');
    // });

    // BackgroundGeolocation.on('stop', () => {
    //     console.log('[INFO] BackgroundGeolocation service has been stopped');
    // });

    // BackgroundGeolocation.on('authorization', (status) => {
    //     console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
    //     if (status !== BackgroundGeolocation.AUTHORIZED) {
    //         // we need to set delay or otherwise alert may not be shown
    //         setTimeout(() =>
    //             Alert.alert('App requires location tracking permission', 'Would you like to open app settings?', [
    //                 { text: 'Yes', onPress: () => BackgroundGeolocation.showAppSettings() },
    //                 { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' }
    //             ]), 1000);
    //     }
    // });

    // BackgroundGeolocation.on('background', () => {
    //     console.log('[INFO] App is in background');
    // });

    // BackgroundGeolocation.on('foreground', () => {
    //     console.log('[INFO] App is in foreground');
    // });

    // BackgroundGeolocation.on('abort_requested', () => {
    //     console.log('[INFO] Server responded with 285 Updates Not Required');

    //     // Here we can decide whether we want stop the updates or not.
    //     // If you've configured the server to return 285, then it means the server does not require further update.
    //     // So the normal thing to do here would be to `BackgroundGeolocation.stop()`.
    //     // But you might be counting on it to receive location updates in the UI, so you could just reconfigure and set `url` to null.
    // });

    // BackgroundGeolocation.on('http_authorization', () => {
    //     console.log('[INFO] App needs to authorize the http requests');
    // });

    // BackgroundGeolocation.checkStatus(status => {
    //     console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
    //     console.log('[INFO] BackgroundGeolocation services enabled', status.locationServicesEnabled);
    //     console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);

    //     // you don't need to check status before start (this is just the example)
    //     if (!status.isRunning) {
    //         BackgroundGeolocation.start(); //triggers start on start event
    //     }
    // });

    BackgroundGeolocation.start();
  };
  const actionButtons = item => {
    if (operator) {
      return (
        <View
          key={item.id}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          {item.status == 'Booked' && (
            <Button
              style={{
                flex: 1,
                opacity: optionHeight[item],
                marginHorizontal: 10,
              }}
              label={'On My Way'}
              rightIcon
              outline
              onPress={() => {
                // startWatch(item.id);

                changeStatus(item.id, 'On My Way', location);
              }}></Button>
          )}
          {item.status == 'On My Way' && (
            <Button
              style={{
                flex: 1,
                opacity: optionHeight[item],
                marginHorizontal: 10,
              }}
              label={'Arrived'}
              rightIcon
              outline
              onPress={() => {
                changeStatus(item.id, 'Pending Arrival Confirmation', location);
                // BackgroundGeolocation.checkStatus(
                //   (isRunning, locationServicesEnabled, authorization) => {
                //     if (isRunning) {
                //       BackgroundGeolocation.stop();
                //       BackgroundGeolocation.removeAllListeners();
                //     }
                //   },
                // );
              }}></Button>
          )}
          {item.status == 'Arrived' && (
            <Button
              style={{
                flex: 1,
                opacity: optionHeight[item],
                marginHorizontal: 10,
              }}
              label={'Start Job'}
              rightIcon
              outline
              onPress={() => {
                changeStatus(item.id, 'In Progress', location);
              }}></Button>
          )}
          {item.status == 'Breakdown' && (
            <>
              <Button
                style={{
                  flex: 1,
                  opacity: optionHeight[item],
                  marginHorizontal: 10,
                }}
                label={'Resume'}
                rightIcon
                outline
                onPress={() =>
                  changeStatus(item.id, 'In Progress', location)
                }></Button>
              <Button
                style={{
                  flex: 1,
                  opacity: optionHeight[item],
                  marginHorizontal: 10,
                }}
                label={'Complete'}
                rightIcon
                outline
                onPress={() => {
                  changeStatus(
                    item.id,
                    // 'Pending Completion Confirmation',
                    'Pending Payment Confirmation',

                    location,
                  );

                  // BackgroundGeolocation.checkStatus(
                  //   (isRunning, locationServicesEnabled, authorization) => {
                  //     if (isRunning) {
                  //       BackgroundGeolocation.stop();
                  //       BackgroundGeolocation.removeAllListeners();
                  //     }
                  //   },
                  // );
                }}></Button>
            </>
          )}
          {item.status == 'In Progress' && (
            <>
              <Button
                style={{
                  flex: 1,
                  opacity: optionHeight[item],
                  marginHorizontal: 10,
                }}
                label={'Breakdown'}
                outline
                onPress={() =>
                  changeStatus(item.id, 'Breakdown', location)
                }></Button>

              <Button
                style={{
                  flex: 1,
                  opacity: optionHeight[item],
                  marginHorizontal: 10,
                }}
                label={'Complete'}
                rightIcon
                outline
                onPress={() => {
                  changeStatus(
                    item.id,
                    'Pending Payment Confirmation',
                    location,
                  );

                  // BackgroundGeolocation.checkStatus(
                  //   (isRunning, locationServicesEnabled, authorization) => {
                  //     if (isRunning) {
                  //       BackgroundGeolocation.stop();
                  //       BackgroundGeolocation.removeAllListeners();
                  //     }
                  //   },
                  // );
                }}></Button>
            </>
          )}
          {item.status == 'Completed' && (
            <Button
              style={{
                flex: 1,
                opacity: optionHeight[item],
                marginHorizontal: 10,
              }}
              label={'Dispute'}
              rightIcon
              outline
              onPress={() => navigate('Dispute', {booking: item})}></Button>
          )}
          {item.status == 'Open' && (
            <Button
              style={{
                flex: 1,
                opacity: optionHeight[item],
                marginHorizontal: 10,
              }}
              // loading={item?.bid?.status == 'Cancelled' ? true:false}
              label={
                item?.bid?.status == 'Cancelled' ? 'Cancelled' : 'Cancel Bid'
              }
              rightIcon
              outline
              onPress={() => {
                if (item?.bid?.status == 'Cancelled') {
                  return Alert.alert('Machinan', 'Bid has been cancelled');
                }

                setModalVisible(true);
                setStatusa('Successful');
                setMsg('Are You sure you want to cancel bid?');
                setScreen('Any');
              }}></Button>
          )}
          {item.status == 'Cancelled' && (
            <Button
              style={{
                flex: 1,
                opacity: optionHeight[item],
                marginHorizontal: 10,
              }}
              label={'Dispute'}
              rightIcon
              outline
              onPress={() => navigate('Dispute', {booking: item})}></Button>
          )}
          {item.status == 'Disputed' && (
            <Button
              style={{
                flex: 1,
                opacity: optionHeight[item],
                marginHorizontal: 10,
              }}
              label={'Respond'}
              rightIcon
              outline
              onPress={() => navigate('Dispute', {booking: item})}></Button>
          )}
          {item.status == 'Pending Payment Confirmation' && (
            <Button
              style={{
                flex: 1,
                opacity: optionHeight[item],
                marginHorizontal: 10,
              }}
              label={'Approve Payment'}
              rightIcon
              outline
              onPress={() => {
                if (item?.payment_mode == 'COD') {
                  changeStatus(
                    item.id,
                    'Pending Completion Confirmation',
                    location,
                  );
                } else {
                  Alert.alert('Payment Confirmation', 'Pull down to refresh!');
                }
              }}></Button>
          )}
          <Button
            style={{flex: 1, opacity: optionHeight[item], marginHorizontal: 10}}
            label={'Details'}
            rightIcon
            outline
            onPress={() => navigate('Detail', {booking: item})}></Button>
        </View>
      );
    } else {
      return (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {item.status == 'Open' && (
            <Button
              style={{
                flex: 1,
                opacity: optionHeight[item],
                marginHorizontal: 10,
              }}
              label={
                item?.bid?.status == 'Cancelled' ? 'Cancelled' : 'Cancel Bid'
              }
              outline
              onPress={() => {
                if (item?.bid?.status == 'Cancelled') {
                  return Alert.alert('Machinan', 'Bid has been cancelled');
                }
                setModalVisible(true);
                setStatusa('Successful');
                setMsg('Are You sure you want to cancel bid?');
                setScreen('Any');
              }}></Button>
          )}
          <Button
            style={{flex: 1, opacity: optionHeight[item], marginHorizontal: 10}}
            label={'Details'}
            outline
            onPress={() => navigate('Detail', {booking: item})}></Button>
          {item.status == 'Completed' && (
            <Button
              style={{
                flex: 1,
                opacity: optionHeight[item],
                marginHorizontal: 10,
              }}
              label={'Dispute'}
              outline
              onPress={() => navigate('Dispute', {booking: item})}></Button>
          )}

          {item.status == 'Cancelled' && (
            <Button
              style={{
                flex: 1,
                opacity: optionHeight[item],
                marginHorizontal: 10,
              }}
              label={'Dispute'}
              outline
              onPress={() => navigate('Dispute', {booking: item})}></Button>
          )}
          {item.status == 'Disputed' && (
            <Button
              style={{
                flex: 1,
                opacity: optionHeight[item],
                marginHorizontal: 10,
              }}
              label={'Respond'}
              rightIcon
              outline
              onPress={() => navigate('Dispute', {booking: item})}></Button>
          )}
        </View>
      );
    }
  };
  const CheckStatus = (status, type) => {
    if (status == 'Disabled') {
      if (type == 'bgc') {
        return '#000';
      }
      return '#fff';
    }
    if (status == 'Expired') {
      if (type == 'bgc') {
        return '#000';
      }
      return '#fff';
    }
    if (status == 'Disputed') {
      if (type == 'bgc') {
        return '#F0EFFB';
      }
      return '#6C5DD3';
    }
    if (status == 'Arrived') {
      if (type == 'bgc') {
        return '#F0EFFB';
      }
      return '#6C5DD3';
    }
    if (status == 'In Progress') {
      if (type == 'bgc') {
        return '#F0EFFB';
      }
      return '#6C5DD3';
    }
    if (status == 'On My Way') {
      if (type == 'bgc') {
        return '#F0EFFB';
      }
      return '#6C5DD3';
    }
    if (status == 'Booked') {
      if (type == 'bgc') {
        return '#FFF3DC';
      }
      return '#FF754C';
    }
    if (status == 'Open') {
      if (type == 'bgc') {
        return '#E7FAFF';
      }
      return '#3F8CFF';
    }
    if (status == 'Cancelled') {
      if (type == 'bgc') {
        return '#e1f5e7';
      }
      return '#86d99c';
    }
    if (status == 'Pending Completion Confirmation') {
      if (type == 'bgc') {
        return '#e1f5e7';
      }
      return '#86d99c';
    }
    if (status == 'Pending Arrival Confirmation') {
      if (type == 'bgc') {
        return '#e1f5e7';
      }
      return '#86d99c';
    }
    if (status == 'Completed') {
      if (type == 'bgc') {
        return '#e1f5e7';
      }
      return '#86d99c';
    }
    if (status == 'Breakdown') {
      if (type == 'bgc') {
        return '#F0EFFB';
      }
      return '#6C5DD3';
    }
    if (status == 'Pending Payment Confirmation') {
      if (type == 'bgc') {
        return '#F0EFFB';
      }
      return '#6C5DD3';
    }
  };
  const cardPressed = useCallback(
    event => {
      if (available) {
        return navigate('BookingDetail', {booking: item});
      } else if (item?.bid?.status == 'Expired') {
        return Alert.alert('Bid status', 'Your Bid has been Expired ');
      } else if (item?.bid?.status == 'Rejected') {
        return Alert.alert('Bid status', 'Your Bid has been  Rejected');
      } else if (item?.status == 'Expired') {
        return Alert.alert('Booking status', ' Booking has been  Expired');
      } else {
        setExpanded(!expanded);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        return;
      }
      // Animated.timing(optionHeight[index], {
      //     toValue: optionHeight[index].__getValue() == 0 ? 50 : 0, // the numeric value of not current
      //     duration: 350, // 2 secs
      //     useNativeDriver: false,
      //   }).start();
    },
    [item && expanded],
  );
  return (
    <>
      <TouchableOpacity
        disabled={item?.supplier_status == 'Disabled' ? true : false}
        onPress={cardPressed}
        style={{
          backgroundColor:
            item?.supplier_status == 'Disabled' ? '#E7E8E0' : Colors.White,
          alignSelf: 'center',
          width: item?.supplier_status == 'Disabled' ? wp(98) : wp(95),
          borderRadius: item?.supplier_status == 'Disabled' ? 12 : 0,
          top: item?.supplier_status == 'Disabled' ? 3.5 : 0,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: item?.location_b_address ? -hp(2) : 0,
            width: item?.supplier_status == 'Disabled' ? wp(95) : 'auto',
            alignSelf: 'center',
            // borderWidth:1/
          }}>
          <View
            style={{
              ...styles.dateBox,
              borderColor:
                item?.supplier_status == 'Disabled' ? '#000' : '#E6E8F0',
            }}>
            <Text style={styles.month}>
              {moment(item?.created_at).format('MMM')}
            </Text>
            <Text style={styles.day}>
              {moment(item?.created_at).format('DD')}
            </Text>
            <View style={styles.timeBox}>
              <Text style={styles.time}>
                {moment(item?.created_at).format('h:mm A')}
              </Text>
            </View>
          </View>
          <View style={{flex: 1, padding: 10}}>
            <View style={styles.namecontainer}>
              <View
                style={{
                  ...styles.rightBox,
                  marginTop: item?.location_b_address ? hp(3) : 0,
                }}>
                <View>
                  <Text style={styles.orderIdmain}>
                    Order ID: <Text style={styles.orderId}>{item.id}</Text>
                  </Text>
                  <Text
                    numberOfLines={1}
                    lineBreakMode="tail"
                    style={styles.productname}>
                    {item.product_name.en
                      ? item?.product_name.en
                      : item?.product_name}{' '}
                    ({item?.product_capacity} TON)
                  </Text>
                </View>
                {available == false ? (
                  <View
                    style={{
                      ...styles.statusview,
                      backgroundColor:
                        item?.bid?.status == 'Expired' ||
                        item?.bid?.status == 'Rejected'
                          ? CheckStatus('Disabled', 'bgc')
                          : CheckStatus(item.status, 'bgc'),
                    }}>
                    {item?.bid?.status == 'Expired' ||
                    item?.bid?.status == 'Rejected' ? (
                      <Text
                        numberOfLines={1}
                        lineBreakMode="tail"
                        style={{
                          fontSize: 10,
                          fontWeight: '700',
                          paddingLeft: 6,
                          paddingRight: 6,
                          color: CheckStatus('Disabled', 'fc'),
                        }}>
                        Disabled
                      </Text>
                    ) : (
                      <Text
                        numberOfLines={1}
                        lineBreakMode="tail"
                        style={{
                          fontSize: 10,
                          fontWeight: '700',
                          paddingLeft: 6,
                          paddingRight: 6,
                          color: CheckStatus(item.status, 'fc'),
                        }}>
                        {item.status.replace(/Pending/g, '')}
                      </Text>
                    )}
                  </View>
                ) : null}
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{alignItems: 'center'}}>
                <Image
                  source={item?.location_b_address ? Images.AB : Images.A}
                  style={{
                    height: item.location_b_address ? 75 : 44,
                    width: item.location_b_address ? 15 : 20,
                  }}
                  resizeMode="contain"
                />
              </View>

              <View
                style={{marginLeft: 5, top: item.location_b_address ? 4 : -2}}>
                <Text
                  style={{
                    marginBottom: item.location_b_address ? hp(0.8) : hp(1.3),
                    fontWeight: '600',
                    fontSize: 10,
                  }}>
                  Location
                </Text>

                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    ...styles.location_a_address,
                    marginBottom: item.location_b_address ? hp(0.52) : 0,
                    textAlign: 'left',
                  }}>
                  {item.location_a_address}
                </Text>

                {item.location_b_address && (
                  <Text
                    numberOfLines={1}
                    lineBreakMode="tail"
                    style={{...styles.location_a_address, textAlign: 'left'}}>
                    {item.location_b_address}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {expanded && (
          <View
            style={{
              // height: optionHeight[index],
              // opacity: optionHeight[index],
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
            }}>
            {actionButtons(item)}
          </View>
        )}
      </TouchableOpacity>
      {modalVisible && (
        <AlertModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          msg={msg}
          status={statusa}
          screen={screen}
          navigation={AlertNav}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  namecontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productname: {
    fontWeight: 'bold',
    fontSize: hp(2.3),
    width: wp(60),
  },
  orderIdmain: {color: '#8F95B2', marginBottom: 4, width: wp(30)},
  dateBox: {
    alignItems: 'center',
    borderWidth: 1,
    height: hp(13),
    paddingTop: 3,
    width: wp(18),
    borderRadius: 20,
    top: -3,
  },
  month: {
    color: '#8F95B2',
    fontWeight: '700',
    fontSize: hp(1.7),
    marginBottom: 1,
    top: 5,
  },
  day: {
    color: '#081735',
    fontWeight: '700',
    fontSize: hp(4),
    alignSelf: 'center',
    height: hp(6),
  },
  timeBox: {
    width: '100%',
    backgroundColor: '#000',
    height: hp(4),
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  time: {
    fontSize: hp(1.5),
    color: 'white',
    fontWeight: '600',
  },
  rightBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  orderId: {
    fontWeight: '300',
    fontWeight: 'bold',
    color: 'black',
  },
  statusview: {
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    height: 22,
    width: 'auto',
    alignSelf: 'flex-start',
    position: 'absolute',
    right: 0,
  },
  location_a_address: {
    fontWeight: '400',
    fontSize: 13,
    color: '#7F7F7F',
    width: wp(66),
  },
});

export default memo(BookingsCard);
