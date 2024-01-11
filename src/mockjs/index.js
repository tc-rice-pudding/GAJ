// 引用 Mock
const Mock = require('mockjs')
 
Mock.mock(/\/dcim\/space\/getUserName\?key=.*/, "get", {
  result:[
    'Option1',
    'Option2',
    'Option3',
  ],
  status: 200,
  message: 'ok',
});
Mock.mock(/\/dcim\/space\/getBusinessSystem\?key=.*/, "get", {
  result:[
    'Option4',
    'Option5',
    'Option6',
  ],
  status: 200,
  message: 'ok',
});