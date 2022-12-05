import {types} from '@babel/core';
import {CommonActions} from '@react-navigation/native';
import {Alert} from 'react-native';
import {setOperatorDashBoard, setSupplierDashBoard} from '../redux/reducer';
import Images from './Images';


const getSupplierBookings = (token, position) => {
  const URL =
    apiBaseUrl +
    `supplier/bookings?latitude=${position?.coords.latitude}&longitude=${position?.coords.longitude}`;
  return fetch(URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: null,
  }).then(res => res.json());
};

const getOperatorBookings = (token, position) => {
  const URL =
    apiBaseUrl +
    `operator/bookings?latitude=${position?.coords.latitude}&longitude=${position?.coords.longitude}`;
  return fetch(URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: null,
  }).then(res => res.json());
};

const getOperators = token => {
  const URL = apiBaseUrl + `supplier/operators-and-riggers`;
  return fetch(URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: null,
  }).then(res => res.json());
};

const getSupplierMyBookings = (token, position) => {
  const URL =
    apiBaseUrl +
    `supplier/bookings/mine?latitude=${position?.coords.latitude}&longitude=${position?.coords.longitude}`;
  return fetch(URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: null,
  }).then(res => res.json());
};

const getOperatorMyBookings = (token, position) => {
  const URL =
    apiBaseUrl +
    `operator/bookings/mine?latitude=${position?.coords.latitude}&longitude=${position?.coords.longitude}`;
  return fetch(URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: null,
  }).then(res => res.json());
};

const getSupplierEquipment = token => {
  const URL = apiBaseUrl + `supplier/equipments`;
  return fetch(URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: null,
  }).then(res => res.json());
};

const getSupplierBidData = (token, id, type) => {
  let URL;
  if (type == 'Operator') {
    URL = apiBaseUrl + `operator/bids/required-data?booking_id=${id}`;
  } else {
    URL = apiBaseUrl + `supplier/bids/required-data?booking_id=${id}`;
  }
  return fetch(URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: null,
  }).then(res => res.json());
};

const getOperatorBidData = (token, id) => {
  const URL = apiBaseUrl + `operator/bids/required-data?booking_id=${id}`;
  return fetch(URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: null,
  }).then(res => res.json());
};

const getDashboardData = (token, userType, navigation, dispatch) => {
  let URL;
  if (userType == 'Supplier') {
    URL = apiBaseUrl + `supplier/dashboard`;
  } else {
    URL = apiBaseUrl + `operator/dashboard`;
  }
  fetch(URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: null,
  })
    .then(res =>
      res.json().then(Res => {
        if (Res.response == 101) {
          switch (userType) {
            case 'Supplier':
              dispatch(
                setSupplierDashBoard([
                  {
                    id: 0,
                    img: Images.ActiveB,
                    value: Res?.data?.active_bookings,
                    name: 'Active Bookings',
                  },
                  {
                    id: 1,
                    img: Images.AvailableB,
                    value: Res?.data?.total_available_bookings,
                    name: 'Available Bookings',
                  },
                  {
                    id: 2,
                    img: Images.totalE,
                    value: Res?.data?.earnings_this_month,
                    name: 'Total Earnings',
                  },
                  {
                    id: 3,
                    img: Images.MessageA,
                    value: Res?.data?.alerts,
                    name: 'Message Alerts',
                  },
                ]),
              ),
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{name: 'SupplierNavigator'}],
                  }),
                );
              break;
            case 'Operator':
              dispatch(
                setOperatorDashBoard([
                  {
                    id: 0,
                    img: Images.ActiveB,
                    value: Res?.data?.active_bookings,
                    name: 'Active Bookings',
                  },
                  {
                    id: 1,
                    img: Images.AvailableB,
                    value: Res?.data?.available_bookings,
                    name: 'Available Bookings',
                  },
                  {
                    id: 2,
                    img: Images.totalE,
                    value: Res?.data?.earnings_this_month,
                    name: 'Total Earnings',
                  },
                  {
                    id: 3,
                    img: Images.MessageA,
                    value: Res?.data?.alerts,
                    name: 'Message Alerts',
                  },
                ]),
              ),
                navigation.dispatch(
                  CommonActions.reset({
                    index: 1,
                    routes: [{name: 'OperatorNavigator'}],
                  }),
                );
            default:
              break;
          }
        }
      }),
    )
    .catch(e => {
      Alert.alert('Error', e.message);
    });
};

const getOperatorDashboardData = token => {
  return fetch(URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: null,
  }).then(res => res.json());
};

const checkPhoneSupplier = (phone, type) => {
  let URL;
  switch (type) {
    case 'Supplier':
      URL = apiBaseUrl + `supplier/phone-check`;

      break;
    case 'Operator':
      URL = apiBaseUrl + `operator/phone-check`;

      break;
    default:
      break;
  }

  const formData = new FormData();

  formData.append('phone', phone);

  return fetch(URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
    body: formData,
  }).then(res => res.json());
};

const placeBidAsSupplier = (
  token,
  bookingId,
  eta,
  operatorId,
  equipmentId,
  riggers,
  price,
  lat,
  lng,
  type,
) => {
  let URL;
  if (type == 'Supplier') {
    URL = apiBaseUrl + `supplier/bids/store`;
  } else {
    URL = apiBaseUrl + `operator/bids/store`;
  }

  const formData = new FormData();

  formData.append('booking_id', bookingId);
  formData.append('eta', eta);
  if (type == 'Supplier') {
    formData.append('operator_id', operatorId);
    formData.append('equipment_id', equipmentId);
  }
  riggers?.map(item => {
    formData.append('riggers_id[]', item.id);
  });
  formData.append('price', price);
  formData.append('latitude', lat);
  formData.append('longitude', lng);

  return fetch(URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: formData,
  }).then(res => res.json());
};

const placeBidAsOperator = (token, bookingId, eta, price, lat, lng) => {
  const URL = apiBaseUrl + `operator/bids/store`;

  const formData = new FormData();

  formData.append('booking_id', bookingId);
  formData.append('eta', eta);
  formData.append('price', price);
  formData.append('latitude', lat);
  formData.append('longitude', lng);
  return fetch(URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: formData,
  }).then(res => res.json());
};

const changeBookingStatus = (token, bookingId, status, position) => {
  const URL =
    apiBaseUrl +
    `bookings/change-status?booking_id=${bookingId}&status=${status}&latitude=${
      position?.coords.latitude ? position?.coords.latitude : 0
    }&longitude=${position?.coords.longitude ? position?.coords.longitude : 0}`;
  // const formData = new FormData()

  // formData.append("phone", phone)

  return fetch(URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: null,
  }).then(res => res.json());
};

const changeBidStatus = (token, bidId) => {
  const URL = apiBaseUrl + `bids/cancel?bid_id=${bidId}`;
  // const formData = new FormData()

  // formData.append("phone", phone)

  return fetch(URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: null,
  }).then(res => res.json());
};

const getDisputeData = (token, id) => {
  const URL = apiBaseUrl + `bookings/dispute/show?booking_id=${id}`;
  return fetch(URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: null,
  }).then(res => res.json());
};

const createDispute = (token, bookingId, message) => {
  const URL = apiBaseUrl + `bookings/dispute/store`;

  const formData = new FormData();

  formData.append('booking_id', bookingId);
  formData.append('message', message);

  return fetch(URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + token,
    },
    body: formData,
  }).then(res => res.json());
};

const replyDispute = (token, disputeId, message) => {
  const URL = apiBaseUrl + `bookings/dispute/reply/store`;

  const formData = new FormData();

  formData.append('dispute_id', disputeId);
  formData.append('message', message);

  return fetch(URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + token,
    },
    body: formData,
  }).then(res => res.json());
};

const getNotifications = token => {
  const URL = apiBaseUrl + `notifications`;
  return fetch(URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: null,
  }).then(res => res.json());
};

const readNotifications = token => {
  const URL = apiBaseUrl + `notifications/mark-read`;
  return fetch(URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: null,
  }).then(res => res.json());
};
const operatorUpdateLocation = (id, lat, lng, token) => {
  const URL =
    apiBaseUrl +
    `operator/bookings/update-location?booking_id=${id}&latitude=${lat}&longitude=${lng}`;
  return fetch(URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: null,
  }).then(res => res.json());
};
const getBookingDetail = (id, lat, lng, token) => {
  const URL =
    apiBaseUrl +
    `bookings/all-details?booking_id=${id}&latitude=${lat}&longitude=${lng}`;
  return fetch(URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: null,
  }).then(res => res.json());
};
const getRiggerOperatorDet = (id, type, token) => {
  const URL =
    apiBaseUrl + `supplier/operators-and-riggers/detail?id=${id}&type=${type}`;
  return fetch(URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: null,
  }).then(res => res.json());
};
const getEquipmentDetail = (id, token) => {
  const URL = apiBaseUrl + `supplier/equipments/detail?equipment_id=${id}`;
  return fetch(URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: null,
  }).then(res => res.json());
};
const allowedBid = (id, type, token) => {
  const URL = apiBaseUrl + `supplier/operators/bid-allowed`;
  const formData = new FormData();

  formData.append('operator_id', id);
  formData.append('bid_allowed', type);
  return fetch(URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: formData,
  }).then(res => res.json());
};
const getEquipment = (id, token) => {
  const URL = apiBaseUrl + `supplier/equipments/available?operator_id=${id}`;
  const formData = new FormData();
  formData.append('operator_id', id);
  return fetch(URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: null,
  }).then(res => res.json());
};
const removeEquipment = (id, equipmentId, token) => {
  const URL =
    apiBaseUrl +
    `supplier/equipments/remove-assignment?operator_id=${id}&equipment_id=${equipmentId}`;
  const formData = new FormData();
  formData.append('operator_id', id);
  return fetch(URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: null,
  }).then(res => res.json());
};
const assignEquipment = (id, equipmentId, token) => {
  const URL =
    apiBaseUrl +
    `supplier/equipments/assign?operator_id=${id}&equipment_id=${equipmentId}`;
  const formData = new FormData();
  formData.append('operator_id', id);
  return fetch(URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: null,
  }).then(res => res.json());
};
const updateprofile = (token, type, photo) => {
  const URL = apiBaseUrl + `${type}/profile/update`;
  const formData = new FormData();

  {
    photo && formData.append('photo', photo);
  }
  return fetch(URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + token,
    },
    body: photo ? formData : null,
  }).then(res => res.json());
};
export default {
  apiBaseUrl,
  assetsBaseUrl,
  assignEquipment,
  removeEquipment,
  getEquipment,
  allowedBid,
  getBookingDetail,
  operatorUpdateLocation,
  getSupplierBookings,
  getSupplierMyBookings,
  getDashboardData,
  checkPhoneSupplier,
  getSupplierEquipment,
  getSupplierBidData,
  placeBidAsSupplier,
  getOperators,
  getOperatorBookings,
  getOperatorMyBookings,
  getOperatorBidData,
  placeBidAsOperator,
  changeBookingStatus,
  changeBidStatus,
  getDisputeData,
  createDispute,
  replyDispute,
  getNotifications,
  readNotifications,
  getRiggerOperatorDet,
  getEquipmentDetail,
  updateprofile,
};
