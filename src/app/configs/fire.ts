
export const __PATH__CALC_TRANSMIT = '/__CALC__/__TRANSMITS__/';
export const __PATH__CALC_TRANSMIT_DETAIL = '/__CALC__/__TRANSMITS__DETAIL/';
export const __PATH__CALC_TRANSMIT_LOGS = '/__CALC__/__TRANSMITS__LOGS/';

/** TRANSMIT */
export const __PATH_MESSAGES = '/__MESSAGES__/';
export const __PATH_TRANSMITS_SUPPLIERINFO = '/__SERVICES__/__TRANSMITS__/__SUPPLIERS__UIDLIST/';
export const __PATH_TRANSMITS_SUPPLIERS = '/__SERVICES__/__TRANSMITS__/__SUPPLIERS__UIDLIST/';
export const __PATH_TRANSMITS_ORDERS = '/__SERVICES__/__TRANSMITS__/__ORDERS__UIDLIST/';
export const __PATH_TRANSMITS_RATES = '/__SERVICES__/__TRANSMITS__/__RATES__UIDLIST/';
export const __PATH_USERS_TRANSMITS_ORDERS = '/__USERS__/**PHONE**/__TRANSMITS__/__ORDERS__LIST/'; // + SupplierUID/OrderKEY/
export function getPathUsersTransmitsOrders(phone: string) {
  return __PATH_USERS_TRANSMITS_ORDERS.replace('**PHONE**',phone);
}
/** USERDATA */
export const __PATH__USERSDATA_MESSAGES_SELF = '/__USERSDATA__/__MESSAGES_SELF__UIDLIST/';
export const __PATH__USERSDATA_MESSAGES
  = '/__USERSDATA__/__MESSAGES__UIDLIST/';
export const __PATH__USERSDATA_INFOS
  = '/__USERSDATA__/__INFOS__UIDLIST/';

export const __PATH__USERSDATA_TRANSMIT_RECEIVERS
  = '/__USERSDATA__/__TRANSMIT_RECEIVERS__UIDLIST/';

// AF2 Settings
export const firebaseConfig = {
  apiKey: "AIzaSyAiAb-byQEU69iojzVAPJVnw4QmNfhWoGI",
  authDomain: "ionic3-42c8d.firebaseapp.com",
  databaseURL: "https://ionic3-42c8d.firebaseio.com",
  projectId: "ionic3-42c8d",
  storageBucket: "ionic3-42c8d.appspot.com",
  messagingSenderId: "963007058311"
};
