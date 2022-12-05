import React, {useState} from 'react';
import {SafeAreaView, View, Text, FlatList, StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Colors from '../../utils/Colors';
import BookingsCard from '../../components/Supplier/BookingsCard';
import { useCallback } from 'react';
import FSLoader from '../../components/FSLoader';

const MyBookings = props => {
  const {bookings, location,getData} = props;
  const [refresh, setrefresh] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading,setLoading]=useState(false)

 

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
          data={bookings}
          renderItem={({item, index}) => (
            <>
              <BookingsCard
                item={item}
                index={index}
                bookings={bookings}
                available={false}
                location={location}
               setLoading={setLoading}
               loading={loading}
                operator={false}
                refresh={refreshing}
                onRefresh={onRefresh}
                setRefresh={setRefreshing}
              />
              <View style={styles.seperator} />
            </>
          )}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id.toString()}
          ItemSeparatorComponent={() => <View style={{height: 10}}></View>}
        />
      )}
         {loading&&<FSLoader/>}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safearea: {flex: 1, backgroundColor: Colors.White},
  nobooking: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  backTextWhite: {
    color: '#FFF',
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#CCC',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 50,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: 'blue',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
  },
  seperator: {
    height: 0.5,
    backgroundColor: '#E6E8F0',
    marginTop: 8,
    width: wp(94),
    alignSelf: 'center',
  },
});

export default MyBookings;
