import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Button from '../components/Button';
import Colors from '../utils/Colors';
import Global from '../utils/Global';
import Images from '../utils/Images';
import CountryPicker from 'react-native-country-picker-modal';
import Api from '../utils/Api';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import auth from '@react-native-firebase/auth';
import {setUserType, setUserInfo} from '../redux/reducer';
import Loader from '../components/Loader';
import FSLoader from '../components/FSLoader';
import AlertModal from '../components/AlertModal';
import {CommonActions} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {hp} from '../components/Responsive';
const Register = ({navigation, route}) => {
  const dispatch = useDispatch();
  const dashreducer = useSelector(state => state.dashboardReducer);
  const {userInfo, userType} = dashreducer;
  const {type} = route.params;
  const [selectedCountry, setSelectedCountry] = useState({
    callingCode: ['974'],
    cca2: 'QA',
    currency: ['QAR'],
    flag: 'flag-qa',
    name: 'Qatar',
    region: 'Asia',
    subregion: 'Western Asia',
  });
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState(null);
  // const [code, setCode] = useState('')
  const [verifyModal, setVerifyModal] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [malert, setMalert] = useState('');
  const [status, setStatus] = useState('Successful');
  const [screen, setScreen] = useState('');
  const [count, setCount] = useState(0);
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  const checkPhone = async (num, t) => {
    if (!num) {
      return;
    }
    // auth().onAuthStateChanged(onAuthStateChanged);
    setLoading(true);
    Api.checkPhoneSupplier(num, userType)
      .then(res => {
        if (res.response == 101) {
          dispatch(setUserInfo(res.data));
          // dispatch(setUserType(res.data.account_type));
          // if (userType == 'Supplier') {
          //   navigation.dispatch(
          //     CommonActions.reset({
          //       index: 0,
          //       routes: [{name: 'SupplierNavigator'}],
          //     }),
          //   );
          // } else {
          //   navigation.dispatch(
          //     CommonActions.reset({
          //       index: 0,
          //       routes: [{name: 'OperatorNavigator'}],
          //     }),
          //   );
          // }
          Api.getDashboardData(
            res?.data?.token,
            userType,
            navigation,
            dispatch,
          );
          setLoading(false);
        } else {
          setLoading(false);
          setStatus('Failure');
          setMalert(
            res.message + ' Kindly register yourself through our portal',
          );
          setModalVisible(true);

          return;
        }
      })
      .catch(e => {
        console.log(e);
        setLoading(false);
        setStatus('Failure');
        setMalert('Something went wrong, Check your Network');
        setModalVisible(true);
      });
  };

  const sendOtp = () => {
    // auth().signOut();
    if (phone == '') {
      setStatus('Failure');
      setMalert('Please enter phone number');
      setModalVisible(true);
      return;
    }

    setLoading(true);
    let num = '+' + selectedCountry?.callingCode + phone;

    signInWithPhoneNumber(num);
  };

  async function signInWithPhoneNumber(phoneNumber) {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation);
      setLoading(false);
      setVerifyModal(true);
    } catch (error) {
      console.log('Error in signInWithPhoneNumber', error);
      switch (error.code) {
        case 'auth/invalid-phone-number':
          setLoading(false);
          setStatus('Failure');
          setMalert('Incorrect Number');
          setModalVisible(true);
          break;
        case 'auth/network-request-failed':
          setLoading(false);
          setStatus('Failure');
          setMalert('internet Connection Error');
          setModalVisible(true);
          break;
        case 'auth/too-many-requests':
          setLoading(false);
          setStatus('Failure');
          setMalert(
            'Too many OTP requests please check your number or try agin later',
          );
          setModalVisible(true);
          break;
        default:
          setLoading(false);
          break;
      }
    }
  }

  async function confirmCode(code) {
    setLoading(true);
    try {
      const a = await confirm.confirm(code);
      // const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

      setLoading(false);
    } catch (error) {
      console.log('Error in ConfirmCode', error);
      setVerifyModal(false);
      setLoading(false);
      setStatus('Failure');
      setMalert('Incorrect OTP');
      setModalVisible(true);
    }
  }

  function onAuthStateChanged(user) {
    setCount(count + 1);
    if (user) {
      setVerifyModal(false);
      checkPhone(user.phoneNumber, type);
    }
  }

  return (
    // <KeyboardAvoidingView
    //   style={{flex: 1}}
    //   behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
    <SafeAreaView style={{flex: 1}}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <SafeAreaView style={{flex: 1, backgroundColor: Colors.White}}>
          <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
            {/* <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                margin: 20,
                backgroundColor: Colors.LightPrimary,
                alignSelf: 'flex-start',
                padding: 8,
                borderRadius: 10,
              }}>
              <Ionicons name="chevron-back" color={Colors.White} size={20} />
            </TouchableOpacity> */}

            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: hp(15),
              }}>
              <Image
                source={Images.sendOtp}
                resizeMode={'contain'}
                style={{
                  width: Global.SCREEN_WIDTH * 0.6,
                  height: Global.SCREEN_WIDTH * 0.6,
                }}></Image>
              <Text
                style={{
                  marginTop: 30,
                  fontWeight: 'bold',
                  fontSize: 18,
                  maxWidth: '80%',
                }}>
                {'Get In Your Account!'}
              </Text>
              <Text
                style={{
                  marginTop: 30,
                  color: Colors.Gray,
                  maxWidth: '80%',
                  textAlign: 'center',
                }}>
                {
                  'Enter your mobile number to receive a verification code to access your account'
                }
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderColor: Colors.Gray,
                  borderWidth: 0.5,
                  borderRadius: 10,
                  margin: 20,
                  paddingHorizontal: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'flex-end',
                    paddingVertical: 10,
                    alignItems: 'center',
                  }}>
                  <CountryPicker
                    withCallingCode
                    withFlag
                    excludeCountries={['AF']}
                    withFlagButton={true}
                    withCallingCodeButton
                    renderCountryFilter
                    preferredCountries={['US', 'GB', 'NG', 'PK']}
                    countryCode={selectedCountry ? selectedCountry.cca2 : 'QA'}
                    withEmoji
                    onSelect={country => {
                      setSelectedCountry(country);
                    }}
                  />
                </View>
                <TextInput
                  placeholder="000 0000 000"
                  keyboardType={'phone-pad'}
                  value={phone}
                  onChangeText={val => setPhone(val)}
                  style={{flex: 1, marginLeft: 10}}></TextInput>
              </View>
            </View>

            <View style={{margin: 20, marginTop: hp(18)}}>
              <Button
                label="SEND OTP"
                onPress={() => {
                  sendOtp();
                }}
                style={{}}></Button>
            </View>
          </KeyboardAwareScrollView>
          <Modal
            isVisible={verifyModal}
            animationIn="slideInRight"
            animationOut="slideOutRight"
            coverScreen={true}
            style={{
              margin: 0,
              width: Global.SCREEN_WIDTH,
              height: Global.SCREEN_HEIGHT,
            }}
            onBackButtonPress={() => setVerifyModal(false)}
            onBackdropPress={() => setVerifyModal(false)}>
            <KeyboardAvoidingView
              style={{flex: 1}}
              behavior={Platform.OS == 'ios' ?? 'padding'}>
              <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <SafeAreaView style={{flex: 1, backgroundColor: Colors.White}}>
                  <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{
                      margin: 20,
                      backgroundColor: Colors.Black,
                      alignSelf: 'flex-start',
                      padding: 8,
                      borderRadius: 10,
                    }}>
                    <Ionicons
                      name="chevron-back"
                      color={Colors.White}
                      size={20}
                    />
                  </TouchableOpacity>
                  <ScrollView>
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image
                        source={Images.varifyOtp}
                        resizeMode={'contain'}
                        style={{
                          width: Global.SCREEN_WIDTH * 0.6,
                          height: Global.SCREEN_WIDTH * 0.6,
                        }}></Image>
                      <Text
                        style={{
                          marginTop: 30,
                          fontWeight: 'bold',
                          fontSize: 18,
                          maxWidth: '80%',
                        }}>
                        {'OTP Verification '}
                      </Text>
                      <Text
                        style={{
                          marginTop: 30,
                          color: Colors.Gray,
                          maxWidth: '80%',
                          textAlign: 'center',
                        }}>
                        {'We have sent you an OTP on this mobile number'}
                      </Text>
                      <Text
                        style={{
                          marginTop: 20,
                          color: Colors.Gray,
                          maxWidth: '80%',
                          textAlign: 'center',
                        }}>
                        {'+' + selectedCountry?.callingCode + phone}
                      </Text>
                      <View>
                        <OTPInputView
                          style={{
                            width: 300,
                            height: 80,
                            marginTop: 30,
                            alignSelf: 'center',
                          }}
                          autoFocusOnLoad={false}
                          pinCount={6}
                          editable={true}
                          codeInputFieldStyle={{
                            width: 40,
                            height: 40,
                            borderRadius: 40,
                            color: Colors.Black,
                            borderColor: Colors.Gray,
                          }}
                          keyboardAppearance={'default'}
                          codeInputHighlightStyle={{
                            borderColor: Colors.Primary,
                            borderWidth: 1,
                          }}
                          onCodeFilled={code => {
                            confirmCode(code);
                          }}
                        />
                      </View>
                    </View>
                  </ScrollView>
                </SafeAreaView>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </Modal>
          {modalVisible && (
            <AlertModal
              setModalVisible={setModalVisible}
              modalVisible={modalVisible}
              screen={screen}
              msg={malert}
              status={status}
            />
          )}
          {loading && <FSLoader />}
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
    //  </KeyboardAvoidingView>
  );
};

export default Register;
