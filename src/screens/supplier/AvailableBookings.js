import React from 'react';
import {SafeAreaView, View, Text, FlatList, StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import BookingsCard from '../../components/Supplier/BookingsCard';
import {wp} from '../../components/Responsive';
import {useEffect} from 'react';
import {useState} from 'react';
import {useCallback} from 'react';

const AvailableBookings = props => {
  const {bookings, getData} = props;
  const [sortArray, setsortArray] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    let enableArray = [];
    let disableArray = [];
    bookings.map((item, index) => {
      if (item?.supplier_status == 'Disabled') {
        disableArray.push(item);
      } else {
        enableArray.push(item);
      }
    });
    setsortArray([...enableArray, ...disableArray]);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      getData('Refresh');

      setRefreshing(false);
    }, 1500);
  }, []);

  return (
    <SafeAreaView style={styles.safearea}>
      {bookings.length == 0 ? (
        <View style={styles.nobooking}>
          <Text>No available bookings</Text>
        </View>
      ) : (
        <FlatList
          onRefresh={onRefresh}
          refreshing={refreshing}
          style={{marginTop: 10}}
          data={sortArray}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          removeClippedSubviews={true}
          windowSize={10}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{height: 10}}></View>}
          renderItem={({item, index}) => (
            <>
              <BookingsCard
                item={item}
                index={index}
                bookings={sortArray}
                available={true}
              />
              <View style={styles.seperator} />
            </>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default AvailableBookings;

const styles = StyleSheet.create({
  safearea: {flex: 1, backgroundColor: Colors.White, marginTop: 10},
  nobooking: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  seperator: {
    height: 0.5,
    backgroundColor: '#E6E8F0',
    marginTop: 8,
    width: wp(94),
    alignSelf: 'center',
    zIndex: 1,
  },
});
