import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
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
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {useDispatch} from 'react-redux';

const VarifyOTP = ({navigation}) => {
  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS == 'ios' ? 'padding': 'height'}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <SafeAreaView style={{flex: 1, backgroundColor: Colors.White}}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              margin: 20,
              backgroundColor: Colors.LightPrimary,
              alignSelf: 'flex-start',
              padding: 8,
              borderRadius: 10,
            }}>
            <Ionicons name="chevron-back" color={Colors.White} size={20} />
          </TouchableOpacity>
          <ScrollView>
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
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
                {'OTP Verification'}
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
                {'+20 0000000000'}
              </Text>
              <View>
                <OTPInputView
                  style={{
                    width: 200,
                    height: 80,
                    marginTop: 30,
                    alignSelf: 'center',
                  }}
                  autoFocusOnLoad={false}
                  pinCount={4}
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
                    // confirmCode(code)
                    // if (status == 'updatephone') {
                    //     return
                    // }
                    // navigation.navigate(status)
                  }}
                />
              </View>
              <Text
                style={{
                  marginTop: 20,
                  color: Colors.Gray,
                  maxWidth: '80%',
                  textAlign: 'center',
                }}>
                {'00:30'}
              </Text>
              <Text
                style={{
                  marginTop: 20,
                  color: Colors.Gray,
                  maxWidth: '80%',
                  textAlign: 'center',
                }}>
                {"Haven't received yet?"}
                <Text style={{fontWeight: 'bold'}}> Send Again</Text>
              </Text>
            </View>
          </ScrollView>

          <Button
            label="CONFIRM"
            onPress={() => {
              navigation.navigate('CreateAccount');
            }}
            style={{margin: 20}}></Button>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default VarifyOTP;
