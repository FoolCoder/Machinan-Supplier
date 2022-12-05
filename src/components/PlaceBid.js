import React, {useEffect, useState, useRef} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  PermissionsAndroid,
  Alert,
  Image,
  ScrollView,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useSelector} from 'react-redux';
import Api from '../utils/Api';
import Colors from '../utils/Colors';
import Images from '../utils/Images';
import Geolocation from 'react-native-geolocation-service';
import {hp, wp} from './Responsive';
import {Modalize} from 'react-native-modalize';
import MapView, {Marker, Polyline} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Loader from './Loader';
import OEselectionmodal from './OEselectionmodal';
import AlertModal from './AlertModal';
import DatePicker from 'react-native-date-picker';
import {CommonActions, StackActions} from '@react-navigation/native';
import FSLoader from './FSLoader';

const PlaceBid = ({navigation, route}) => {
  const Oref = useRef(null);
  const Eref = useRef(null);
  const Rref = useRef(null);
  const modalizeRef = useRef(null);
  const TmodalizeRef = useRef(null);
  const map = useRef(null);
  const markerRef = useRef(null);
  const scrollViewRef = useRef();
  const {booking} = route.params;
  const dashboardReducer = useSelector(state => state.dashboardReducer);
  const {userInfo, userType} = dashboardReducer;

  const [modalVisible, setModalVisible] = useState(false);
  const [malert, setMalert] = useState('');
  const [status, setStatus] = useState('Successful');
  const [screen, setScreen] = useState('');

  const [biddableData, setbiddableData] = useState(null);
  const [price, setPrice] = useState('');
  const [Index, setindex] = useState(null);
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [selectedRiggers, setSelectedRiggers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [etaTime, setEtaTime] = useState(new Date());
  const [checkRange, setcheckRange] = useState(false);
  const [currentLoc, setcurrentLoc] = useState(null);
  const [disAB, setdisAB] = useState(null);
  const [timeAB, settimeAB] = useState(null);
  const [currentdis, setcurrentdis] = useState(null);
  const [currenttime, setcurrenttime] = useState(null);
  const [offset, setOffset] = useState(0);
  const [priceCal, setpriceCal] = useState([]);

  const onRegionChangeComplete = () => {
    if (markerRef && markerRef.current && markerRef.current.showCallout) {
      markerRef.current.showCallout();
    }
  };
  useEffect(() => {
    requestLocationPermission();
    Api.getSupplierBidData(userInfo.token, booking.id, userType)
      .then(res => {
        console.log(res);
        if (res.response == 100) {
          Alert.alert(res.message);
          return;
        }
        if (res.response == 101) {
          setbiddableData(res.data);
        }
      })
      .catch(e => Alert.alert('Error', e.message));

    return () => {};
  }, []);
  useEffect(() => {
    if (biddableData != null) {
      randomIntFromInterval();
    }
  }, [biddableData != null]);
  const onOpen = () => {
    modalizeRef.current?.open();
    currentLoc && fittoCordinate(currentLoc);
  };

  const randomIntFromInterval = () => {
    var randoms = [];
    for (let i = 0; i < 5; i++) {
      if (i == 0) {
        randoms
          .push(
            biddableData?.price -
              (biddableData?.min_percentage * biddableData?.price) / 100,
          )
          .toFixed(0);
      } else if (i == 1) {
        randoms.push(
          (
            biddableData?.price -
            (biddableData?.min_percentage * 0.5 * biddableData?.price) / 100
          ).toFixed(0),
        );
      } else if (i == 2) {
        randoms.push((biddableData?.price).toFixed(0));
      } else if (i == 3) {
        randoms
          .push(
            biddableData?.price +
              (biddableData?.max_percentage * 0.5 * biddableData?.price) / 100,
          )
          .toFixed(0);
      } else if (i == 4) {
        randoms.push(
          (
            biddableData?.price +
            (biddableData?.max_percentage * biddableData?.price) / 100
          ).toFixed(0),
        );
      } else {
        randoms
          .push(
            biddableData?.price +
              (biddableData?.max_percentage * 0.5 * biddableData?.price) / 100,
          )
          .toFixed(0);
      }
    }
    setpriceCal(randoms);
  };

  const placeBid = position => {
    setLoading(true);
    if (price == '' || price < priceCal[0] || price > priceCal[4]) {
      setLoading(false);
      setScreen('');
      setMalert('Price should not empty and must be in Range!');
      setStatus('Failure');
      setModalVisible(true);
      return;
    } else if (selectedOperator == null && userType == 'Supplier') {
      setLoading(false);
      setScreen('');
      setStatus('Failure');
      setMalert('Please select operator first');
      setModalVisible(true);
      return;
    } else if (selectedEquipment == null && userType == 'Supplier') {
      setLoading(false);
      setScreen('');
      setStatus('Failure');
      setMalert('Please select equipment first');
      setModalVisible(true);
      return;
    }
    let date = moment();
    date.set('hour', moment(etaTime).hour());
    date.set('minute', moment(etaTime).minutes());
    date.set('second', moment(etaTime).seconds());

    Api.placeBidAsSupplier(
      userInfo.token,
      booking.id,
      moment(date).format('YYYY-MM-DD hh:mm'),
      selectedOperator ? selectedOperator.id : null,
      selectedEquipment ? selectedEquipment.id : null,
      selectedRiggers ? selectedRiggers : null,
      price,
      position.latitude,
      position.longitude,
      userType,
    )
      .then(res => {
        if (res.response == 101) {
          setLoading(false);
          setScreen('Screen');
          setStatus('Successful');
          setMalert('Bid has been successfully Placed');
          setModalVisible(true);
          return;
        }
        setLoading(false);
        setScreen('');
        setStatus('Failure');
        setMalert(res.message);
        setModalVisible(true);
      })
      .catch(e => {
        setLoading(false);
        setScreen('');
        setStatus('Failure');
        setMalert('Something went Wrong Please try Again');
        setModalVisible(true);
      });
  };

  const getUserLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        // setcurrentLoc({
        //   latitude: position?.coords.latitude,
        //   longitude: position?.coords.longitude,
        // });
        setcurrentLoc({
          latitude: 25.286106,
          longitude: 51.534817,
        });
        // placeBid(position);
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const requestLocationPermission = async () => {
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
          console.log('Permission Granted');
          getUserLocation();
        } else {
          console.log('Permission Not Granted');
        }
      } else {
        const granted = await Geolocation.requestAuthorization('whenInUse');
        if (granted === 'granted') {
          console.log('Permission Granted');
          getUserLocation();
        } else {
          console.log('Permission Not Granted');
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const slowlyScrollDown = () => {
    const y = offset + 80;
    scrollViewRef.current.scrollTo({x: 0, y, animated: true});
    setOffset(y);
  };

  const AlertNav = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{name: 'BookingsStack'}, {name: 'BookingsStack'}],
      }),
    );
    // navigation.dispatch(
    //   StackActions.popToTop()
    // );
  };
  const fittoCordinate = c3 => {
    let region =
      booking?.location_b_latitude && booking?.location_b_longitude
        ? [
            {
              latitude: booking?.location_a_latitude,
              longitude: booking?.location_a_longitude,
            },
            {
              latitude: booking?.location_b_latitude,
              longitude: booking?.location_b_longitude,
            },
            {
              latitude: c3.latitude,
              longitude: c3.longitude,
            },
          ]
        : [
            {
              latitude: booking?.location_a_latitude,
              longitude: booking?.location_a_longitude,
            },

            {
              latitude: c3.latitude,
              longitude: c3.longitude,
            },
          ];
    setTimeout(() => {
      map.current?.fitToCoordinates(region, {
        edgePadding: {
          bottom: 35,
          right: 20,
          top: 50,
          left: 20,
        },
        animated: true,
      });
    }, 1000);
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.White}}>
      <View
        style={{alignItems: 'center', justifyContent: 'center', padding: 20}}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{position: 'absolute', left: 20}}>
          <Ionicons name="chevron-back" size={24} />
        </TouchableOpacity>
        <Text style={{fontWeight: 'bold', fontSize: 20}}>Place Bid</Text>
      </View>

      {biddableData ? (
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{alignItems: 'center'}}
          showsVerticalScrollIndicator={false}>
          <View style={styles.productContainer}>
            <View style={styles.productInfoContainer}>
              <View style={styles.productRight}>
                <Text
                  style={{
                    marginTop: 10,
                    marginBottom: 12,
                    fontWeight: '600',
                    color: Colors.Gray,
                  }}>
                  Product Info
                </Text>
                <Text style={{fontWeight: 'bold', fontSize: 18}}>
                  {booking.equipment_icon
                    ? booking.product_name
                    : booking.product_name.en}
                </Text>
              </View>
              <View style={styles.productLeft}>
                <Text style={{fontWeight: '700', fontSize: hp(3)}}>
                  {booking.product_capacity}
                </Text>
                <Text style={{color: Colors.Gray}}>TON</Text>
              </View>
            </View>
            <TouchableOpacity
              disabled={currentLoc ? false : true}
              style={{flexDirection: 'row'}}
              onPress={() => onOpen()}>
              <Image
                source={booking.location_b_address ? Images.BidAB : Images.BidA}
                resizeMode="contain"
                style={
                  booking.location_b_address
                    ? styles.locationABImage
                    : styles.locationAImage
                }
              />
              <View style={{flex: 1}}>
                <View style={{...styles.locationContainer, marginTop: hp(3)}}>
                  <View>
                    <Text style={styles.locationtxt}>Location A</Text>

                    <View style={{width: wp(50)}}>
                      <Text style={styles.locationaddres}>
                        {booking.location_a_address}
                      </Text>
                    </View>
                    {/* <MaterialCommunityIcons name='map-marker' size={20} color={Colors.Secondary} /> */}
                  </View>

                  <Image
                    source={Images.LocationA}
                    resizeMode="cover"
                    style={styles.locationImage}
                  />
                </View>

                {booking.location_b_address && (
                  <View
                    style={{
                      ...styles.locationContainer,
                      marginVertical: hp(2),
                    }}>
                    <View>
                      <Text style={styles.locationtxt}>Location B</Text>
                      <View style={{width: wp(50)}}>
                        <Text style={styles.locationaddres}>
                          {booking.location_b_address}
                        </Text>
                      </View>
                    </View>

                    <Image
                      source={Images.LocationB}
                      resizeMode="cover"
                      style={styles.locationImage}
                    />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>

          {biddableData ? (
            <View
              style={{
                width: wp(90),
                marginTop: 20,
              }}>
              <Text
                style={{fontWeight: 'bold', fontSize: 15, marginBottom: 20}}>
                Estimated Time
              </Text>
              <View style={styles.dateTimeContainer}>
                <View style={styles.dateContainer}>
                  <Image source={Images.DateSelection} style={styles.dateIMG} />
                  <View style={{marginLeft: 10}}>
                    <Text style={{fontWeight: '700', color: Colors.Gray}}>
                      Date
                    </Text>
                    <Text style={{fontWeight: 'bold', marginTop: 5}}>
                      {moment().format('DD MMM YYYY')}
                    </Text>
                  </View>
                </View>
                <View style={styles.dateContainer}>
                  <Image source={Images.TimeSelection} style={styles.dateIMG} />
                  <View style={{marginLeft: 10, flexDirection: 'row'}}>
                    <View>
                      <Text style={{fontWeight: '700', color: Colors.Gray}}>
                        Time
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          setShowTimePicker(true);
                          TmodalizeRef.current?.open();
                        }}
                        style={{
                          borderColor: Colors.Gray,
                        }}>
                        <Text
                          style={{
                            fontWeight: 'bold',
                            textDecorationLine: 'underline',
                            marginTop: 5,
                          }}>
                          {moment(etaTime).format('hh:mm')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <Image
                      source={Images.CloseSquare}
                      style={styles.timeCrossImg}
                    />
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <FSLoader />
          )}

          {/* {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={moment().toDate()}
            mode={'date'}
            display={Platform.OS == 'ios' ? 'spinner' : 'default'}
            style={{backgroundColor: 'white'}}
            onChange={(event, selectedDate) => {
              const currentDate = selectedDate;
              setShowDatePicker(Platform.OS === 'ios');
              setEtaDate(currentDate);
            }}
          />
        )} */}

          {/* {showTimePicker && (
            
          )} */}

          {!biddableData?.bidable && biddableData && (
            <View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View
                  key={1}
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  {priceCal?.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          setcheckRange(false);
                          setPrice(item);
                          setindex(index);
                          slowlyScrollDown();
                        }}
                        style={{
                          backgroundColor:
                            Index == index ? Colors.Black : Colors.LightGray,
                          ...styles.selectprice,
                        }}>
                        <Text
                          style={{
                            color: Index == index ? Colors.White : Colors.Black,
                            fontWeight: 'bold',
                          }}>
                          {item}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
              <View
                style={{
                  backgroundColor: Colors.White,
                  padding: 10,
                  marginTop: 5,
                  borderRadius: 10,
                  elevation: 5,
                }}>
                <View style={styles.writebidprice}>
                  <Text style={{color: 'white'}}>WRITE BID PRICE</Text>
                </View>
                <TextInput
                  placeholder="Price"
                  keyboardType="number-pad"
                  value={price?.toString()}
                  onChangeText={val => {
                    if (val < priceCal[0] || val > priceCal[4]) {
                      setcheckRange(true);
                      setPrice(val);
                      setindex(null);
                    } else {
                      setcheckRange(false);
                      setPrice(val);
                      setindex(null);
                      priceCal.map((item, index) => {
                        if (val == item) {
                          setindex(index);
                        }
                      });
                    }
                  }}
                  style={{
                    ...styles.priceInput,
                    borderColor: checkRange ? Colors.Red : Colors.Black,
                  }}
                />
              </View>
            </View>
          )}

          {biddableData?.bidable && biddableData && (
            <View
              style={{width: wp(90), alignSelf: 'center', marginBottom: 20}}>
              <Text style={{fontWeight: 'bold', marginVertical: 20}}>
                Select Price
              </Text>
              <View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View
                    key={1}
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    {priceCal?.map((item, index) => {
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => {
                            setPrice(item);
                            setindex(index);
                            slowlyScrollDown();
                            setcheckRange(false);
                          }}
                          style={{
                            backgroundColor:
                              Index == index ? Colors.Black : Colors.LightGray,
                            ...styles.selectprice,
                          }}>
                          <Text
                            style={{
                              color:
                                Index == index ? Colors.White : Colors.Black,
                              fontWeight: 'bold',
                            }}>
                            {item}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>
                <View
                  style={{
                    ...styles.inputpricecontainer,
                    borderColor: checkRange ? Colors.Red : Colors.Black,
                  }}>
                  <View style={styles.writebidprice}>
                    <Text style={{color: 'white'}}>WRITE BID PRICE</Text>
                  </View>
                  <TextInput
                    placeholder="Price"
                    keyboardType="number-pad"
                    value={price?.toString()}
                    onChangeText={val => {
                      if (val < priceCal[0] || val > priceCal[4]) {
                        setcheckRange(true);
                        setPrice(val);
                        setindex(null);
                      } else {
                        setcheckRange(false);
                        setPrice(val);
                        setindex(null);
                        priceCal.map((item, index) => {
                          if (val == item) {
                            setindex(index);
                          }
                        });
                      }
                    }}
                    style={{
                      flex: 1,
                      borderBottomWidth: 1,
                      borderColor: checkRange ? Colors.Red : Colors.Black,
                      alignSelf: 'center',
                      padding: 0,
                      minWidth: 150,
                      textAlign: 'center',
                      fontSize: 22,
                    }}
                  />
                </View>
                {checkRange && (
                  <Text
                    style={{
                      fontSize: 11,
                      color: Colors.Red,
                      left: wp(3),
                    }}>
                    Price must be Between Range
                  </Text>
                )}
              </View>
            </View>
          )}

          {biddableData && price != '' && (
            <>
              {userType == 'Supplier' && (
                <TouchableOpacity onPress={() => Oref.current.open()}
                  style={{
                    width: wp(90),
                    alignSelf: 'center',
                    backgroundColor: Colors.White,
                    padding: 10,
                    marginTop: 5,
                    borderRadius: 10,
                    elevation: 5,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{fontWeight: 'bold'}}>Operator</Text>
                      <Text style={{fontWeight: 'bold', color: Colors.Primary}}>
                        {selectedOperator ? 'Change' : 'Select'}
                      </Text>
                  </View>
                  <View
                    style={{
                      marginTop: 5,
                    }}>
                    <Text>
                      {selectedOperator
                        ? selectedOperator?.name
                        : 'No Operator selected'}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}

              {biddableData.riggers && (
                <TouchableOpacity onPress={() => Rref.current.open()}
                  style={{
                    width: wp(90),
                    alignSelf: 'center',
                    backgroundColor: Colors.White,
                    padding: 10,
                    marginTop: 5,
                    borderRadius: 10,
                    elevation: 5,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{fontWeight: 'bold'}}>Riggers</Text>
                      <Text style={{fontWeight: 'bold', color: Colors.Primary}}>
                        {selectedRiggers.length > 0 ? 'Change' : 'Select'}
                      </Text>
                  </View>
                  <View style={{marginTop: 5}}>
                    <Text>
                      {selectedRiggers.length > 0
                        ? selectedRiggers[0]?.name
                        : 'No Riggers selected'}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              {userType == 'Supplier' && (
                <TouchableOpacity onPress={() => Eref.current.open()}
                  style={{
                    width: wp(90),
                    alignSelf: 'center',
                    backgroundColor: Colors.White,
                    padding: 10,
                    marginTop: 5,
                    borderRadius: 10,
                    elevation: 5,
                    marginBottom: 10,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{fontWeight: 'bold'}}>Equipment</Text>
                      <Text style={{fontWeight: 'bold', color: Colors.Primary}}>
                        {selectedEquipment ? 'Change' : 'Select'}
                      </Text>
                  </View>
                  <View
                    style={{
                      marginTop: 5,
                    }}>
                    <Text>
                      {selectedEquipment
                        ? selectedEquipment?.product?.name?.en
                        : 'No Equipment selected'}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </>
          )}
        </ScrollView>
      ) : (
        <FSLoader />
      )}
      {biddableData && (
        <TouchableOpacity
          disabled={loading}
          onPress={() => placeBid(currentLoc)}
          style={styles.bidbtn}>
          <Text style={{color: 'white', fontSize: 20}}>Place Bid</Text>
        </TouchableOpacity>
      )}

      <OEselectionmodal
        OEref={Oref}
        type="Operator"
        selectval={setSelectedOperator}
        val={selectedOperator}
        biddableData={biddableData?.operators}
      />

      <OEselectionmodal
        OEref={Eref}
        type="Equipment"
        selectval={setSelectedEquipment}
        val={selectedEquipment}
        biddableData={biddableData?.equipments}
      />

      <OEselectionmodal
        OEref={Rref}
        type="Riggers"
        selectval={setSelectedRiggers}
        val={selectedRiggers}
        biddableData={biddableData?.riggers}
      />

      <Modalize
        ref={TmodalizeRef}
        panGestureEnabled={true}
        withHandle={true}
        closeOnOverlayTap={false}
        // onPositionChange={c => setcheckP(c)}
        modalHeight={hp(45)}
        keyboardAvoidingBehavior="height"
        scrollViewProps={{
          keyboardShouldPersistTaps: 'always',
        }}
        handleStyle={{
          alignSelf: 'center',
          width: 45,
          height: 5,
          borderRadius: 5,
          backgroundColor: '#040415',
        }}
        modalStyle={{
          flex: 1,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          backgroundColor: '#040415',
        }}
        HeaderComponent={
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: wp(90),
              alignSelf: 'center',
              marginTop: 20,
              borderBottomWidth: 1,
              borderBottomColor: '#3F4044',
            }}>
            <View style={{width: 30}} />
            <View style={{alignItems: 'center'}}>
              <Image
                source={require('../assets/timepick.png')}
                style={{height: 40, width: 40}}
                resizeMode="contain"
              />
              <Text
                style={{
                  color: Colors.White,
                  fontWeight: '700',
                  fontSize: 18,
                }}>
                Select Time
              </Text>
              <Text
                style={{
                  color: '#F39200',
                  fontWeight: '700',
                  fontSize: 16,
                  marginBottom: 10,
                }}>
                {moment(etaTime).format('hh:mm')}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => TmodalizeRef.current.close()}
              style={{marginTop: -hp(7)}}>
              <Ionicons name="close" size={24} color={'#fff'} />
            </TouchableOpacity>
          </View>
        }>
        <DatePicker
          style={{
            width: wp(95),
            height: hp(30),
            alignSelf: 'center',
          }}
          androidVariant="nativeAndroid"
          minimumDate={new Date()}
          textColor="#F39200"
          fadeToColor="#040415"
          mode="time"
          date={etaTime}
          onDateChange={date => {
            setEtaTime(date);
          }}
        />
      </Modalize>

      <Modalize
        ref={modalizeRef}
        panGestureEnabled={true}
        withHandle={false}
        closeOnOverlayTap={false}
        // onPositionChange={c => setcheckP(c)}
        modalHeight={hp(98)}
        keyboardAvoidingBehavior="height"
        scrollViewProps={{
          keyboardShouldPersistTaps: 'always',
        }}
        on
        handleStyle={{
          alignSelf: 'center',
          width: 45,
          height: 5,
          borderRadius: 5,
          backgroundColor: '#040415',
        }}
        modalStyle={{
          flex: 1,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          backgroundColor: '#040415',
        }}
        HeaderComponent={
          <View style={{...styles.modalHeader}}>
            <TouchableOpacity
              onPress={() => modalizeRef.current.close()}
              style={{}}>
              <Ionicons name="chevron-back" size={24} color={'#fff'} />
            </TouchableOpacity>
            <Text
              style={{
                color: Colors.White,
                fontWeight: '700',
                fontSize: 16,
              }}>
              Location
            </Text>
          </View>
        }>
        <View
          style={{
            ...styles.mView,
          }}>
          <MapView
            ref={map}
            onMapReady={onRegionChangeComplete}
            style={{
              height: hp(93),
            }}
            customMapStyle={mapstyle}
            scrollEnabled
            provider={'google'}
            initialRegion={{
              latitude: booking?.location_a_latitude,
              longitude: booking?.location_a_longitude,
              latitudeDelta: 0.4922,
              longitudeDelta: 0.4421,
            }}>
            <Marker
              ref={markerRef}
              coordinate={{
                latitude: booking?.location_a_latitude,
                longitude: booking?.location_a_longitude,
              }}
              title={
                currenttime ? `${currenttime?.toFixed(1)} min ` : 'Loading'
              }
              description={`${currentdis?.toFixed(1)} KM`}
              image={Images.locA}></Marker>

            <Marker coordinate={currentLoc}>
              <View style={{alignItems: 'center'}}>
                {/* <Text style={{fontWeight: 'bold'}}>{'currentLocation'}</Text> */}
                <Ionicons name="location" color={Colors.Primary} size={20} />
              </View>
            </Marker>
            {booking?.location_a_latitude && booking?.location_a_longitude && (
              <MapViewDirections
                origin={currentLoc}
                destination={{
                  latitude: booking?.location_a_latitude,
                  longitude: booking?.location_a_longitude,
                }}
                mode={'DRIVING'}
                onReady={result => {
                  setcurrentdis(result.distance);
                  setcurrenttime(result.duration);
                }}
                apikey={'AIzaSyDwpDMOezsYP1l-pqetH8Gc3aMMIc0iuB8'}
                strokeWidth={5}
                strokeColor={Colors.Green}
              />
            )}
            {booking?.location_b_latitude && booking?.location_b_longitude && (
              <>
                <Marker
                  coordinate={{
                    latitude: booking?.location_b_latitude,
                    longitude: booking?.location_b_longitude,
                  }}
                  title={`${timeAB?.toFixed(1)} min `}
                  description={`${disAB?.toFixed(1)} KM`}
                  image={Images.locB}
                />
                <MapViewDirections
                  origin={{
                    latitude: booking?.location_a_latitude,
                    longitude: booking?.location_a_longitude,
                  }}
                  destination={{
                    latitude: booking?.location_b_latitude,
                    longitude: booking?.location_b_longitude,
                  }}
                  onReady={result => {
                    setdisAB(result.distance);
                    settimeAB(result.duration);
                  }}
                  apikey={'AIzaSyDwpDMOezsYP1l-pqetH8Gc3aMMIc0iuB8'}
                  strokeWidth={5}
                  strokeColor={'#F15223'}
                />
              </>
            )}
            {currentLoc && fittoCordinate(currentLoc)}
          </MapView>
          {currentLoc && fittoCordinate(currentLoc)}
        </View>
      </Modalize>
      {modalVisible && (
        <AlertModal
          setModalVisible={setModalVisible}
          modalVisible={modalVisible}
          status={status}
          navigation={AlertNav}
          msg={malert}
          screen={screen}
        />
      )}
      {loading && <FSLoader />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  priceInput: {
    flex: 1,
    borderBottomWidth: 1,
    alignSelf: 'center',
    padding: 0,
    minWidth: 150,
    textAlign: 'center',
    fontSize: 22,
  },
  markerview: {
    width: wp(10),
    height: hp(4),
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    bottom: 20,
  },
  productContainer: {
    borderWidth: 0.8,
    borderRadius: 20,
    borderColor: '#E6E6E6',
  },
  productInfoContainer: {
    width: wp(90),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAE5B8',
    borderRadius: 20,
  },
  productRight: {
    justifyContent: 'space-between',
    marginLeft: 20,
  },
  productLeft: {
    height: hp(9),
    width: hp(9),
    borderWidth: 0.5,
    borderColor: Colors.Gray,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    marginRight: 20,
    borderRadius: hp(9) / 3.5,
    backgroundColor: 'white',
  },
  locationABImage: {
    height: hp(14.5),
    marginTop: hp(3),
    marginLeft: 10,
  },
  locationAImage: {
    height: hp(4),
    marginTop: hp(3),
    marginLeft: 10,
  },
  locationImage: {
    height: hp(10),
    width: hp(10),
  },
  locationContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 13,
    marginLeft: 5,
  },
  locationtxt: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 10,
  },
  locationaddres: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.Gray,
  },
  dateIMG: {
    height: hp(7),
    width: hp(7),
    borderRadius: hp(7) / 2,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeCrossImg: {
    width: 20,
    height: 20,
    alignSelf: 'flex-end',
    marginLeft: wp(7),
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bidbtn: {
    width: wp(92),
    height: hp(8),
    borderRadius: hp(10) / 2,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  selectprice: {
    marginRight: 10,
    height: hp(9),
    width: hp(9),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  inputpricecontainer: {
    width: wp(90),
    height: hp(10),
    borderRadius: 20,
    borderWidth: 0.7,
    borderColor: Colors.Gray,
    marginTop: 20,
  },
  writebidprice: {
    alignSelf: 'center',
    width: wp(40),
    backgroundColor: Colors.Primary,
    paddingVertical: 5,
    alignItems: 'center',
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
  modalHeader: {
    flexDirection: 'row',
    height: hp(5),
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'flex-start',
    // borderWidth:1,
    borderColor: '#fff',
    top: hp(1.5),
    width: wp(56),
    left: 10,
  },
  mView: {
    alignSelf: 'center',
    width: wp(100),
    borderRadius: 30,
    overflow: 'hidden',
    top: hp(3),
  },
  loctxt: {
    color: Colors.Black,
    fontWeight: 'bold',
    fontSize: wp(4.5),
    marginLeft: wp(6),
    marginTop: 5,
    width: wp(65),
  },
  placeInput: {
    height: 'auto',
    width: wp(90),
    borderRadius: 15,
    position: 'absolute',
    zIndex: 2,
    alignSelf: 'center',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default PlaceBid;

const mapstyle = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#242f3e',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#746855',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#242f3e',
      },
    ],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#d59563',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#d59563',
      },
    ],
  },
  {
    featureType: 'poi.business',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#263c3f',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#6b9a76',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#38414e',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#212a37',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9ca5b3',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#746855',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#1f2835',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#f3d19c',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [
      {
        color: '#2f3948',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#d59563',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#17263c',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#515c6d',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#17263c',
      },
    ],
  },
];
