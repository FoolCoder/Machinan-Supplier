import Api from '../../utils/Api';
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
  Switch,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import {hp, wp} from '../../components/Responsive';
import {useSelector} from 'react-redux';
import {Modalize} from 'react-native-modalize';
import MapView, {Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import moment from 'moment/moment';
import Modal from 'react-native-modal';
import ImageViewer from 'react-native-image-zoom-viewer';
import FSLoader from '../../components/FSLoader';
import Swiper from 'react-native-swiper';
import Pdf from 'react-native-pdf';
import Loader from '../../components/Loader';
import FastImage from 'react-native-fast-image';
import {Alert} from 'react-native';

const OperatorRiggerDetail = ({route, navigation}) => {
  const {id, type} = route.params;
  const [detail, setDetail] = useState(null);
  const dashboardReducer = useSelector(state => state.dashboardReducer);
  const {userInfo} = dashboardReducer;
  const scrollViewRef = useRef();
  const [attachmentModal, setattachmentModal] = useState(false);
  const [attachments, setAttachments] = useState(null);
  const [showpro, setShowpro] = useState(false);
  const [loading, setLoading] = useState(false);
  const [documentIndex, setdocumentIndex] = useState(0);
  const [swiperModal, setswiperModal] = useState(false);
  const [pagerModal, setpagerModal] = useState(false);
  const [equipment, setequipment] = useState(null);
  const [assignedEquipment, setassignedEquipment] = useState(null);
  const [assignEquipmentmodal, setassignEquipmentmodal] = useState(false);

  useEffect(() => {
    operatordetails();
    getEquipment();
  }, [id, type]);
  const operatordetails = () => {
    setLoading(true);
    Api.getRiggerOperatorDet(id, type, userInfo.token)
      .then(res => {
        if (res.response === 101) {
          setDetail(res.data);

          setLoading(false);
        }
      })
      .catch(e => {
        setLoading(false);
        Alert.alert('Error', e.message);
      });
  };
  const getEquipment = () => {
    Api.getEquipment(id, userInfo.token)
      .then(res => {
        if (res.response === 101) {
          setequipment(res?.data);
        }
      })
      .catch(e => {
        Alert.alert('Error', e.message);
      });
  };
  const bidAllowed = () => {
    setLoading(true);
    Api.allowedBid(id, !detail.bid_allowed, userInfo.token)
      .then(res => {
        if (res.response === 101) {
          operatordetails();
        }
      })
      .catch(e => {
        setLoading(false);
        Alert.alert('Error', e.message);
      });
  };
  const removeEquipment = equipmentId => {
    setLoading(true);
    Api.removeEquipment(id, equipmentId, userInfo.token)
      .then(res => {
        if (res.response === 101) {
          operatordetails(), getEquipment();
        }
      })
      .catch(e => {
        setLoading(false);
        Alert.alert('Error', e.message);
      });
  };
  const assignEquipment = equipmentId => {
    setassignEquipmentmodal(false);
    setassignedEquipment(null);
    setLoading(true);
    Api.assignEquipment(id, assignedEquipment?.id, userInfo.token)
      .then(res => {
        if (res.response === 101) {
          operatordetails();
        }
      })
      .catch(e => {
        setLoading(false);
        Alert.alert('Error', e.message);
      });
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backButtonView}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{position: 'absolute', left: 20}}>
          <Ionicons name="chevron-back" size={24} />
        </TouchableOpacity>
        <Text style={{fontWeight: 'bold', fontSize: 20}}>Detail</Text>
      </View>
      {type == 'Operator' && detail && (
        <View style={{...styles.bidAllow}}>
          <Text
            style={{
              fontSize: hp(2),
              fontWeight: '500',
            }}>
            Allowed Bid
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: hp(2),
                fontWeight: '500',
              }}>
              {detail?.bid_allowed ? 'ON' : 'OFF'}
            </Text>
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={detail?.bid_allowed ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={bidAllowed}
              value={detail?.bid_allowed}
            />
          </View>
        </View>
      )}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{alignItems: 'center'}}
        showsVerticalScrollIndicator={false}>
        {detail && (
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
                  {type} Info
                </Text>
                <Text style={{fontWeight: '600', fontSize: 18}}>
                  {detail?.name}
                </Text>
                <Text style={{fontWeight: '600', fontSize: 16}}>
                  {detail?.phone}
                </Text>
              </View>
              <Image
                style={styles.productLeft}
                resizeMode="contain"
                source={
                  detail?.photo ? {uri: detail?.photo} : Images.Placeholder
                }
              />
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
                {detail?.equipment?.images?.length > 0 &&
                  detail?.equipment?.images?.map(item => {
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
        )}

        <View style={{width: '90%', alignSelf: 'center'}}>
          {detail?.equipment ? (
            <View
              style={{
                ...styles.operatorBox,
                marginTop: 8,
              }}>
              <View>
                <Text style={{color: '#7F7F7F', fontSize: 18}}>Equipment</Text>
                <Text style={{marginTop: 5}}>
                  <Text style={{fontWeight: '600'}}>Name: </Text>
                  {detail?.equipment?.product?.name?.en}
                </Text>
                <Text style={{marginTop: 5}}>
                  <Text style={{fontWeight: '600'}}>Registration: </Text>
                  {detail?.equipment?.registration_number}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => removeEquipment(detail?.equipment?.id)}
                style={{...styles.btn}}>
                <Text
                  style={{
                    color: Colors.White,
                    fontSize: hp(2),
                    fontWeight: '500',
                  }}>
                  Remove Equipment
                </Text>
              </TouchableOpacity>
            </View>
          ) : equipment?.length > 0 ? (
            <TouchableOpacity
              onPress={() => setassignEquipmentmodal(true)}
              style={{...styles.Addbtn}}>
              <Text
                style={{
                  color: Colors.White,
                  fontSize: hp(2),
                  fontWeight: '500',
                }}>
                Add Equipment
              </Text>
            </TouchableOpacity>
          ) : null}
          {detail?.products?.length > 0 && (
            <View style={styles.operatorBox}>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{color: '#7F7F7F', fontSize: 18}}>
                    Allowed Products
                  </Text>
                  <TouchableOpacity onPress={() => setShowpro(!showpro)}>
                    <Text
                      style={{
                        textDecorationLine: 'underline',
                        alignSelf: 'flex-end',
                        marginRight: 5,
                      }}>
                      {showpro ? 'View Less' : ' View All'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.productcard}>
                  <Text style={{marginTop: 5}}>
                    <Text style={{fontWeight: '600'}}>Name: </Text>
                    {detail?.products[0]?.name?.en}
                  </Text>
                  <Text style={{marginTop: 5}}>
                    <Text style={{fontWeight: '600'}}>Capacity: </Text>
                    {detail?.products[0]?.product_capacity}
                  </Text>
                </View>

                {showpro &&
                  detail?.products?.map((item, index) => {
                    if (index == 0) return;
                    return (
                      <View key={item.id} style={styles.productcard}>
                        <Text style={{marginTop: 5}}>
                          <Text style={{fontWeight: '600'}}>Name: </Text>
                          {item.name?.en}
                        </Text>
                        <Text style={{marginTop: 5}}>
                          <Text style={{fontWeight: '600'}}>Capacity: </Text>
                          {item.product_capacity}
                        </Text>
                      </View>
                    );
                  })}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      {detail?.documents?.length > 0 && (
        <View style={styles.bidsView}>
          <View style={styles.bidHeader}>
            <Text style={{...styles.Allbids, textAlign: 'center'}}>
              Documents
            </Text>
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
            {detail?.documents.length == 0 ? (
              <Text style={{...styles.reqHeadtext}}>
                No Attachment Available
              </Text>
            ) : null}
            <ScrollView
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}>
              {detail?.documents?.map(item => {
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => {
                      if (item?.attachments.length == 1) {
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
      )}

      {attachmentModal && (
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
                      key={index}
                      onPress={
                        async () => {
                          setdocumentIndex(index);
                          setswiperModal(true);
                        }
                        // await Linking.openURL(item?.url)
                      }
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
      )}

      {pagerModal && (
        <ImageModal
          animationType="slide"
          transparent={true}
          visible={pagerModal}
          onRequestClose={() => {
            setpagerModal(!pagerModal);
          }}>
          {/* {onPress={async () => await Linking.openURL(item?.url)}} */}

          {detail?.equipment?.images?.length > 0 && (
            <ImageViewer
              enableSwipeDown={true}
              onSwipeDown={() => {
                setpagerModal(!pagerModal);
              }}
              imageUrls={detail?.equipment?.images}
            />
          )}
        </ImageModal>
      )}

      {swiperModal && (
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
                        key={index}
                        style={{
                          alignSelf: 'center',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <FastImage
                          style={{
                            width: wp(90),
                            height: '100%',
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
                    return (
                      <View
                        key={index}
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
      )}
      {assignEquipmentmodal && (
        <Modal
          animationIn="slideInUp"
          isVisible={assignEquipmentmodal}
          onBackButtonPress={() => {
            setassignEquipmentmodal(!assignEquipmentmodal);
          }}
          onBackdropPress={() => {
            setassignEquipmentmodal(!assignEquipmentmodal);
          }}>
          {/* {onPress={async () => await Linking.openURL(item?.url)}} */}
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={{...styles.reqHeadtext, marginVertical: 10}}>
                Select Equipment
              </Text>
              {equipment?.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={
                      () => {
                        if (assignedEquipment?.id == item?.id) {
                          setassignedEquipment(null);
                        } else {
                          setassignedEquipment(item);
                        }
                      }
                      // await Linking.openURL(item?.url)
                    }
                    style={{
                      ...styles.equipmentView,
                      backgroundColor:
                        assignedEquipment == item
                          ? Colors.LightGray
                          : undefined,
                    }}>
                    <Text style={{marginTop: 5}}>
                      <Text style={{fontWeight: '600'}}>Name: </Text>
                      {item?.product?.name?.en}
                    </Text>
                    <Text style={{marginTop: 5}}>
                      <Text style={{fontWeight: '600'}}>Brand: </Text>
                      {item?.brand}
                    </Text>
                    <Text style={{marginTop: 5}}>
                      <Text style={{fontWeight: '600'}}>Registration: </Text>
                      {item?.registration_number}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              <TouchableOpacity
                onPress={() => assignEquipment()}
                disabled={assignedEquipment ? false : true}
                style={{
                  ...styles.Addbtn,
                  width: wp(50),
                  alignItems: 'center',
                  position: 'absolute',
                  bottom: 8,
                  backgroundColor: assignedEquipment
                    ? Colors.Black
                    : Colors.Gray,
                }}>
                <Text
                  style={{
                    color: Colors.White,
                    fontWeight: '500',
                    fontSize: hp(2.2),
                    textAlign: 'center',
                  }}>
                  Assign
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
      {loading && <FSLoader />}
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
  close: {
    alignSelf: 'flex-end',
    right: 15,
    backgroundColor: '#000',
    width: 25,
    height: 25,
    alignItems: 'center',
    borderRadius: 6,
    justifyContent: 'center',
  },
  bidAllow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp(88),
    alignSelf: 'center',
    backgroundColor: Colors.LightGray,
    borderRadius: 8,
    padding: 5,
    alignItems: 'center',
    marginBottom: 5,
  },
  btn: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'auto',
    height: hp(6),
    backgroundColor: Colors.Black,
    borderRadius: hp(6) / 2,
    padding: 10,
    top: hp(1.5),
    right: wp(2),
    position: 'absolute',
  },
  Addbtn: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(86),
    height: hp(7),
    backgroundColor: Colors.Black,
    borderRadius: hp(7) / 2,
    padding: 10,
    marginVertical: 8,
  },
  productcard: {
    width: wp(90),
    height: hp(10),
    backgroundColor: Colors.White,
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
    padding: 10,
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
    borderTopColor: '#E6E8F0',
    paddingVertical: 20,
    borderTopWidth: 0.5,
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
  equipmentView: {
    width: '95%',
    padding: 5,
    alignSelf: 'center',
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 2,
  },
});

export default OperatorRiggerDetail;
