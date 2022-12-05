import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Colors from '../utils/Colors';

const Loader = () => {
  return (
    <View style={styles.route}>
      <ActivityIndicator color={Colors.Primary} size={50}></ActivityIndicator>
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  route: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
