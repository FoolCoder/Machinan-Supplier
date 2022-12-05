import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import React from 'react';
import {hp, wp} from './Responsive';
import {Modalize} from 'react-native-modalize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from './Button';
import Colors from '../utils/Colors';
import Images from '../utils/Images';
import ImageViewer from 'react-native-image-zoom-viewer';
import {useState} from 'react';
import Loader from './Loader';

const OEselectionmodal = ({OEref, type, biddableData, selectval, val}) => {
  const [detail, setDetail] = useState(null);
  const [pagerModal, setpagerModal] = useState(false);
  const SelectPasses = item => {
    if (val.some(e => e.id === item.id)) {
      const newList = val.filter(i => i.id != item.id);
      selectval(newList);
    } else {
      selectval([...val, item]);
    }
  };
  return (
    <>
      <Modalize
        ref={OEref}
        panGestureEnabled={true}
        withHandle={true}
        closeOnOverlayTap={true}
        modalHeight={hp(60)}
        keyboardAvoidingBehavior="height"
        scrollViewProps={{
          keyboardShouldPersistTaps: 'always',
        }}
        handleStyle={styles.handleStyle}
        modalStyle={styles.modalStyle}
        FooterComponent={
          <TouchableOpacity
            style={styles.btn}
            onPress={() => OEref.current.close()}>
            <Text style={{color: 'black', fontSize: hp(2.5)}}>Select</Text>
          </TouchableOpacity>
        }
        HeaderComponent={
          <>
            <View style={styles.headercomponent}>
              <Image
                source={
                  type == 'Equipment' ? Images.Equipment : Images.Operator
                }
                resizeMode="contain"
                style={styles.gateimg}
              />
              <Text style={{fontSize: 20, color: 'white'}}>Select {type}</Text>
            </View>
            <View
              style={{
                width: '93%',
                borderWidth: 0.5,
                borderColor: '#3F4044',
                alignSelf: 'center',
              }}
            />
          </>
        }>
        <View style={styles.container}>
          <View style={{marginVertical: 30}}>
            {biddableData?.map((item, index) => {
              if (type == 'Riggers') {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      SelectPasses(item);
                    }}
                    style={styles.item}>
                    <Text style={{color: 'white'}}>
                      {item.name ? item.name : item.product?.name?.en}
                    </Text>
                    {val.some(i => i.id == item.id) && (
                      <View style={styles.dot}></View>
                    )}
                  </TouchableOpacity>
                );
              } else {
                return (
                  <View key={index} style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                      onPress={() => {
                        selectval(item);
                      }}
                      style={styles.item}>
                      <View>
                        <Text style={{color: 'white'}}>
                          {item.name ? item.name : item.product?.name?.en}
                        </Text>
                        {item.name ? null : (
                          <Text style={{color: Colors.LightGray, fontSize: 13}}>
                            {`${item.product?.product_capacity} ${item?.brand} ${item?.model_year}`}
                          </Text>
                        )}
                      </View>

                      {item.id == val?.id && <View style={styles.dot}></View>}
                    </TouchableOpacity>
                    {item.name
                      ? null
                      : item?.images?.length > 0 && (
                          <TouchableOpacity
                            // disabled={item?.images?.length == 0 ? true : false}
                            onPress={() => {
                              setDetail(item);
                              setpagerModal(true);
                            }}
                            style={{
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginHorizontal: 10,
                            }}>
                            <Ionicons name="images" size={28} color="white" />
                          </TouchableOpacity>
                        )}
                  </View>
                );
              }
            })}
          </View>
        </View>
      </Modalize>
      <Modal
        animationType="slide"
        transparent={true}
        visible={pagerModal}
        onRequestClose={() => {
          setpagerModal(!pagerModal);
        }}>
        {detail?.images?.length > 0 && (
          <ImageViewer
            enableSwipeDown={true}
            onSwipeDown={() => {
              setpagerModal(!pagerModal);
            }}
            imageUrls={detail?.images}
            loadingRender={() => <Loader />}
          />
        )}
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  btn: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: '70%',
    height: hp(7),
    backgroundColor: 'white',
    borderRadius: hp(7) / 2,
    marginBottom: 25,
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
    width: '100%',
    marginHorizontal: 10,
  },
  handleStyle: {
    alignSelf: 'center',
    width: 45,
    height: 5,
    borderRadius: 5,
    backgroundColor: '#040415',
  },
  modalStyle: {
    height: hp(50),
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: Colors.Black,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  headerText: {
    color: Colors.White,
    fontWeight: '700',
    fontSize: 16,
  },
  container: {
    backgroundColor: Colors.Black,
    margin: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 0.5,
    borderColor: Colors.LightGray,
  },
  dot: {
    backgroundColor: Colors.Primary,
    width: 10,
    height: 10,
    borderRadius: 10,
  },
  gateimg: {
    width: 43,
    height: 43,
  },
  headercomponent: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: '25%',
  },
});

export default OEselectionmodal;
