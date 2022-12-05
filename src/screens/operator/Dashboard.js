import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
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
import {useIsFocused} from '@react-navigation/native';
import {wp, hp} from '../../components/Responsive';
import Card from '../../components/Card';
import {setOperatorDashBoard, setUserInfo} from '../../redux/reducer';
const Dashboard = ({navigation}) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const dashboardReducer = useSelector(state => state.dashboardReducer);
  const {userInfo, supplierDashBoard, operatorDashBoard} = dashboardReducer;

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
    <SafeAreaView style={{flex: 1, backgroundColor: '#FAFBFF'}}>
      {/* <StatusBar barStyle={Colors.White} backgroundColor={Colors.Primary} /> */}
      <View style={styles.header}>
        <Text numberOfLines={1} style={styles.name}>
          Hi {userInfo?.user.name},
        </Text>
        <View style={styles.alertbox}>
          <TouchableOpacity
            style={{flexDirection: 'row', marginHorizontal: 10}}
            onPress={() => {
              navigation.navigate('Notifications');
            }}>
            <Feather name={'bell'} color={'#030303'} size={20} />
            {data?.alerts > 0 && <View style={styles.alerts} />}
          </TouchableOpacity>
          <Image
            source={
              userInfo?.user?.photo
                ? {uri: userInfo?.user?.photo}
                : Images.Placeholder
            }
            style={styles.userimg}
          />
        </View>
      </View>
      <View
        style={{flexDirection: 'row', alignItems: 'center', marginLeft: 10}}>
        <Text style={styles.DB}>Dashboard</Text>
      </View>

      <FlatList
        ListHeaderComponent={
          <View style={styles.graphView}>
            <Text style={{fontWeight: '700', fontSize: 12, color: '#081735'}}>
              Bookings Forecast
            </Text>
            <View style={styles.seperator} />
            {/* //graph here */}

            <View
              style={{
                width: wp(86),
                alignSelf: 'center',
              }}>
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
        }
        style={{
          width: wp(95),
          alignSelf: 'center',
        }}
        contentContainerStyle={{
          alignItems: 'center',
        }}
        numColumns={2}
        data={operatorDashBoard}
        showsVerticalScrollIndicator={false}
        renderItem={renderData}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  userimg: {
    width: 35,
    height: 35,
    borderRadius: 20,
  },
  alerts: {
    width: 8,
    height: 8,
    borderRadius: 10,
    backgroundColor: '#F39200',
    position: 'absolute',
    left: wp(3),
  },
  alertbox: {
    flexDirection: 'row',
    alignItems: 'center',
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
