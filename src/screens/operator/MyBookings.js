import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {useCallback, useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  useWindowDimensions,
  Animated,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Button from '../../components/Button';
import FSLoader from '../../components/FSLoader';
import {wp} from '../../components/Responsive';
import BookingsCard from '../../components/Supplier/BookingsCard';
import Api from '../../utils/Api';
import Colors from '../../utils/Colors';
import Global from '../../utils/Global';
import Images from '../../utils/Images';

const MyBookings = props => {
  const {
    bookings,
    location,
    getData,
    refresh,
    setRefresh,
    updateStatus,
    setupdatestatus,
  } = props;
  const [loading, setLoading] = useState(false);
  // console.log('MyBookings', props);
  const onRefresh = useCallback(() => {
    // setRefresh(true);
    getData('Refresh');
  }, []);
  const statusChange = useCallback(() => {
    // setupdatestatus(!updateStatus);
    statusChange('statusChange');
  }, []);
  return (
    <SafeAreaView style={styles.safearea}>
      {bookings.length == 0 ? (
        <View style={styles.noavailabel}>
          <Text>No available bookings</Text>
        </View>
      ) : (
        <FlatList
          onRefresh={onRefresh}
          refreshing={refresh}
          style={{marginTop: 30}}
          data={bookings}
          removeClippedSubviews={true}
          renderItem={({item, index}) => (
            <>
              <BookingsCard
                item={item}
                index={index}
                bookings={bookings}
                available={false}
                location={location}
                operator={true}
                updateStatus={updateStatus}
                statusChange={statusChange}
                setupdatestatus={setupdatestatus}
              />
              <View style={styles.seperator} />
            </>
          )}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id.toString()}
          ItemSeparatorComponent={() => <View style={{height: 10}}></View>}
        />
      )}
    </SafeAreaView>
  );
};

export default MyBookings;
const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  noavailabel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seperator: {
    height: 0.5,
    backgroundColor: '#E6E8F0',
    marginTop: 8,
    width: wp(94),
    alignSelf: 'center',
  },
});
