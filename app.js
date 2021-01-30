'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
var Luu_tru = require("./Xu_ly/XL_LUU_TRU")
var messengerButton = "<html><head><title>Facebook Messenger Bot</title></head><body><h1>Facebook Messenger Bot</h1>This is a bot based on Messenger Platform QuickStart. For more details, see their <a href=\"https://developers.facebook.com/docs/messenger-platform/guides/quick-start\">docs</a>.<script src=\"https://button.glitch.me/button.js\" data-style=\"glitch\"></script><div class=\"glitchButton\" style=\"position:fixed;top:20px;right:20px;\"></div></body></html>";
var PAGE_ACCESS_TOKEN = "EAAJumKeUliYBAFxcknB9m4FXJKUXYvJHKY3S7dlZBgrGCBwYM1swgmJUUc8YcJjdxKfdwnqZAiIH4a0XTegEiljERmBJiQfIQT8LfWN6ByebNNK3by0KOXted4u2XzXsAzYiU15cs3OAtTw2Gnu284t8kbFU4qETKeg2GmxUF00Pmc70EgX6UlIQT91n7FujxBPYciXPDRFLswseZCT";
var VERIFY_TOKEN = "vietanh";
var Du_lieu = {}
var listUser = ["3043075672420456"];
var Danh_sach_Nhan_vien = Luu_tru.Doc_Danh_sach_Nhan_vien()

Danh_sach_Nhan_vien.then(Kq => {
  Du_lieu.Danh_sach_Nhan_vien = Kq;
})
// The rest of the code implements the routes for our Express server.
let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Webhook validation
app.get('/webhook', function (req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === VERIFY_TOKEN) {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
});

// Display the web page
app.get('/', function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(messengerButton);
  res.end();
});

// Display the web page
app.get('/test', function (req, res) {

  res.write(JSON.stringify(Du_lieu.Danh_sach_Nhan_vien));
  res.end();
});

// Display the web page
app.get('/apply', function (req, res) {
  function myFunc(arg) {
    var today = new Date();
    var date = today.getHours() + '-' + today.getMinutes() + "-" + today.getSeconds();
    sendTextMessage(arg, "Xin chào nhóc ác :) " + date);
    console.log(`arg was => ${arg}`);
  }
  var j = 120000;
  for (var i = 0; i < 200; i++) {
    j = j * 2;
    listUser.forEach(x => {
      setTimeout(myFunc, j, x);
    })
  }

  res.write(JSON.stringify(listUser));
  res.end();
});

// Message processing
app.post('/webhook', function (req, res) {
  console.log(req.body);
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function (entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function (event) {
        if (event.message) {
          receivedMessage(event);
        } else if (event.postback) {
          receivedPostback(event);
        } else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    res.sendStatus(200);
  }
});

function getMesseageFromListWord(listWords, messageText, message) {
  var flag = 0;
  listWords.forEach(word => {
    var myString = messageText;
    var myPattern = new RegExp('(\\w*' + word + '\\w*)', 'gi');
    var matches = myString.match(myPattern);
    if (matches === null) {

    }
    else {
      flag++;
    }
  })
  if (flag > 0) {
    return message;
  }

  return "noResults";
}

// Incoming events handling
function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message for user %d and page %d at %d with message:",
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var messageId = message.mid;

  var messageText = message.text;
  var messageAttachments = message.attachments;

  if (messageText) {
    // If we receive a text message, check to see if it matches a keyword
    // and send back the template example. Otherwise, just echo the text we received.
    var message;
    var randomAnswer;
    var messageResult = messageText;
    var mess = messageText.split("-")
    console.log(mess)
    if (mess[0] == "apply" && mess.length == 2) {
      messageResult = "apply";
    }
    var listLaugh = ["kk", "kkk", "kkkk", "haha", "hahaha", "hahahaha", "hahahahaha", "kkkkk", "kkkkkk"]
    var listWordGreeting = ["hi", "Hi", "Hello", "hello", "chào", "chao"]
    var listWordLove = ["yêu bạn", "thích bạn", "mãi yêu", "mai yeu", "thich ban", "yeu may", "yêu mày", "yeu ban", "yêu m", "yeu m"]
    var listWordsFun = ["vl", "vãi", "shit"]
    var listWordSwearing = ["lồn", "cặc", "đcm", "clm", "óc chó", "khốn nạn", "đm", "dm", "oc cho", "thằng chó", "địt mẹ", "dit me", "mẹ mày", "me may", "cmm", "dcm", "con cho", "con chó", "cac", "lon", "fuck", "cc", "cức", "Cức"];
    var listCrush = ["a iu e", "anh yêu em", "nhớ em quá", "em đang làm gì đó"]
    messageResult = getMesseageFromListWord(listWordSwearing, messageText, "swearing");
    if (messageResult == "noResults") {
      messageResult = getMesseageFromListWord(listWordsFun, messageText, "funword");
    }
    if (messageResult == "noResults") {
      messageResult = getMesseageFromListWord(listWordLove, messageText, "love");
    }
    if (messageResult == "noResults") {
      messageResult = getMesseageFromListWord(listWordGreeting, messageText, "greeting");
    }
    if (messageResult == "noResults") {
      messageResult = getMesseageFromListWord(listLaugh, messageText, "laugh");
    }
    if (messageResult == "noResults") {
      messageResult = getMesseageFromListWord(listCrush, messageText, "crush");
    }

    if (messageResult == "noResults") {
      messageResult = messageText;
    }


    switch (messageResult) {
      case 'generic':
        sendGenericMessage(senderID);
        break;
      case 'crush':
        message = ["e cũng iu a ", "em yêu anh ", "cũng nhớ anh nữa nè <3 ", "em đang chờ anh tới nè, anh ơi! "];
        randomAnswer = message[Math.floor(Math.random() * message.length)];
        sendTextMessage(senderID, randomAnswer);
        break;
      case 'love':
        message = ["Mình cũng yêu bạn <3 ", "Xin lỗi mình có người yêu là Việt Anh rồi :) ", "Mình có người yêu rồi, nhưng mình sẽ cho nó mọc sừng nếu bạn muốn -D :D =D "];
        randomAnswer = message[Math.floor(Math.random() * message.length)];
        sendTextMessage(senderID, randomAnswer);
        break;
      case 'funword':
        message = ["Nói gì kì quá nha :) ", "Nói năng vậy đó hả :) ", "Bậy bậy :) "];
        randomAnswer = message[Math.floor(Math.random() * message.length)];
        sendTextMessage(senderID, randomAnswer);
        break;
      case 'laugh':
        message = ["Cười cc ", "Có cái méo gì mà cười ??? ", "Đập cm h chứ ở đó mà cười :) "];
        randomAnswer = message[Math.floor(Math.random() * message.length)];
        sendTextMessage(senderID, randomAnswer);
        break;
      case 'swearing':
        message = ["Chửi cmm nhóc ác :)", "Thấy t hiền làm tới à, đập cmm giờ :) ", "Thích thì ở không thì cút chửi cc :)", "M thích cái gì ?", "Chửi cc, chửi hoài", "Sao bạn chửi mình :( ", "Đừng chửi mình chứ :( ", "Bạn là người khá nóng tính :( ", "Tại sao lại chửi mình :( "];
        randomAnswer = message[Math.floor(Math.random() * message.length)];
        sendTextMessage(senderID, randomAnswer);
        break;
      case 'apply':
        sendTextMessage(senderID, "Đăng ký thành công nè :) ");
        listUser.push(senderID);
        break;

      case 'Alo':
        sendTextMessage(senderID, "Alo con khỉ :)");
        listUser.push(senderID);
        break;
      case 'alo':
        sendTextMessage(senderID, "Alo con khỉ :)");
        listUser.push(senderID);
        break;
      case 'greeting':
        var format = "";
        var ndate = new Date();
        var hr = ndate.getHours();
        var h = hr % 12;

        if (hr < 12) {
          message = ["Này bạn, bạn nợ tớ thì phải trả đi chứ! Tính xù hả? Ng đâu mà … Bạn nợ tớ 1 NỤ CƯỜI ĐÓ! Chúc 1 ngày đầy niềm vui và những bất ngờ! SMILE <3", "Chúc bạn buổi sáng tốt lành, thật sự tốt lành đủ để bạn có thể mỉm cười được ấy! <3", "Chúc buổi sáng an lành, một ngày làm việc may mắn và thành công, chúc bạn luôn vui vẻ tràn ngập tiếng cười. <3", "Sương mai long lanh trên cành, hoa nở, chim hot đầy sức sống, hãy đứng dậy và bước đi vững chắc trong ngày mới với những hy vọng cho tương lai của bạn nhé. <3 ", "Những tia nắng của ngày hôm nay cho bạn thấy cơ hội mới để thực hiện giấc mơ đã ấp ủ bấy lâu. Hãy nắm bắt cơ hội, làm việc chăm chỉ và theo đuổi ước mơ của mình nhé. <3 ", "Bất cứ lúc nào cậu cảm thấy nhụt chí và không còn động lực để tiếp tục tiến về phía trước, hay gọi cho tớ. Tớ sẽ nhắc cho cậu nhớ cậu tuyệt vời ra sao. Good morning!  <3 "];
          randomAnswer = message[Math.floor(Math.random() * message.length)];
          sendTextMessage(senderID, randomAnswer);
        }
        else if (hr >= 12 && hr <= 17) {
          sendTextMessage(senderID, "Chào bạn ,Chúc bạn buổi chiều vui vẻ <3 ");
        }
        else if (hr >= 17 && hr <= 24) {
          sendTextMessage(senderID, "Chào bạn ,Chúc bạn buổi tối vui vẻ <3 ");
        }
        break;
      default:
        sendTextMessage(senderID, "Bạn nói gì vậy mình không hiểu gì hết :( ");
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}

function receivedPostback(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;

  // The 'payload' param is a developer-defined field which is set in a postback 
  // button for Structured Messages. 
  var payload = event.postback.payload;

  console.log("Received postback for user %d and page %d with payload '%s' " +
    "at %d", senderID, recipientID, payload, timeOfPostback);

  // When a postback is called, we'll send a message back to the sender to 
  // let them know it was successful
  sendTextMessage(senderID, "Postback called");
}

//////////////////////////
// Sending helpers
//////////////////////////
function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}

function sendGenericMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "rift",
            subtitle: "Next-generation virtual reality",
            item_url: "https://www.oculus.com/en-us/rift/",
            image_url: "http://messengerdemo.parseapp.com/img/rift.png",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/rift/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for first bubble",
            }],
          }, {
            title: "touch",
            subtitle: "Your Hands, Now in VR",
            item_url: "https://www.oculus.com/en-us/touch/",
            image_url: "http://messengerdemo.parseapp.com/img/touch.png",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/touch/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for second bubble",
            }]
          }]
        }
      }
    }
  };

  callSendAPI(messageData);
}

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s",
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });
}

// Set Express to listen out for HTTP requests
var server = app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port %s", server.address().port);
});

function xoa_dau(str) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  return str;
}