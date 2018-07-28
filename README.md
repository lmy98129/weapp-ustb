# weapp-ustb
A wechat mini-program for Student Lecturer Group of SCCE, USTB

<div align=center>![intro](https://github.com/lmy98129/weapp-ustb/raw/master/WEAPP1.PNG)

**Attention: Just for the front-end only.**

The back-end code as well as the database structure will not be released currently because of some reasons.

A file named "config.js" at this path is needed, the content can be this: 
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

Thanks for every people who helped me during the development!
