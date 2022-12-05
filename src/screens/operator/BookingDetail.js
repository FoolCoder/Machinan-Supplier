import React, {useRef} from 'react';
import {useSelector} from 'react-redux';

import PlaceBid from '../../components/PlaceBid';

const BookingDetail = ({navigation, route}) => {
  return <PlaceBid navigation={navigation} route={route} />;
};

export default BookingDetail;
