# weapp-ustb

<div align=center><img src="https://github.com/lmy98129/weapp-ustb/raw/master/WEAPP1.PNG"/></div>
<br/>

A wechat mini-program for Student Lecturer Group of SCCE, USTB

Mini-program QR-code: 
<div align=center><img src="https://github.com/lmy98129/weapp-ustb/raw/master/QRCODE.jpg"/></div>
<br/>

**Attention: Just for the front-end only.**

The back-end code as well as the database structure will not be released currently because of some reasons.

A file named "config.js" at this path is needed. The content can be this: 
```js
var host = 'yourhost.com';

var config = {
   service: {
       host,
        loginUrl: `https://${host}/login`,
        requestUrl: `https://${host}/user`,
        tunnelUrl: `https://${host}/tunnel`,
        testUrl: `https://${host}/test`,
    }
};

module.exports = config; 
```

For more details, please read my [blog](https://lmy98129.github.io/2018/06/28/Notes-About-Recent-Projects-3/) (in Chinese).

Thanks to every people who helped me during the development! <br/>
Special Thanks to [@Fafnir](https://github.com/yuncheng1998) and [@Gao Yifei](https://github.com/jasongao97). 
