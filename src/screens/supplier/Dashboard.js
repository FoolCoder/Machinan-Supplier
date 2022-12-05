import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  useWindowDimensions,
  StyleSheet,
  FlatList,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Api from '../../utils/Api';
import Colors from '../../utils/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather';
import Images from '../../utils/Images';
import {BarChart, Grid, XAxis, YAxis} from 'react-native-svg-charts';
import {wp, hp} from '../../components/Responsive';
import Card from '../../components/Card';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import {setUserInfo} from '../../redux/reducer';
import Loader from '../../components/Loader';

const Dashboard = ({navigation}) => {
  const dispatch = useDispatch();

  const dashboardReducer = useSelector(state => state.dashboardReducer);
  const {userInfo, supplierDashBoard} = dashboardReducer;
  const [data, setData] = useState([]);
  const data1 = [60, 30, 90, 21, 47, 68, 88, 96, 55, 73, 80, 55];
  const dataWithPickedColors = data1.map(item =>
    transformDataForBarChart(item),
  );
  const axesSvg = {fontSize: 10, fill: '#8F95B2'};
  const label = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'July',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const renderData = ({item, index}) => {
    return <Card item={item} index={index} />;
  };

  return (
    <>
      <SafeAreaView style={styles.safearea}>
        {/* <StatusBar barStyle={Colors.White} backgroundColor={Colors.Primary} /> */}

        <View style={styles.header}>
          <View style={{flex: 1}}>
            <Text style={styles.username}>Hi {userInfo?.user.name},</Text>
            <Text style={styles.headername}>Dashboard</Text>
          </View>

          <View style={styles.headerRight}>
            <Image
              source={
                userInfo?.user?.photo
                  ? {uri: userInfo?.user?.photo}
                  : Images.Placeholder
              }
              style={{
                width: hp(4.5),
                height: hp(4.5),
                borderRadius: hp(4.5) / 2,
              }}
            />
            <TouchableOpacity
              style={{flexDirection: 'row', marginHorizontal: 10}}
              onPress={() => {
                navigation.navigate('Notifications');
              }}>
              <Feather name={'bell'} color={Colors.Gray} size={RFValue(23)} />
              {data?.alerts > 0 && (
                <Text style={styles.alert}>{data?.alerts}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          ListHeaderComponent={() => (
            <View style={styles.graphView}>
              <Text style={styles.graphheader}>Bookings Forecast</Text>
              <View style={styles.seperator} />
              {/* //graph here */}

              <View style={styles.barview}>
                <BarChart
                  style={{height: 200}}
                  svg={{
                    originY: 30,
                  }}
                  spacingInner={0.4}
                  gridMin={-5}
                  gridMax={120}
                  data={dataWithPickedColors}
                  yAccessor={({item}) => item.value}
                  contentInset={{}}
                  barBorderRadius={6}
                  numberOfTicks={5}
                  spacingOuter={0.5}></BarChart>
                <XAxis
                  style={{marginHorizontal: -10, height: 10, color: '#000'}}
                  data={label}
                  formatLabel={(_, index) => label[index]}
                  svg={axesSvg}
                  contentInset={{left: 30, right: 30}}
                />
              </View>
            </View>
          )}
          style={{
            width: wp(95),
            alignSelf: 'center',
          }}
          contentContainerStyle={{
            alignItems: 'center',
          }}
          numColumns={2}
          data={supplierDashBoard}
          showsVerticalScrollIndicator={false}
          renderItem={renderData}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: '#FAFBFF',
  },
  username: {fontSize: RFPercentage(2.5), color: Colors.Black},
  headername: {
    fontSize: RFPercentage(3.5),
    fontWeight: '700',
    color: Colors.Black,
  },
  headerRight: {flexDirection: 'row-reverse', alignItems: 'center'},
  alert: {
    fontWeight: 'bold',
    color: Colors.Primary,
    fontSize: RFValue(12),
    marginTop: -9,
    marginLeft: -3,
  },
  barview: {
    width: wp(86),
    alignSelf: 'center',
  },
  graphheader: {fontWeight: '700', fontSize: 12, color: '#081735'},
  booking: {
    width: hp(6.8),
    height: hp(6.8),
  },
  alertText: {
    position: 'absolute',
    right: -3,
    top: 1,
    color: '#fff',
    backgroundColor: '#000',
    width: hp(2.28),
    height: hp(2.28),
    borderRadius: hp(2.28) / 2,
    textAlign: 'center',
  },
  cardContainer: {
    padding: 18,
    justifyContent: 'space-between',
    width: wp(100) / 2 - 20,
    height: hp(100) * 0.24,
    backgroundColor: Colors.White,
    elevation: 3,
    borderRadius: 25,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: wp(90),
    alignSelf: 'center',
    marginTop: 15,
  },
  name: {
    color: '#000',
    fontSize: 24,
    marginTop: 10,
    fontWeight: '400',
    width: wp(60),
  },
  DB: {
    flex: 1,
    color: '#000',
    fontSize: 28,
    fontWeight: '700',
    marginLeft: 10,
  },
  graphView: {
    // alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: Colors.White,
    elevation: 2,
    width: wp(90),
    height: 'auto',
  },
  seperator: {
    height: 0.5,
    backgroundColor: '#E6E8F0',
    marginTop: 8,
    width: wp(90),
    alignSelf: 'center',
  },
});

export default Dashboard;

const transformDataForBarChart = number => {
  // random ranges > number < inscribed to distinguish colors
  if (number <= 30) {
    return {
      value: number,
      svg: {
        fill: '#FFB7F5',
      },
    };
  } else if (number > 30 && number < 70) {
    return {
      value: number,
      svg: {
        fill: '#FF754C',
        strokeLine: 'round',
      },
    };
  } else {
    return {
      value: number,
      svg: {
        fill: '#E6E8F0',
      },
    };
  }
};
