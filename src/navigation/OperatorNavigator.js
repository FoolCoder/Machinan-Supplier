import React, {useEffect, useState} from 'react';
import {
  createBottomTabNavigator,
  BottomTabBar,
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
import Dashboard from '../screens/operator/Dashboard';
import Bookings from '../screens/operator/Bookings';
import Account from '../screens/operator/Account';
import AvailableBookings from '../screens/operator/AvailableBookings';
import MyBookings from '../screens/operator/MyBookings';
import BookingDetail from '../screens/operator/BookingDetail';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
// import ShowLocations from '../screens/ShowLocations';
import Dispute from '../screens/Dispute';
import Notifications from '../screens/Notifications';
import Images from '../utils/Images';
import {Image, View} from 'react-native';
import {hp, wp} from '../components/Responsive';
import Detail from '../screens/operator/Detail';

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
    routeName === 'SelectLocationA' ||
    routeName === 'SelectLocationB' ||
    // routeName === 'ShowLocations' ||
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
      defaultScreenOptions={{unmountOnBlur: true}}
      screenOptions={({route}) => ({
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          display: getTabBarVisibility(route),
          height: hp(8),
          borderWidth: 0,
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
            case 'AccountStack':
              // IconComponent = FontAwesome;
              iconName = Images.account;
              break;
          }
          return (
            <View
              style={{
                width: wp(28),
                alignItems:
                  iconName == Images.home
                    ? 'center'
                    : iconName == Images.account
                    ? 'flex-start'
                    : 'flex-end',
              }}>
              <Image
                source={iconName}
                style={{
                  width: iconName == Images.home ? 40 : 22,
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
                    marginRight: iconName == Images.booking ? 8 : null,
                    marginLeft: iconName == Images.account ? 8 : null,
                  }}
                />
              )}
            </View>
            // <IconComponent
            //   name={iconName}
            //   size={24}
            //   color={focused ? Colors.Primary : Colors.LightGray}
            // />
          );
        },
      })}>
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
        name={'AccountStack'}
        options={{headerShown: false, tabBarLabel: ''}}
        component={AccountStackScreens}
      />
    </Tab.Navigator>
  );
};
