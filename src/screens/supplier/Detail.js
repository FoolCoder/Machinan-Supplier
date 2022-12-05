import {PermissionsAndroid, Platform} from 'react-native';
import React, {useState, useEffect} from 'react';
import DetailComponent from '../../components/DetailComponent';
import Loader from '../../components/Loader';
import Api from '../../utils/Api';
import Geolocation from 'react-native-geolocation-service';
import {useSelector} from 'react-redux';
import FSLoader from '../../components/FSLoader';
import {Alert} from 'react-native';

const Detail = ({navigation, route}) => {
  const {booking} = route.params;
  const dashboardReducer = useSelector(state => state.dashboardReducer);
  const {userInfo} = dashboardReducer;
  const [loading, setLoading] = useState(false);
  const [bookinDetails, setbookingDetails] = useState(null);
  const [currentLoc, setcurrentLoc] = useState(null);
  const [documents, sedocuments] = useState([]);

  useEffect(() => {
    setLoading(true);
    requestLocationPermission();
  }, []);
  const getBookingDetail = position => {
    Api.getBookingDetail(
      booking?.id,
      position?.latitude,
      position?.longitude,
      userInfo?.token,
    )
      .then(res => {
        // console.log(res.data);
        if (res?.response == 101) {
          setbookingDetails(res.data);
          sedocuments([
            ...res?.data?.bid?.equipment?.documents,
            ...res?.data?.bid?.operator?.documents,
            ...res?.data?.bid?.supplier?.documents,
          ]);
          setLoading(false);
        }
      })
      .catch(e => Alert.alert('Error', e.message));
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
        getBookingDetail(position?.coords);
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
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
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
  return (
    <>
      {loading ? (
        <FSLoader />
      ) : (
        <DetailComponent
          navigation={navigation}
          route={route}
          bookinDetails={bookinDetails}
          currentLoc={currentLoc}
          documents={documents}
          operator={true}
        />
      )}
    </>
  );
};

export default Detail;
