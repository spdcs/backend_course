// npm install firebase

// ref: https://firebase.google.com/docs/database/web/read-and-write

var express = require('express');
var router = express.Router();

const firebase = require('firebase')
const uuidv4 = require('uuid/v4')
const jwt = require('jsonwebtoken');

var config = {
    databaseURL: "https://big-keyword-142607.firebaseio.com" // enter your databaseURL（輸入由firebase中申請到的firebase的databaseURL）
};

firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();
//會員註冊
router.post('/member', function(req, res, next){
  const username = req.body.username
  const password = req.body.password
  //判斷是否輸入正確的key
  if (username === undefined || password === undefined || username === '' || password === ''){
    res.status(400).json({
      result: '請在request的輸入username及pw的key值'
    })
    return;
  }
  // set -> 建立新資料 使用uuid來做唯一值
  firebase.database().ref('members/' + uuidv4()).set({
      // name: req.body.name,
      // price: req.body.price
      username,
      password
  });
  res.status(200).json({
    result: "會員註冊成功"
  })
})


//提取全部資料
router.get('/member/all', function(req, res, next){
  // once -> 取得資料
  firebase.database().ref('members/').once('value', function (snapshot) {
      // console.log(snapshot.val());
      res.status(200).json({
        result: snapshot.val()
      })
  });
})

//提取單一資料
router.get('/member', function(req, res, next){
  const id = req.query.id;
  if (id === undefined || id === ''){
    res.status(400).json({
      result: '請在request的輸入name及price的key值，在query中輸入id值'
    })
    return;
  }
  // once -> 取得資料
  firebase.database().ref('members/' + id).once('value', function (snapshot) {
      // console.log(snapshot.val());
      res.status(200).json({
        result: snapshot.val()
      })
  });
})

//編輯會員資料
router.put('/member', function(req, res, next){
  const id = req.query.id
  const username = req.body.username
  const password = req.body.password
  //判斷是否輸入正確的key
  if (id === undefined || id === ''){
    res.status(400).json({
      result: '請在request的輸入name及price的key值，在query中輸入id值'
    })
    return;
  }
  // update -> 更新指定資料
  firebase.database().ref('members/' + id).update({
      username,
      password
  });
  res.json({
    result: "更新會員資料成功"
  })
})


router.delete('/member', function(req, res, next){
  const id = req.query.id
  if (id === undefined || id === ''){
    res.status(400).json({
      result: '請在query中輸入id值'
    })
    return;
  }
  // remove -> 刪除指定資料
  firebase.database().ref('members/' + id).remove()

  });

  //登入帳號確認
  router.post('/login', function(req, res, next){
    const username = req.body.username
    const password = req.body.password
    if (username === undefined || password === undefined || username === '' || password === ''){
      res.status(400).json({
        result: '請在request的輸入username及pw的key值'
      })
      return;
    }

    firebase.database().ref('members/').orderByChild('username').
    equalTo(username).on('value', function (snapshot) {
      if (snapshot.val() === null){
        res.json({
          result: '無此帳號'
        })
        return
      }
      //token
      const token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        data: username
      }, 'secret');

      const decoded = jwt.verify(token, 'secret');
      res.json({
        token
      })
    });
  })

  //新增訂單
  router.post('/order', function(req, res, next){
    const productName = req.body.productName
    const variety = req.body.variety
    const token = req.query.token
    // console.log('productName: ' ,productName)
    // console.log('variety: ' ,variety)
    if (productName === undefined || variety === undefined || token === undefined || productName === '' || variety === '' || token === ''){
      res.status(400).json({
        result: '請在request的輸入productName及variety的key值，在query中輸入token值'
      })
      return;
    }
    const decoded = jwt.verify(token, 'secret')
    const username = decoded.data

    firebase.database().ref('orders/'+ uuidv4()).set({
      username,
      productName,
      variety,
    });
    res.status(200).json({
      result: '產品新增成功'
    })

  })

  //更改訂單
  router.put('/order', function(req, res, next){
    const productName = req.body.productName
    const variety = req.body.variety
    const token = req.query.token
    const id = req.query.id
    if (productName === undefined || variety === undefined || token === undefined || id === undefined ||  productName === '' || variety === '' || token === '' || id === ''){
      res.status(400).json({
        result: '請在request的輸入productName及variety的key值，在query中輸入id值'
      })
      return;
    }
    const decoded = jwt.verify(token, 'secret')
    const username = decoded.data

    firebase.database().ref('orders/'+ id).update({
      username,
      productName,
      variety,
    });
    res.status(200).json({
      result: '訂單更改成功'
    })

  })





module.exports = router;
