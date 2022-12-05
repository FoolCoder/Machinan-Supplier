import React, {useEffect, useMemo, useState} from 'react';
import {Alert} from 'react-native';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import {TabView} from 'react-native-tab-view';
import {useSelector} from 'react-redux';
import FSLoader from '../../components/FSLoader';
import {wp, hp} from '../../components/Responsive';
import ROperatorCard from '../../components/ROperatorCard';
import Api from '../../utils/Api';
import Colors from '../../utils/Colors';
import Images from '../../utils/Images';

const Operators = ({navigation}) => {
  const dashboardReducer = useSelector(state => state.dashboardReducer);
  const {userInfo} = dashboardReducer;
  const layout = useWindowDimensions();
  const [operators, setOperators] = useState([]);
  const [riggers, setRiggers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [loadingSecond, setLoadingSecond] = useState(true);
  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
    {key: 'first', title: 'Operators'},
    {key: 'second', title: 'Riggers'},
  ]);
  useEffect(() => {
    getData('useEffect');
  }, []);

  const getData = type => {
    if (type == 'useEffect') {
      setLoading(true);
    }
    Api.getOperators(userInfo.token)
      .then(res => {
        setLoading(false);
        if (res.response == 101) {
          setOperators(res.data.operators);
          setRiggers(res.data.riggers);
        }
        setLoading(false);
        setRefresh(false);
      })
      .catch(e => {
        setLoading(false);
        setRefresh(false);
        Alert.alert('Error', e.message);
      });
  };

  const FirstRoute = () =>
    useMemo(() =>
      loading ? (
        <View style={styles.route}>
          <FSLoader />
        </View>
      ) : (
        <>
          {operators?.length == 0 ? (
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Text>No Operator found</Text>
            </View>
          ) : (
            <FlatList
              refreshing={refresh}
              onRefresh={() => {
                setRefresh(true);
                getData('onRefresh');
              }}
              data={operators}
              renderItem={({item, index}) => (
                <ROperatorCard
                  item={item}
                  index={index}
                  type="Operator"
                  navigation={navigation}
                />
              )}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={() => {
                return <View style={{marginTop: 10}} />;
              }}
              keyExtractor={item => item.id.toString()}
            />
          )}
        </>
      ),
    );

  const SecondRoute = () =>
    useMemo(() =>
      loading ? (
        <View style={styles.route}>
          <FSLoader />
        </View>
      ) : (
        <>
          {riggers?.length == 0 ? (
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Text>No Rigger found</Text>
            </View>
          ) : (
            <FlatList
              refreshing={refresh}
              onRefresh={() => {
                setRefresh(true);
                getData('onRefresh');
              }}
              data={riggers}
              renderItem={({item, index}) => (
                <ROperatorCard
                  item={item}
                  index={index}
                  type="Rigger"
                  navigation={navigation}
                />
              )}
              ListFooterComponent={() => {
                return <View style={{marginTop: 10}} />;
              }}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item.id.toString()}
              // ItemSeparatorComponent={() => (
              //   <View
              //     style={{
              //       marginVertical: 10,
              //       borderTopWidth: 0.5,
              //       borderColor: Colors.LightGray,
              //     }}></View>
              // )}
            />
          )}
        </>
      ),
    );

  const renderScene = ({route}) => {
    switch (route.key) {
      case 'first':
        return <FirstRoute />;
        break;
      case 'second':
        return <SecondRoute />;
        break;
      default:
        break;
    }
  };

  const renderItem =
    ({navigationState, position}) =>
    ({route, index}) => {
      const inputRange = navigationState.routes.map((_, i) => i);

      const activeOpacity = position.interpolate({
        inputRange,
        outputRange: inputRange.map(i => (i === index ? 1 : 0)),
      });
      const inactiveOpacity = position.interpolate({
        inputRange,
        outputRange: inputRange.map(i => (i === index ? 0 : 1)),
      });

      return (
        <View style={styles.tab}>
          <Animated.View style={[styles.item, {opacity: inactiveOpacity}]}>
            <Text style={[styles.label, styles.inactive]}>{route.title}</Text>
          </Animated.View>
          <Animated.View
            style={[styles.item, styles.activeItem, {opacity: activeOpacity}]}>
            <Text style={[styles.label, styles.active]}>{route.title}</Text>
          </Animated.View>
        </View>
      );
    };

  const renderTabBar = props => (
    <View style={styles.tabbar}>
      {props.navigationState.routes.map((route, index) => {
        return (
          <TouchableWithoutFeedback
            key={route.key}
            onPress={() => props.jumpTo(route.key)}>
            {renderItem(props)({route, index})}
          </TouchableWithoutFeedback>
        );
      })}
    </View>
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.Background}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          margin: 10,
        }}>
        <View style={{width: 10}} />

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={
              userInfo?.user?.photo
                ? {uri: userInfo?.user?.photo}
                : Images.Placeholder
            }
            style={{
              width: 40,
              height: 40,
              borderWidth: 1,
              borderRadius: 40,
            }}></Image>
          <Text style={{marginLeft: 5, fontSize: 16}}>
            {userInfo?.user?.name}
          </Text>
        </View>
      </View>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
        style={{marginVertical: 15}}
        renderTabBar={renderTabBar}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    width: wp(91),
    alignSelf: 'center',
    height: hp(6.8),
    borderRadius: hp(6.8) / 2,
    borderColor: '#E6E8EC',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(44),
    height: hp(6.1),
    borderRadius: hp(6.1) / 2,
  },
  activeItem: {
    marginLeft: 2,
    width: wp(44),
    height: hp(6.1),
    borderRadius: hp(6.1) / 2,
    backgroundColor: 'black',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  active: {
    color: '#fff',
  },
  inactive: {
    color: 'black',
  },
  icon: {
    height: 26,
    width: 26,
  },
  label: {
    fontSize: 16,
    color: '#23262F',
    textAlign: 'center',
    fontWeight: '700',
  },
  safearea: {flex: 1, backgroundColor: Colors.Background},
  route: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  headtxt: {fontSize: 20, color: Colors.Primary},
  tabstyle: {
    borderRadius: 25,
    height: hp(6.5),
    backgroundColor: '#fff',
  },
  mainbox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 22,
  },
  backbtn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(3.9),
    width: hp(3.9),
    borderRadius: hp(3.9) / 2,
    backgroundColor: '#E6E8EC',
  },
  userimg: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 40,
  },
  tabbarcontainer: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 1)',
    borderRadius: 8,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    marginTop: 15,
    // borderWidth:1,
    width: wp(92),
    alignSelf: 'center',
  },
  back: {
    // marginLeft: 10,
    backgroundColor: '#E6E8EC',
    width: 25,
    height: 25,
    borderRadius: 15,
    elevation: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: '#23262F',
    textAlign: 'center',
    fontWeight: '700',
  },
  img: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 40,
  },
  tabbarView: {
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    width: wp(92),
    alignSelf: 'center',
    borderWidth: 0.5,
    borderRadius: 25,
    borderColor: '#E6E8EC',
  },
  tabbarItem: {
    width: wp(45),
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(6),
    borderRadius: 25,
    position: 'absolute',
    alignSelf: 'center',
    top: hp(-3),
  },
});

export default Operators;
