import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Button from '../components/Button';
import Input from '../components/Input';
import Colors from '../utils/Colors';
import Global from '../utils/Global';
import Images from '../utils/Images';

const CreateAccount = ({navigation}) => {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [surName, setSurName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS == 'ios' ?? 'padding'}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <SafeAreaView style={{flex: 1, backgroundColor: Colors.White}}>
          <View
            style={{
              margin: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                position: 'absolute',
                left: 0,
                backgroundColor: Colors.LightPrimary,
                alignSelf: 'flex-start',
                padding: 8,
                borderRadius: 10,
              }}>
              <Ionicons name="chevron-back" color={Colors.White} size={20} />
            </TouchableOpacity>
            <Text
              style={{color: Colors.Primary, fontSize: 20, fontWeight: 'bold'}}>
              Create Account
            </Text>
          </View>

          <ScrollView
            style={{
              flex: 1,
              margin: 10,
              marginTop: Global.SCREEN_HEIGHT * 0.05,
            }}
            showsVerticalScrollIndicator={false}>
            <View>
              <Text style={{fontWeight: 'bold'}}>
                First Name
                <Text style={{lineHeight: 18, color: Colors.Red}}> *</Text>
              </Text>
              <Input
                // placeholder="First Name"
                containerStyle={{marginTop: 3}}
                error=""
                value={firstName}
                onChangeText={setFirstName}
                // returnKeyType="next"
                // onSubmitEditing={() => lNameRef.current.focus()}
              />
            </View>

            <View style={{marginTop: 10}}>
              <Text style={{fontWeight: 'bold'}}>
                Middle Name
                <Text style={{lineHeight: 18, color: Colors.Red}}> *</Text>
              </Text>
              <Input
                // placeholder="Middle Name"
                containerStyle={{marginTop: 3}}
                error=""
                value={middleName}
                onChangeText={setMiddleName}
                // returnKeyType="next"
                // onSubmitEditing={() => lNameRef.current.focus()}
              />
            </View>

            <View style={{marginTop: 10}}>
              <Text style={{fontWeight: 'bold'}}>
                Surname
                <Text style={{lineHeight: 18, color: Colors.Red}}> *</Text>
              </Text>
              <Input
                // placeholder="Surname"
                containerStyle={{marginTop: 3}}
                error=""
                value={surName}
                onChangeText={setSurName}
                // returnKeyType="next"
                // onSubmitEditing={() => lNameRef.current.focus()}
              />
            </View>

            <View style={{marginTop: 10}}>
              <Text style={{fontWeight: 'bold'}}>
                Email Address
                <Text style={{lineHeight: 18, color: Colors.Red}}> *</Text>
              </Text>
              <Input
                // placeholder="Surname"
                containerStyle={{marginTop: 3}}
                error=""
                value={email}
                onChangeText={setEmail}
                // returnKeyType="next"
                // onSubmitEditing={() => lNameRef.current.focus()}
              />
            </View>

            <Text
              style={{margin: 10, alignSelf: 'center', textAlign: 'center'}}>
              By registering your account you agree to our{' '}
              <Text
                style={{
                  fontWeight: 'bold',
                  textDecorationLine: 'underline',
                  color: Colors.Primary,
                }}>
                terms n condition
              </Text>{' '}
              and{' '}
              <Text
                style={{
                  fontWeight: 'bold',
                  textDecorationLine: 'underline',
                  color: Colors.Primary,
                }}>
                privacy policy
              </Text>
            </Text>
          </ScrollView>

          <View style={{margin: 20}}>
            <Button
              label="Create"
              onPress={() => navigation.navigate('VarifyOTP')}
              style={{}}></Button>
            {/* <Text style={{ alignSelf: 'center', marginTop: 10 }}>Already have a account? <Text onPress={() => navigation.navigate('Login')} style={{ fontWeight: 'bold', color: Colors.Primary }}>Login</Text></Text> */}
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default CreateAccount;
