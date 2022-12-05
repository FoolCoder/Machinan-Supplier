import React, {useEffect, useState, createRef, useRef} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Linking,
  Modal as ImageModal,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Images from '../utils/Images';
import Colors from '../utils/Colors';
import {hp, wp} from './Responsive';
import {useSelector} from 'react-redux';
import {Modalize} from 'react-native-modalize';
import MapView, {Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import moment from 'moment/moment';
import Modal from 'react-native-modal';
import ImageViewer from 'react-native-image-zoom-viewer';
import Swiper from 'react-native-swiper';
import Pdf from 'react-native-pdf';
import FastImage from 'react-native-fast-image';
const DetailComponent = ({
  navigation,
  route,
  operator,
  bookinDetails,
  currentLoc,
  documents,
}) => {
  const {booking} = route.params;
  const dashboardReducer = useSelector(state => state.dashboardReducer);
  const {userInfo} = dashboardReducer;
  const modalizeRef = useRef(null);
  const map = useRef(null);
  const markerRef = useRef(null);
  const scrollViewRef = useRef();
  const [disAB, setdisAB] = useState(null);
  const [timeAB, settimeAB] = useState(null);
  const [currentdis, setcurrentdis] = useState(null);
  const [currenttime, setcurrenttime] = useState(null);
  const [attachmentModal, setattachmentModal] = useState(false);
  const [attachments, setAttachments] = useState(null);
  const [pagerModal, setpagerModal] = useState(false);

  const [documentIndex, setdocumentIndex] = useState(0);
  const [swiperModal, setswiperModal] = useState(false);

  const onOpen = () => {
    modalizeRef.current?.open();
    fittoCordinate(currentLoc);
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
    <SafeAreaView style={styles.container}>
      <View style={styles.backButtonView}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{position: 'absolute', left: 20}}>
          <Ionicons name="chevron-back" size={24} />
        </TouchableOpacity>
        <Text style={{fontWeight: 'bold', fontSize: 20}}>Booking Detail</Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{alignItems: 'center'}}
        showsVerticalScrollIndicator={false}>
        {/* {booking.status != 'Open' && booking.status != 'Cancelled' && ( */}
        <View style={styles.bookinginfoContainer}>
          <View style={{marginLeft: 5}}>
            <Text
              style={{
                ...styles.requirementtxt,
                color: '#4E8B54',
                fontWeight: '600',
                marginBottom: 5,
              }}>
              Bid Placed
            </Text>
            <Text style={{fontWeight: '700'}}>
              {bookinDetails?.bid?.price}{' '}
              <Text style={{fontSize: 12}}>Price</Text>
            </Text>
          </View>
          <View>
            <View style={styles.statusBox}>
              <Image
                resizeMode="contain"
                source={Images.whiteTick}
                style={{width: hp(1.7), height: hp(1.7), marginRight: 4}}
              />
              <Text style={styles.requirementtxt}>
                STATUS: {bookinDetails?.status.replace(/Pending/g, '')}
              </Text>
            </View>
          </View>
        </View>
        {/* )} */}
        <View
          style={{
            ...styles.productContainer,
          }}>
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
                {bookinDetails?.product_name.en}
              </Text>
            </View>
            <View style={styles.productLeft}>
              <Text style={{fontWeight: '700', fontSize: hp(3)}}>
                {booking.product_capacity}
              </Text>
              <Text style={{color: Colors.Gray}}>TON</Text>
            </View>
          </View>
          <View style={{width: wp(88), alignSelf: 'center'}}>
            <ScrollView
              horizontal
              nestedScrollEnabled={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                flexDirection: 'row',
                height: 'auto',
              }}>
              {bookinDetails?.bid?.equipment?.images.length > 0 &&
                bookinDetails?.bid?.equipment?.images?.map(item => {
                  return (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => setpagerModal(!pagerModal)}>
                      <FastImage
                        style={{
                          width: wp(18),
                          height: wp(18),
                          borderRadius: 10,
                          marginLeft: 8,
                          marginVertical: 10,
                        }}
                        source={{
                          uri: item?.url,
                          priority: FastImage.priority.high,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                    </TouchableOpacity>
                  );
                })}
            </ScrollView>
          </View>
        </View>
        <TouchableOpacity
          disabled={currentLoc ? false : true}
          style={styles.locationPContainer}
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
        <View style={{width: '90%', alignSelf: 'center'}}>
          <View style={styles.operatorBox}>
            <Image
              resizeMode="cover"
              source={Images.op}
              style={styles.supliericon}
            />
            <View>
              <Text style={{color: '#7F7F7F', fontSize: 16}}>
                Operator Details
              </Text>
              <Text style={{marginTop: 5}}>
                <Text style={{fontWeight: '600'}}>Name: </Text>
                {bookinDetails?.bid?.operator?.name}
              </Text>
            </View>
          </View>
          <View style={styles.operatorBox}>
            <Image
              resizeMode="cover"
              source={Images.sup}
              style={styles.supliericon}
            />
            <View>
              <Text style={{color: '#7F7F7F', fontSize: 16}}>
                Supplier Details
              </Text>
              <Text style={{marginTop: 5}}>
                <Text style={{fontWeight: '600'}}>Name: </Text>
                {bookinDetails?.bid?.supplier?.name}
              </Text>
              <Text style={{marginTop: 5}}>
                <Text style={{fontWeight: '600'}}>Equipment Reg. No: </Text>
                {bookinDetails?.bid?.equipment?.registration_number}
              </Text>
            </View>
          </View>

          <View style={styles.operatorBox}>
            <Image
              resizeMode="cover"
              source={Images.sup}
              style={styles.supliericon}
            />
            <View>
              <Text style={{color: '#7F7F7F', fontSize: 16}}>
                Customer Details
              </Text>
              <Text style={{marginTop: 5}}>
                <Text style={{fontWeight: '600'}}>Name: </Text>
                {bookinDetails?.customer_name}
              </Text>
              {/* <Text style={{marginTop: 5}}>
                <Text style={{fontWeight: '600'}}>Phone Number: </Text>
                {bookinDetails?.customer_phone}
              </Text> */}
            </View>
          </View>
        </View>
        <View style={styles.bidsView}>
          <View style={styles.bidHeader}>
            <Text style={{...styles.Allbids, textAlign: 'center'}}>
              Details
            </Text>

            <View style={styles.Requirementbox}>
              <View>
                <Text style={{...styles.reqHeadtext, fontSize: wp(4)}}>
                  Total Requirement
                </Text>
                <Text
                  style={{
                    ...styles.reqHeadtext,
                    textAlign: 'center',
                    marginTop: 5,
                  }}>
                  {bookinDetails?.bid?.total_requirements}
                </Text>
              </View>
              <View>
                <Text style={{...styles.reqHeadtext, fontSize: wp(4)}}>
                  Fulfilled Requirement
                </Text>
                <Text
                  style={{
                    ...styles.reqHeadtext,
                    textAlign: 'center',
                    marginTop: 5,
                  }}>
                  {' '}
                  {bookinDetails?.bid?.fulfilled_requirements}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              ...styles.documentView,
            }}>
            <View
              style={{
                flexDirection: 'row',
                borderBottomWidth: 1,
                borderColor: '#fff',
                marginBottom: 5,
                alignItems: 'center',
              }}>
              <Ionicons
                name="md-document-attach-sharp"
                color={'#fff'}
                size={25}
              />
              <Text
                style={{
                  fontSize: hp(3),
                  color: '#fff',
                  left: 5,
                  // '#7F7F7F'
                }}>
                Document
              </Text>
            </View>
            {bookinDetails?.bid?.equipment?.documents?.length == 0 ? (
              <Text style={{...styles.reqHeadtext}}>
                No Attachment Available
              </Text>
            ) : null}

            <ScrollView
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}>
              {console.log(documents?.length)}
              {documents?.length > 0 &&
                documents?.map(item => {
                  return (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => {
                        if (item?.attachments?.length == 1) {
                          setAttachments(item?.attachments);
                          setswiperModal(true);
                        } else {
                          setAttachments(item?.attachments);
                          setattachmentModal(!attachmentModal);
                        }
                      }}>
                      <View
                        style={{
                          borderColor: '#fff',
                          marginVertical: 5,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <View style={{borderColor: '#fff'}}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Ionicons
                              name="md-document-attach-sharp"
                              color={'#fff'}
                              size={20}
                            />
                            <Text style={{...styles.reqHeadtext, left: 8}}>
                              {item?.name}
                            </Text>
                          </View>
                          {item?.has_expiry && (
                            <Text
                              style={{
                                ...styles.reqHeadtext,
                                marginLeft: wp(8),
                                fontSize: hp(1.8),
                                fontWeight: '500',
                              }}>
                              Expirey Date :{' '}
                              {moment(item?.expiry_date).format('MMM d, YYYY')}
                            </Text>
                          )}
                        </View>
                        {/* <Text style={{...styles.reqHeadtext}}>
                      Created Date :{' '}
                      {moment(item?.created_at).format('MMM d, YYYY')}
                    </Text> */}

                        <Ionicons
                          name="download-outline"
                          size={28}
                          color={'#fff'}
                        />
                      </View>
                    </TouchableOpacity>
                  );
                })}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      <Modal
        animationIn="slideInUp"
        isVisible={attachmentModal}
        onBackButtonPress={() => {
          setattachmentModal(!attachmentModal);
        }}
        onBackdropPress={() => {
          setattachmentModal(!attachmentModal);
        }}>
        {/* {onPress={async () => await Linking.openURL(item?.url)}} */}
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{...styles.reqHeadtext, marginVertical: 10}}>
              Attachments
            </Text>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{alignSelf: 'center'}}>
              {attachments?.map((item, index) => {
                return (
                  <TouchableOpacity
                    onPress={async () => {
                      setdocumentIndex(index);
                      setswiperModal(true);
                    }}
                    style={styles.attachmentView}>
                    <Text style={{fontSize: 16, color: 'black'}}>
                      attachment {index + 1}
                    </Text>
                    <Ionicons
                      name="download-outline"
                      size={28}
                      color={'#000'}
                    />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <ImageModal
        animationType="slide"
        transparent={true}
        visible={pagerModal}
        onRequestClose={() => {
          setpagerModal(!pagerModal);
        }}>
        {/* {onPress={async () => await Linking.openURL(item?.url)}} */}

        {bookinDetails?.bid?.equipment?.images.length > 0 && (
          <ImageViewer
            enableSwipeDown={true}
            onSwipeDown={() => {
              setpagerModal(!pagerModal);
            }}
            imageUrls={bookinDetails?.bid?.equipment?.images}
          />
        )}
      </ImageModal>

      <Modalize
        ref={modalizeRef}
        panGestureEnabled={false}
        withHandle={false}
        closeOnOverlayTap={false}
        // onPositionChange={c => setcheckP(c)}
        modalHeight={hp(100)}
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
            <TouchableOpacity onPress={() => modalizeRef.current.close()}>
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
            // onMapReady={onRegionChangeComplete}
            style={{
              height: hp(95),
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
              title={`${currenttime?.toFixed(1)} min `}
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
                {booking?.location_b_latitude && booking?.location_b_longitude && (
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
                )}
              </>
            )}
            {currentLoc && fittoCordinate(currentLoc)}
          </MapView>
          {currentLoc && fittoCordinate(currentLoc)}
        </View>
      </Modalize>
      <Modal
        animationIn="slideInUp"
        isVisible={swiperModal}
        onBackButtonPress={() => {
          setswiperModal(false);
        }}
        onBackdropPress={() => {
          setswiperModal(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView1}>
            <View
              style={{
                width: wp(90),
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View style={{width: 24}} />
              <Text style={{...styles.reqHeadtext, marginVertical: 10}}>
                Documents
              </Text>

              <TouchableOpacity onPress={() => setswiperModal(false)}>
                <Ionicons name="ios-close-circle" size={28} />
              </TouchableOpacity>
            </View>

            <Swiper
              // scrollEnabled={false}

              index={documentIndex}
              // showsButtons={true}
              buttonWrapperStyle={{
                backgroundColor: 'transparent',
                flexDirection: 'row',
                position: 'absolute',
                paddingHorizontal: 10,
                paddingVertical: 10,
                // justifyContent: 'space-between',
                alignItems: 'center',
                borderWidth: 1,
              }}
              showsPagination={false}>
              {attachments?.map((item, index) => {
                if (/\.(jpg|jpeg|png|webp|avif|gif|jfif)$/.test(item.url)) {
                  return (
                    <View
                      style={{
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <FastImage
                        style={{
                          width: wp(90),
                          height: '100%',
                          resizeMode: 'contain',
                        }}
                        source={{
                          uri: item?.url,
                          priority: FastImage.priority.high,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                      />
                    </View>
                  );
                } else if (/\.(pdf)$/.test(item.url)) {
                  console.log(item);

                  return (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                      }}>
                      <Pdf
                        trustAllCerts={false}
                        source={{uri: item?.url, cache: true}}
                        onLoadComplete={(numberOfPages, filePath) => {
                          // console.log(`Number of pages: ${numberOfPages}`);
                        }}
                        onPageChanged={(page, numberOfPages) => {
                          // console.log(`Current page: ${page}`);
                        }}
                        onError={error => {
                          console.log(error);
                        }}
                        style={{width: wp(90), height: '100%'}}
                      />
                    </View>
                  );
                } else {
                  <Text
                    style={{
                      fontSize: hp(3),
                      color: '#000',
                      textAlign: 'center',
                      fontWeight: '500',
                    }}>
                    Not Supported Document
                  </Text>;
                }
              })}
            </Swiper>
          </View>
        </View>
      </Modal>
      {/* {loading && <FSLoader />} */}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  modalView1: {
    backgroundColor: 'white',
    // borderRadius: 20,
    width: wp(100),
    height: hp(100),
    alignItems: 'center',
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: wp(80),
    height: hp(40),
    alignItems: 'center',
  },
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
  bookinginfoContainer: {
    borderWidth: 0.1,
    borderLeftWidth: 4,
    borderColor: '#4E8B54',
    backgroundColor: '#E6F5EA',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp(90),
    marginVertical: 20,
    height: hp(8),
    alignItems: 'center',
  },
  locationPContainer: {
    borderColor: '#E6E6E6',
    flexDirection: 'row',
    width: wp(90),
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
  container: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  backButtonView: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  locationView: {
    backgroundColor: Colors.White,
    padding: 10,
    marginTop: 5,
    borderRadius: 10,
    elevation: 5,
    width: wp(95),
    // height:hp(5)
  },

  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.White,
    padding: 10,
    marginTop: 5,
    borderRadius: 10,
    elevation: 5,
    width: wp(95),
  },
  // bidsView: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  //   marginTop: 20,
  // },
  Info: {
    backgroundColor: Colors.White,
    padding: 10,
    marginTop: 5,
    borderRadius: 10,
    elevation: 5,
  },
  modal: {
    // flex:1,
    backgroundColor: '#fff',
    height: '40%',
    borderRadius: 12,
    alignItems: 'center',
  },
  modalheading: {
    marginTop: 15,
    fontWeight: '700',
    fontSize: 15,
  },
  plist: {
    marginTop: 15,
    alignSelf: 'flex-start',
    left: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ptext: {
    color: '#000',
    fontSize: 15,
    left: 8,
  },
  requirementtxt: {
    color: 'white',
    textAlign: 'center',
  },
  statusBox: {
    backgroundColor: '#4E8B54',
    borderRadius: 7,
    marginBottom: 5,
    paddingHorizontal: 4,
    paddingVertical: 1,
    flexDirection: 'row',
    alignItems: 'center',
    right: 5,
  },
  operatorBox: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E6E8F0',
    paddingVertical: 20,
  },
  supliericon: {
    width: hp(8),
    height: hp(8),
    marginRight: 15,
  },
  bidsView: {
    width: wp(100),
    height: 'auto',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: Colors.Black,
    alignItems: 'center',
  },
  bidHeader: {
    flexDirection: 'column',
    marginVertical: 20,
  },
  Requirementbox: {
    flexDirection: 'row',
    width: wp(100),
    marginTop: 15,
    justifyContent: 'space-around',
  },
  reqHeadtext: {
    fontWeight: 'bold',
    color: '#7F7F7F',
    marginVertical: 2,
    fontSize: hp(2.2),
  },
  Allbids: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 22,
  },
  documentView: {
    // borderWidth: 1,
    // borderColor: '#fff',
    alignSelf: 'center',
    width: wp(90),
    height: 'auto',
    minHeight: hp(20),
    maxHeight: hp(30),
    marginBottom: 20,
  },
  attachmentView: {
    width: wp(75),
    padding: 5,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 2,
  },
});

export default DetailComponent;

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
