import React from 'react';
import {SafeAreaView, View, Image, Text, TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';
import Button from '../components/Button';
import Colors from '../utils/Colors';
import Images from '../utils/Images';
import Global from '../utils/Global';
import {setUserType} from '../redux/reducer';

const Welcome = ({navigation}) => {
  const dispatch = useDispatch();

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.White}}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
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
          {'Welcome to '}
          <Text style={{color: Colors.Primary}}>Machinan</Text>
        </Text>
        <Text
          style={{
            marginTop: 30,
            color: Colors.Gray,
            maxWidth: '80%',
            textAlign: 'center',
          }}>
          {'Lorem Ipsum is s text of the printing and typesetting industry.'}
        </Text>
      </View>

      <View style={{margin: 20}}>
        <Button
          label="CONTINUE AS SUPPLIER"
          outline
          onPress={() => {
            dispatch(setUserType('Supplier'));

            navigation.navigate('Register', {type: 'Supplier'});
          }}
          style={{marginTop: 10}}></Button>
        <Button
          label="CONTINUE AS OPERATOR"
          outline
          onPress={() => {
            dispatch(setUserType('Operator'));

            navigation.navigate('Register', {type: 'Operator'});
          }}
          style={{marginTop: 10}}></Button>
      </View>
    </SafeAreaView>
  );
};

export default Welcome;
