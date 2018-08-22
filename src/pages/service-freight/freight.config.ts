/**
 * 郵寄訂單狀態  FREIGHT_ORDERSTATUS_PATH
 * 郵寄付款方式  FREIGHT_PAYTYPES_PATH
 * 郵寄廠商資訊  FREIGHT_VENDOR_PATH
 *   - 箱子 FREIGHT_BOXS_PATH
 *   - 贈品 FREIGHT_GIFTS_PATH
 *
 *   - 郵寄訂單 FREIGHT_ORDERS_PATH
 */

/**
 * 郵寄訂單狀態  FREIGHT_ORDERSTATUS_SCHEMA
 * 郵寄付款方式  FREIGHT_PAYTYPES_SCHEMA
 * 郵寄廠商資訊  FREIGHT_VENDOR_SCHEMA
 *   - 箱子 FREIGHT_BOXS_SCHEMA
 *   - 贈品 FREIGHT_GIFTS_SCHEMA
 *
 *   - 郵寄訂單 FREIGHT_ORDERS_SCHEMA
 */
export const FREIGHT_VENDOR_PATH
  = '/__SERVICE_FREIGHT__/__VENDORS_UIDLIST__/';
export const FREIGHT_BOXS_PATH
= '/__SERVICE_FREIGHT__/__BOXS_UIDLIST__/';
export const FREIGHT_GIFTS_PATH
= '/__SERVICE_FREIGHT__/__GIFTS_UIDLIST__/';
export const FREIGHT_ORDERS_PATH
= '/__SERVICE_FREIGHT__/__ORDERS_UIDLIST__/';
export const FREIGHT_PAYTYPES_PATH
= '/__SERVICE_FREIGHT__/__PAYTYPES_UIDLIST__/';
export const FREIGHT_ORDERSTATUS_PATH
= '/__SERVICE_FREIGHT__/__ORDERSTATUS__/';
export const FREIGHT_MAILSTATUS_PATH
= '/__SERVICE_FREIGHT__/__MAILSTATUS__/';

export const FREIGHT_PAYTYPES_SCHEMA = {  // 付款方式
  schema: {
    type: 'object',
    properties: {
      'key': { 'type': 'string' },
      'FPKey': { 'type': 'string' },

      'FPName': { 'type': 'string' },  // 付款方式
      'FPLogic': { 'type': 'string' },  // 付款程式邏輯

    },
    required: [
      'FPKey', 'FPName',
    ],
  },
  layout: [
    {
      'key': 'FPKey',
      'title': '付款方式編號',
    }, {
      'key': 'FPName',
      'title': '付款方式',
    },
  ],
  tablecols: {
    title: [
      '付款方式編號', '付款方式',
    ],
    index: [
      'FPKey', 'FPName',
    ],
  },
  firebase: FREIGHT_PAYTYPES_PATH,
};
export function getPathUsersFreightOrders(uid: string) {
  return '/__USERS__/**UID**/__FREIGHT__/__ORDERS__LIST/'.replace('**UID**',uid);
  // return '/__SERVICE_FREIGHT__/__ORDERS_UIDLIST__/';
}
export const FREIGHT_ORDERS_SCHEMA = {  // 訂單
  schema: {
    type: 'object',
    properties: {
      'key': { 'type': 'string' },
      '_Date': { 'type': 'string' },
      'FBKey': { 'type': 'string' },
        // 'BSize': { 'type': 'string' },
        // 'BDeposit': { 'type': 'number' },
        // 'BBlance': { 'type': 'number' },

      // 'FOAmount': { 'type': 'string' },  // 數量
      'FOBoxs': { 'type': 'Array' },  // 加購贈品
      'FOGifts': { 'type': 'Array' },  // 加購贈品
      'FODeposit': { 'type': 'number' },  // 總預付
      'FOBlance': { 'type': 'number' },  // 總尾款

      'FOPayType': { 'type': 'number' },  // 付款方式

      'Name': { 'type': 'string' },
      'Phone': { 'type': 'string' },
      'Country': { 'type': 'string' },

      'UID': { 'type': 'string' },
      'Address': { 'type': 'string' },
      'Remark': { 'type': 'string' },


    },
    required: [
      'FG_Name', 'FG_Price',
    ],
  },
  layout: [

  ],
  tablecols: {

  },
  firebase: FREIGHT_ORDERS_PATH,
};
export const FREIGHT_GIFTS_SCHEMA = {  // 贈品
  schema: {
    type: 'object',
    properties: {
      'key': { 'type': 'string' },
      '_date': { 'type': 'number' },

      'FGKey': { 'type': 'string' },
      'FGPics': { 'type': 'string' },
      'FGName': { 'type': 'string' },
      'FGPrice': { 'type': 'string' },
      'FO_Num': { 'type': 'number' },
    },
    required: [
      'FGName', 'FGPrice',
    ],
  },
  layout: [
    {
      'key': 'FGPics',
      'title': '贈品照片',
    },
    {
      'key': 'FGKey',
      'title': '贈品編號',
    },
    {
      'key': 'FGName',
      'title': '贈品名稱',
    }, {
      'key': 'FGPrice',
      'title': '加購價',
    },
  ],
  tablecols: {
    title: [
      '贈品照片', '贈品編號', '贈品名稱', '加購價', ],
    index: [
      'FGPics', 'FGKey', 'FGName', 'FGPrice',  ],
  },
  firebase: FREIGHT_GIFTS_PATH,
};
export const FREIGHT_BOXS_SCHEMA = {  // 箱子
    schema: {
      type: 'object',
      properties: {
        'key': { 'type': 'string' },
        '_date': { 'type': 'number' },
        'FBPics': { 'type': 'string' },
        'FBKey': { 'type': 'string' },
        'FBSize': { 'type': 'string' },
        'FBDeposit': { 'type': 'number' },
        'FBBlance': { 'type': 'number' },
        'FO_Num': { 'type': 'number' },
      },
      required: [
        'FBKey', 'FBSize', 'FBDeposit', 'FBBlance',
      ],
    },
    layout: [

      {
        'key': 'FBKey',
        'title': '箱子編號',
      }, {
        'key': 'FBSize',
        'title': '箱子尺寸',
      }, {
        'key': 'FBDeposit',
        'title': '預付金額',
      }, {
        'key': 'FBBlance',
        'title': '尾款',
      },
    ],
    tablecols: {
      title: [
        '箱子編號', '箱子編號', '箱子尺寸', '預付金額', '尾款',
      ],
      index: [
        'FBPics', 'FBKey', 'FBSize', 'FBDeposit', 'FBBlance',
      ],
    },
    firebase: FREIGHT_BOXS_PATH,
};
export const FREIGHT_ORDERSTATUS_SCHEMA = {
  schema: {
    type: 'object',
    properties: {
      // 'StateID': { 'type': 'string', },
      'Tag': { 'type': 'string', },

      '_State_ID': { 'type': 'number', },
      '_State': { 'type': 'string', },
      '_Color': {
        'type': 'string',
        'enumNames': [
          '綠色', '藍色', '天藍色', '深黃色', '紅色'
        ],
        'enum': [
          '#27c24c', '#5d9cec', '#23b7e5', '#ff902b', '#f05050'
        ]
      },
      'Message': { 'type': 'string', },
      'key': { 'type': 'string'},
    },
    required: [
      'Tag', 'Color', 'Message'
    ],
  },
  layout: [{
    'key': 'Tag_ID',
    'title': '辨識號碼',
  }, {
    'key': 'Tag',
    'title': '處理標籤',
  }, {
    'key': 'Color',
    'title': '顏色',
  }, {
    'key': 'Message',
    'title': '訊息',
  }],
  tablecols: {
    title: ['TAG_ID', '處理標籤', '顏色', '細節'],
    index: ['Tag_ID', 'Tag', 'Color', 'Message'],
  },
  firebase: FREIGHT_ORDERSTATUS_PATH + 'aF18W0coFWNGsroWaEei6D4l58k2/',
};
