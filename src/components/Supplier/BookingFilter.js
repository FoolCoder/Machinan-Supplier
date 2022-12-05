import {StyleSheet, Text, View, Modal, TouchableOpacity} from 'react-native';
import React from 'react';
import {useState} from 'react';
import {Button} from '@rneui/base';
import DatePicker from 'react-native-modern-datepicker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Colors from '../../utils/Colors';
import {ButtonGroup} from '@rneui/themed';

const BookingFilter = ({visible, setVisible, navigation}) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedIndexes, setSelectedIndexes] = useState([]);

  const Selection = ({text, check}) => {
    return (
      <TouchableOpacity
        style={{
          ...styles.container,
          width: '45%',
          borderColor: check ? '#F39200' : '#1D1D2C',
        }}>
        {check ? (
          <View style={styles.checker}>
            <FontAwesome
              name={'check'}
              //arrow-down
              color="#00000"
              size={12}
            />
          </View>
        ) : null}
        <Text style={{color: Colors.White}}>{text}</Text>
      </TouchableOpacity>
    );
  };

  const Selection2 = ({text, check}) => {
    return (
      <TouchableOpacity
        style={{
          ...styles.container,
          borderColor: check ? '#F39200' : '#1D1D2C',
        }}>
        {check ? (
          <View style={styles.checker}>
            <FontAwesome
              name={'check'}
              //arrow-down
              color="#00000"
              size={12}
            />
          </View>
        ) : null}
        <Text style={{color: Colors.White}}>{text}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        setVisible(!visible);
      }}>
      <View
        style={{
          backgroundColor: 'rgba(255, 255, 255,0.98)',
          flex: 1,
        }}>
        <View>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => setVisible(!visible)}
              style={styles.backbtn}>
              <FontAwesome
                name={'chevron-left'}
                //arrow-down
                color="#23262F"
                size={14}
              />
            </TouchableOpacity>
            <Text style={{fontWeight: 'bold', fontSize: 16}}>Filter</Text>
            <View style={{width: hp(3.9)}} />
          </View>
          <DatePicker
            style={{backgroundColor: 'rgba(255, 255, 255,0)'}}
            mode="calendar"
            onSelectedChange={date => setSelectedDate(date)}
          />
        </View>
        <View style={styles.bottomcontainer}>
          <Text style={{color: Colors.White, marginVertical: 10}}>
            Categories
          </Text>
          <View>
            <View style={styles.selectioncontainer}>
              <Selection text="Moving" />
              <Selection text="Road" check={true} />
            </View>
            <View style={styles.selectioncontainer}>
              <Selection text="Earth Moving" check={true} />
              <Selection text="Lifting" />
            </View>

            <Text style={{color: Colors.White, marginVertical: 10}}>
              Booking Status
            </Text>
            <View style={styles.selectioncontainer}>
              <Selection2 text="Open" />
              <Selection2 text="Disputed" check={true} />
              <Selection2 text="Booked" />
            </View>
          </View>
          <TouchableOpacity style={styles.applybtn}>
            <Text style={{color: Colors.White}}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    height: hp(4.6),
    width: '28%',

    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  checker: {
    position: 'absolute',
    height: hp(2),
    width: hp(2),
    borderRadius: hp(2) / 2,
    backgroundColor: 'white',
    alignSelf: 'flex-end',
    top: -5,
    right: -5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    margin: 18,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  backbtn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(3.9),
    width: hp(3.9),
    borderRadius: hp(3.9) / 2,
    backgroundColor: '#E6E8EC',
  },
  bottomcontainer: {
    flex: 1,
    backgroundColor: 'black',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    marginTop: -40,
  },
  selectioncontainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 10,
  },
  applybtn: {
    height: hp(6),
    width: '90%',
    borderColor: 'white',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    alignSelf: 'center',

    marginTop: 15,
  },
});

export default BookingFilter;
