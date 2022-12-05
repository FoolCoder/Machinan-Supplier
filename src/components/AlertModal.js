import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Modal} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {hp, wp} from './Responsive';
import Images from '../utils/Images';

//status must be Succesful or Failure

const AlertModal = props => {
  const {setModalVisible, modalVisible, msg, navigation, status, screen} =
    props;
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}>
      <View style={styles.modal}>
        <View style={styles.modalView}>
          <Image
            resizeMode="contain"
            style={styles.img}
            source={status == 'Successful' ? Images.successful : Images.failure}
          />
          <Text style={styles.modalText}>{status}</Text>
          <Text style={{textAlign: 'center'}}>{msg ? msg : null}</Text>
          <View style={{flex: 1, justifyContent: 'flex-end'}}>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setModalVisible(!modalVisible);
                screen
                  ? navigation()
                  : status == 'Failure'
                  ? null
                  : navigation();
              }}>
              <Text style={styles.textStyle}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: wp(80),
    height: hp(40),
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    width: wp(25),
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: 'black',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginVertical: 15,
    textAlign: 'center',
    fontSize: hp(2.5),
    fontWeight: '700',
  },
  img: {
    height: 40,
    width: 40,
  },
});

export default AlertModal;
