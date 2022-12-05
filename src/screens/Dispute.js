import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  Alert,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from '../components/Button';
import Colors from '../utils/Colors';
import Api from '../utils/Api';
import FSLoader from '../components/FSLoader';

const Dispute = ({navigation, route}) => {
  const dashboardReducer = useSelector(state => state.dashboardReducer);
  const {userInfo} = dashboardReducer;
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const {booking} = route.params;
  const [notes, setNotes] = useState('');

  const [disputeData, setDisputeData] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoadingData(true);
    Api.getDisputeData(userInfo.token, booking.id)
      .then(res => {
        console.log(res);

        setLoadingData(false);
        if (res.response == 101) {
          setDisputeData(res.data);
        }
      })
      .catch(e => console.log(e));

    return () => {};
  }, []);

  const createDispute = () => {
    if (notes == '') {
      Alert.alert('Machinan', 'Please enter some details');
      return;
    }
    setLoading(true);
    Api.createDispute(userInfo.token, booking.id, notes)
      .then(res => {
        setLoading(false);
        setNotes('');
        if (res.response == 101) {
          Alert.alert('SmartShifts', res.message, [
            {text: 'OK', onPress: () => navigation.goBack()},
          ]);
          return;
        }
        if (res.response == 100) {
          Alert.alert('SmartShifts', res.message);
        }
      })
      .catch(e => Alert.alert('Error', e.message));
  };

  const respondDispute = () => {
    if (notes == '') {
      Alert.alert('Machinan', 'Please enter some details');
      return;
    }
    setLoading(true);
    Api.replyDispute(userInfo.token, disputeData.id, notes)
      .then(res => {
        setLoading(false);
        setNotes('');
        if (res.response == 101) {
          Alert.alert('SmartShifts', res.message, [
            {text: 'OK', onPress: () => navigation.goBack()},
          ]);
          return;
        }
        if (res.response == 100) {
          Alert.alert('SmartShifts', res.message);
        }
      })
      .catch(e => {
        Alert.alert('Error', e.message);
      });
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
        <Text style={{fontWeight: 'bold', fontSize: 20}}>Dispute</Text>
      </View>

      <View style={{margin: 20}}>
        {/* <Text style={{ fontSize: 18 }}>Create Dispute</Text> */}
        <Text style={{marginTop: 10}}>
          We're sorry to hear that you have a problem with this job. Please use
          the form below to tell us a little about the issue.
        </Text>
      </View>

      {loadingData ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <FSLoader />
        </View>
      ) : (
        <>
          {disputeData && (
            <>
              <View style={{margin: 10}}>
                <Text style={{fontWeight: 'bold'}}>
                  {disputeData?.from?.name}{' '}{disputeData?.from?.role}
                </Text>
                <Text>{disputeData?.complain?.message}</Text>
              </View>

              {disputeData.reply && (
                <View style={{margin: 10, marginTop: 20}}>
                  <Text style={{fontWeight: 'bold'}}>
                    {disputeData?.against?.name}{' '} {disputeData?.against?.role}
                  </Text>
                  <Text>{disputeData?.reply?.message}</Text>
                </View>
              )}
              {disputeData?.resolving_note && (
                <View style={{margin: 10, marginTop: 20}}>
                  <Text style={{fontWeight: 'bold'}}>
                    {disputeData?.status}
                  </Text>
                  <Text>{disputeData?.resolving_note}</Text>
                </View>
              )}
            </>
          )}

          {(!disputeData || (disputeData && disputeData?.need_reply)) && (
            <TextInput
              placeholder="Enter details"
              value={notes}
              onChangeText={val => setNotes(val)}
              textAlignVertical="top"
              style={{
                margin: 10,
                padding: 10,
                borderWidth: 0.5,
                borderRadius: 5,
                minHeight: 150,
              }}></TextInput>
          )}

          {(!disputeData || (disputeData && disputeData?.need_reply)) && (
            <Button
              label={'Send Message'}
              rightIcon
              //loading={loading}
              style={{marginTop: 20, marginRight: 10, alignSelf: 'flex-end'}}
              onPress={() => {
                disputeData ? respondDispute() : createDispute();
              }}></Button>
          )}
        </>
      )}
      {loading && <FSLoader />}
    </SafeAreaView>
  );
};

export default Dispute;
