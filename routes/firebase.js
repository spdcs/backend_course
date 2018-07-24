// npm install firebase

// ref: https://firebase.google.com/docs/database/web/read-and-write

var express = require('express');
var router = express.Router();

const firebase = require('firebase')
const uuidv4 = require('uuid/v4')

var config = {
    databaseURL: "https://big-keyword-142607.firebaseio.com" // enter your databaseURL（輸入由firebase中申請到的firebase的databaseURL）
};

firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();
//新增產品
router.post('/product', function(req, res, next){
  const name = req.body.name
  const price = req.body.price
  //判斷是否輸入正確的key
  if (name === undefined || price === undefined || name === '' || price === ''){
  // console.log('name:' ,name)
    res.status(400).json({
      result: '請在request的輸入name及price的key值'
    })
    return;
  }
  // set -> 建立新資料 使用uuid來做唯一值
  firebase.database().ref('products/' + uuidv4()).set({
      // name: req.body.name,
      // price: req.body.price
      name,
      price
  });
  res.status(200).json({
    result: "新增產品成功"
  })
})


//提取全部資料
router.get('/product/all', function(req, res, next){
  // once -> 取得資料
  firebase.database().ref('products/').once('value', function (snapshot) {
      // console.log(snapshot.val());
      res.status(200).json({
        result: snapshot.val()
      })
  });
})

//提取單一資料
router.get('/product', function(req, res, next){
  const id = req.query.id
    if (id === undefined || id === '') {
        res.status(400).json({
            result: '請在request的輸入id的query值。'
        })
        // 若沒加該行return會造成一個重複給response中的錯誤
        return
      }
  // once -> 取得資料
  firebase.database().ref('products/' + id).once('value', function (snapshot) {
      // console.log(snapshot.val());
      res.status(200).json({
        result: snapshot.val()
      })
  });
})

//老師的code
// router.get('/product', function (req, res, next) {
//     // console.log('query value: ', req.query.id)
//     const id = req.query.id
//     if (id === undefined || id === '') {
//         res.status(400).json({
//             result: '請在request的輸入id的query值。'
//         })
//         // 若沒加該行return會造成一個重複給response中的錯誤
//         return
//     }
//     firebase.database().ref('products/' + id).once('value', function (snapshot) {
//         // console.log(snapshot.val());
//         res.status(200).json({
//             result: snapshot.val()
//         })
//     });
// })




//編輯產品
router.put('/product', function(req, res, next){
  const id = req.query.id
  const name = req.body.name
  const price = req.body.price
  //判斷是否輸入正確的key
  if (id === undefined || id === ''){
    res.status(400).json({
      result: '請在request的輸入name及price的key值，在query中輸入id值'
    })
    return;
  }
  // update -> 更新指定資料
  firebase.database().ref('products/' + id).update({
      name,
      price
  });
  res.json({
    result: "已完成產品更新資料"
  })
})


//對應的sql ＠delete from product
router.delete('/product', function(req, res, next){
  const id = req.query.id
  if (id === undefined || id === ''){
    res.status(400).json({
      result: '請在query中輸入id值'
    })
    return;
  }
  // remove -> 刪除指定資料
  firebase.database().ref('products/' + id).remove()

  });









//
//
//
// // set middleware
// router.use('/',function (req, res, next) {
//     const onTime = new Date()
//     console.log(onTime)
//     next()
//   })
//
//
//
// router.post('/postdata', function(req, res, next){
//   // set -> 建立新的資料
//
// })
//
// router.put('/putdata', function(req, res, next){
//   // update -> 更新指定資料
//   firebase.database().ref('users/' + req.query.id).update({
//       username: req.body.username,
//       email: req.body.email
//   });
//   res.json({
//     result: "已完成更新資料"
//   })
// })
//
// router.delete('/deletedata', function(req, res, next){
//   // remove -> 刪除指定資料
//   firebase.database().ref('users/' + req.body.users).remove()
//
//   });
//
// router.get('/', function (req, res, next) {
//
//
//
//      // set -> 建立新的資料
//
//
//     // update -> 更新指定資料
//
//
//     // once -> 取得資料
//
//
//     // remove -> 刪除指定資料
//
// });

module.exports = router;
