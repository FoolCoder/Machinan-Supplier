import React, {useEffect, useRef, useState} from 'react';

import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  LogBox,
  ActivityIndicator,
  PermissionsAndroid,
  PanResponder,
  Alert,
} from 'react-native';
import AlertModal from '../../components/AlertModal';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import Colors from '../../utils/Colors';
import Constants from '../../utils/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Global from '../../utils/Global';
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-crop-picker';
import Images from '../../utils/Images';
import Api from '../../utils/Api';
import auth from '@react-native-firebase/auth';
import {
  setSupplierDashBoard,
  setUserInfo,
  setUserType,
} from '../../redux/reducer';
import FSLoader from '../../components/FSLoader';
import {CommonActions, StackActions} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

LogBox.ignoreAllLogs();
const Account = ({navigation}) => {
  const dispatch = useDispatch();
  const dashreducer = useSelector(state => state.dashboardReducer);
  const {userInfo} = dashreducer;
  const [imageOptionsModal, setImageOptionsModal] = useState(false);
  const [photoUri, setPhotoUri] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [malert, setMalert] = useState('');
  const [status, setStatus] = useState('Successful');
  const [screen, setScreen] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // resetInactivityTimeout()
  }, []);

  const openGallery = async (item, index) => {
    const img = await ImagePicker.openPicker({
      mediaType: 'photo',
      cropping: true,
      cropperCircleOverlay: true,
      forceJpg: true,
      width: 300,
      height: 300,
      // compressImageQuality: 0,
    });
    setPhotoUri(img.path);
    setImageOptionsModal(false);
    let photo = {
      uri: Platform.OS === 'ios' ? `file:///${img.path}` : img.path,
      type: img.mime,
      name:
        Platform.OS === 'ios'
          ? img['filename']
          : `my_profile_${Date.now()}.${
              img['mime'] === 'image/jpeg' ? 'jpg' : 'png'
            }`,
      size: img.size,
    };
    savePicture(photo);

    // const uri = await ImgToBase64.getBase64String(img.path);
    // setList(st => st.map((e, i) => (i == index ? { ...e, uri: uri } : e)))
    // setSelectedImage(uri)
  };

  const openCamera = async (item, index) => {
    const img = await ImagePicker.openCamera({
      mediaType: 'photo',
      cropping: true,
      cropperCircleOverlay: true,
      forceJpg: true,
      width: 300,
      height: 300,
      // compressImageQuality: 0,
    });
    setPhotoUri(img.path);
    setImageOptionsModal(false);
    let photo = {
      uri: Platform.OS === 'ios' ? `file:///${img.path}` : img.path,
      type: img.mime,
      name:
        Platform.OS === 'ios'
          ? img['filename']
          : `my_profile_${Date.now()}.${
              img['mime'] === 'image/jpeg' ? 'jpg' : 'png'
            }`,
      size: img.size,
    };
    savePicture(photo);

    // const uri = await ImgToBase64.getBase64String(img.path);
    // setList(st => st.map((e, i) => (i == index ? { ...e, uri: uri } : e)))
    // setSelectedImage(uri)
  };

  const savePicture = photo => {
    setLoading(true);
    let type = 'supplier';
    Api.updateprofile(userInfo.token, type, photo)
      .then(res => {
        if (res.response == 101) {
          let updatedUser = {...userInfo, user: res.data};
          dispatch(setUserInfo(updatedUser));
        }
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
        Alert.alert('Error', e.message);
      });
  };

  const AlertNav = async () => {
    setLoading(true);
    auth()
      .signOut()
      .then(() => {
        dispatch(setUserInfo(null));
        dispatch(setUserType(null));
        dispatch(setSupplierDashBoard(null));
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{name: 'AuthStack'}],
          }),
        );
        setLoading(false);
      })
      .catch(e => Alert.alert('Error', e.message));
  };

  return (
    <>
      {Constants.IS_ANDROID ? (
        <StatusBar
          backgroundColor={Colors.Primary}
          barStyle={'light-content'}
        />
      ) : (
        <SafeAreaView>
          <StatusBar barStyle={'dark-content'} />
        </SafeAreaView>
      )}

      <SafeAreaView style={styles.container}>
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => setImageOptionsModal(true)}
            style={{
              alignSelf: 'center',
              marginTop: Global.SCREEN_HEIGHT * 0.1,
            }}>
            {userInfo?.user?.photo || photoUri ? (
              <FastImage
                style={styles.image}
                source={{
                  uri: photoUri ? photoUri : userInfo?.user?.photo,
                  priority: FastImage.priority.high,
                }}
                resizeMode={FastImage.resizeMode.contain}
              />
            ) : (
              <Image
                source={Images.Placeholder}
                resizeMode={'contain'}
                style={styles.image}
              />
            )}
            {/* <Image
              source={photoUri == '' ? Images.Placeholder : {uri: photoUri}}
              resizeMode={'contain'}
              style={styles.image}
            /> */}
            <View style={styles.headerbtn}>
              <Feather name={'edit-2'} color={Colors.White} size={12} />
            </View>
          </TouchableOpacity>

          <Text style={{fontWeight: 'bold', fontSize: 16, marginTop: 10}}>
            {userInfo?.user.name}
          </Text>
          <Text style={{}}>{userInfo?.user.phone}</Text>
        </View>

        <ScrollView style={{marginTop: Global.SCREEN_HEIGHT * 0.1}}>
          <TouchableOpacity
            style={styles.updatecontainer}
            onPress={() => {
              Alert.alert('Machinan', 'Feature coming soon');
              // navigation.navigate('UpdatePassword')
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Feather name={'lock'} size={16} color={Colors.Primary} />
              <Text style={{paddingLeft: 10}}>Update Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutconatainer}
            onPress={() => {
              setStatus('Successful');
              setMalert('Are you sure you want to logout?');
              setScreen('Screen');
              setModalVisible(true);
              // Alert.alert('Machinan', 'Are you sure you want to logout?', [
              //   {text: 'Cancel'},
              //   {
              //     text: 'OK',
              //     onPress: () => {
              //       AsyncStorage.removeItem('userInfo').then(() => {
              //         dispatch(setUserInfo(null));
              //         dispatch(setUserType(null));
              //         auth().signOut();
              //         navigation.navigate('AuthStack', {
              //           screen: 'Welcome',
              //         });
              //       });
              //     },
              //   },
              // ]);
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Feather name={'log-out'} size={16} color={Colors.Primary} />
              <Text style={{paddingLeft: 10}}>Logout</Text>
            </View>
            {/* <Ionicons name='chevron-forward' size={20} /> */}
          </TouchableOpacity>
        </ScrollView>

        <Modal
          isVisible={imageOptionsModal}
          animationIn="slideInUp"
          coverScreen={true}
          style={{
            margin: 0,
            position: 'absolute',
            bottom: 0,
            width: Global.SCREEN_WIDTH,
          }}
          onBackButtonPress={() => setImageOptionsModal(false)}
          onBackdropPress={() => setImageOptionsModal(false)}>
          <View style={styles.pickercontainer}>
            <TouchableOpacity
              onPress={() => openCamera()}
              style={{alignItems: 'center', margin: 20}}>
              <Image
                source={Images.CameraIcon}
                resizeMode={'contain'}
                style={styles.picker}
              />
              <Text style={{marginTop: 10, fontWeight: 'bold'}}>
                From Camera
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => openGallery()}
              style={{alignItems: 'center', margin: 20}}>
              <Image
                source={Images.GalleryIcon}
                resizeMode={'contain'}
                style={styles.picker}
              />
              <Text style={{marginTop: 10, fontWeight: 'bold'}}>
                From Gallery
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
        {modalVisible && (
          <AlertModal
            setModalVisible={setModalVisible}
            modalVisible={modalVisible}
            screen={screen}
            status={status}
            msg={malert}
            navigation={AlertNav}
          />
        )}
      </SafeAreaView>
      {loading && <FSLoader />}
    </>
  );
};

export default Account;

const styles = StyleSheet.create({
  image: {
    width: 120,
    height: 120,
    borderRadius: 120,
    borderWidth: 5,
    borderColor: Colors.Primary,
  },
  headerbtn: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: Colors.Gray,
    width: 25,
    height: 25,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updatecontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomColor: Colors.Gray,
    borderBottomWidth: 0.5,
    alignItems: 'center',
  },
  pickercontainer: {
    backgroundColor: Colors.White,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  picker: {
    width: 60,
    height: 60,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: Colors.White,
  },
  logoutconatainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomColor: Colors.Gray,
    borderBottomWidth: 0.5,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.White,
    padding: 16,
  },
  locationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.DarkerOpacity,
  },
});
