import React, {useEffect, useState} from 'react';
import {
  createBottomTabNavigator,
  BottomTabBar,
  useBottomTabBarHeight,
} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Global from '../utils/Colors';
import Colors from '../utils/Colors';
import Dashboard from '../screens/supplier/Dashboard';
import Bookings from '../screens/supplier/Bookings';
import Equipments from '../screens/supplier/Equipments';
import Account from '../screens/supplier/Account';
import Operators from '../screens/supplier/Operators';
import AvailableBookings from '../screens/supplier/AvailableBookings';
import MyBookings from '../screens/supplier/MyBookings';
import BookingDetail from '../screens/supplier/BookingDetail';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
// import ShowLocations from '../screens/ShowLocations';
import Dispute from '../screens/Dispute';
import Notifications from '../screens/Notifications';
import Images from '../utils/Images';
import {View} from 'react-native';
import {Image} from 'react-native';
import {hp, wp} from '../components/Responsive';
import Detail from '../screens/supplier/Detail';
import OperatorRiggerDetail from '../screens/supplier/OperatorRiggerDetail';
import EquipmentDetail from '../screens/supplier/EquipmentDetail';

const DashboardStack = createNativeStackNavigator();
const DashboardStackScreens = () => (
  <DashboardStack.Navigator>
    <DashboardStack.Screen
      name={'Dashboard'}
      component={Dashboard}
      options={{headerShown: false, animation: 'slide_from_right'}}
    />
    <DashboardStack.Screen
      name={'Notifications'}
      component={Notifications}
      options={{headerShown: false, animation: 'slide_from_right'}}
    />
  </DashboardStack.Navigator>
);

const BookingsStack = createNativeStackNavigator();
const BookingsStackScreens = () => (
  <BookingsStack.Navigator>
    <BookingsStack.Screen
      name={'Bookings'}
      component={Bookings}
      options={{headerShown: false, animation: 'slide_from_right'}}
    />
    <BookingsStack.Screen
      name={'AvailableBookings'}
      component={AvailableBookings}
      options={{headerShown: false, animation: 'slide_from_right'}}
    />
    <BookingsStack.Screen
      name={'MyBookings'}
      component={MyBookings}
      options={{headerShown: false, animation: 'slide_from_right'}}
    />
    <BookingsStack.Screen
      name={'BookingDetail'}
      component={BookingDetail}
      options={{headerShown: false, animation: 'slide_from_right'}}
    />
    <BookingsStack.Screen
      name={'Detail'}
      component={Detail}
      options={{headerShown: false, animation: 'slide_from_right'}}
    />
    <BookingsStack.Screen
      name={'Dispute'}
      component={Dispute}
      options={{headerShown: false, animation: 'slide_from_right'}}
    />
  </BookingsStack.Navigator>
);

const EquipmentStack = createNativeStackNavigator();
const EquipmentStackScreens = () => (
  <EquipmentStack.Navigator>
    <EquipmentStack.Screen
      name={'Equipments'}
      component={Equipments}
      options={{
        headerShown: false,
        animation: 'slide_from_right',
      }}></EquipmentStack.Screen>
    <EquipmentStack.Screen
      name={'EquipmentDetail'}
      component={EquipmentDetail}
      options={{
        headerShown: false,
        animation: 'slide_from_right',
      }}></EquipmentStack.Screen>
  </EquipmentStack.Navigator>
);

const OperatorStack = createNativeStackNavigator();
const OperatorStackScreens = () => (
  <OperatorStack.Navigator>
    <OperatorStack.Screen
      name={'Operators'}
      component={Operators}
      options={{
        headerShown: false,
        animation: 'slide_from_right',
      }}></OperatorStack.Screen>
    <OperatorStack.Screen
      name={'OperatorRiggerDetail'}
      component={OperatorRiggerDetail}
      options={{headerShown: false, animation: 'slide_from_right'}}
    />
  </OperatorStack.Navigator>
);

const AccountStack = createNativeStackNavigator();
const AccountStackScreens = () => (
  <AccountStack.Navigator>
    <AccountStack.Screen
      name={'Account'}
      component={Account}
      options={{
        headerShown: false,
        animation: 'slide_from_right',
      }}></AccountStack.Screen>
  </AccountStack.Navigator>
);

function getTabBarVisibility(route) {
  const routeName = getFocusedRouteNameFromRoute(route);

  if (
    routeName === 'BookingDetail' ||
    routeName === 'Review' ||
    routeName === 'ProductsListing' ||
    routeName === 'OperatorRiggerDetail' ||
    routeName === 'EquipmentDetail' ||
    routeName === 'Detail' ||
    routeName === 'Dispute'
  ) {
    return 'none';
  }

  return 'flex';
}

const Tab = createBottomTabNavigator();
export default () => {
  return (
    <Tab.Navigator
      initialRouteName="DashboardStack"
      tabBar={props => (
        <BottomTabBar
          {...props}
          style={{
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            // marginTop: -20,
            position: 'absolute',
            // height: 50
          }}
        />
      )}
      screenOptions={({route}) => ({
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          height: hp(9),
          display: getTabBarVisibility(route),
        },
        tabBarActiveTintColor: Colors.Primary,
        tabBarInactiveTintColor: Colors.LightGray,
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          let IconComponent = Feather;
          switch (route.name) {
            case 'DashboardStack':
              // IconComponent = MaterialIcons;
              iconName = Images.home;
              break;
            case 'BookingsStack':
              IconComponent = MaterialCommunityIcons;
              iconName = Images.booking;
              break;
            case 'EquipmentStack':
              IconComponent = MaterialCommunityIcons;
              iconName = Images.Equipment;
              break;
            case 'OperatorStack':
              IconComponent = FontAwesome5;
              iconName = Images.Operator;
              break;
            case 'AccountStack':
              // IconComponent = FontAwesome;
              iconName = Images.account;
              break;
          }
          return (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={iconName}
                style={{
                  width:
                    iconName == Images.home
                      ? 40
                      : iconName == Images.Operator
                      ? 28
                      : 22,
                  height:
                    iconName == Images.home
                      ? 40
                      : iconName == Images.booking
                      ? 23
                      : 22,
                  marginTop: focused ? 10 : 5,
                }}
              />
              {focused && (
                <View
                  style={{
                    height: 5,
                    width: 5,
                    borderRadius: 3,
                    backgroundColor: Colors.Black,
                    top: 5,
                  }}
                />
              )}
            </View>
          );
        },
      })}>
      <Tab.Screen
        name={'OperatorStack'}
        options={{headerShown: false, tabBarLabel: ''}}
        component={OperatorStackScreens}
      />

      <Tab.Screen
        name={'BookingsStack'}
        options={{headerShown: false, tabBarLabel: ''}}
        component={BookingsStackScreens}
      />

      <Tab.Screen
        name={'DashboardStack'}
        options={{headerShown: false, tabBarLabel: ''}}
        component={DashboardStackScreens}
      />

      <Tab.Screen
        name={'EquipmentStack'}
        options={{headerShown: false, tabBarLabel: ''}}
        component={EquipmentStackScreens}
      />
      <Tab.Screen
        name={'AccountStack'}
        options={{headerShown: false, tabBarLabel: ''}}
        component={AccountStackScreens}
      />
    </Tab.Navigator>
  );
};
