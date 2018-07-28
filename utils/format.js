const utils = require('./util');

var curDate= utils.formatTime(new Date());
var curDateFull = new Date();



const timeFormat = (str, contentType) => {

  for (var i = 0; i < str.length; i++) {
    if (contentType == 'class') {
      var start = str[i].class_timestart;
      var end = str[i].class_timend;
      var date = new Date(str[i].class_date.slice(0, 10));
      var itemDate = str[i].class_date;      
    } else if (contentType == 'course') {
      var start = str[i].course_timestart;
      var end = str[i].course_timend;
      var date = new Date(str[i].course_date.slice(0, 10));
      var itemDate = str[i].course_date;      
    }

    var curTime = curDateFull.toLocaleString('chinese', { hour12: false }).slice(10, 18).replace(/:/g, "");
    var itemTime = start.replace(/:/g, "");

    if((itemDate < curDate) || ((itemDate == curDate) && (curTime > itemTime)) ){
      str[i].overtime = 1;
    } else {
      str[i].overtime = 0;
    }

    date = date.getFullYear() + "年" +
      (parseInt(date.getMonth()) + 1).toString() + "月" +
      date.getDate() + "日";
    start = start.slice(0, 5)

    if (start.slice(0, 1) == "0") {
      start = start.slice(1, 5)
    }
    end = end.slice(0, 5)

    if (end.slice(0, 1) == "0") {
      end = end.slice(1, 5)
    }

    if (contentType == 'class') {
      str[i].class_date = date;
      str[i].class_timestart = start;
      str[i].class_timend = end
    } else if (contentType == 'course') {
      str[i].course_date = date;
      str[i].course_timestart = start;
      str[i].course_timend = end
    }

  }

  console.log("时间处理后：", str);
  return str;
}

const dateFormat = (options, that, contentType) => {
  var classItem, courseItem;
  that.setData({ 
    dateIndex: curDate,
    dateLimitStart: curDate,
  });
  curDateFull.setFullYear(curDateFull.getFullYear() + 1);
  curDateFull.setDate(curDateFull.getDate() - 1);
  that.setData({ dateLimitEnd: curDateFull });
  if (options.class_content != null) {

    if (contentType == "class") {
      classItem = JSON.parse(options.class_content);
      if (classItem.student_limit == '0') {
        that.setData({
          studentLimit: ''
        })
      } else {
        that.setData({
          studentLimit: classItem.student_limit
        })
      }
      if (classItem.class_date.slice(6, 7) == "月") {
        classItem.class_date = classItem.class_date.replace("年", "-0");
      } else {
        classItem.class_date = classItem.class_date.replace("年", "-");
      }

      classItem.class_date = classItem.class_date.replace("月", "-");
      classItem.class_date = classItem.class_date.replace("日", "");

      console.log(classItem.class_timestart.slice(1, 2));

      if (classItem.class_timestart.slice(1, 2) == ":") {
        classItem.class_timestart = "0" + classItem.class_timestart;
      }

      if (classItem.class_timend.slice(1, 2) == ":") {
        classItem.class_timend = "0" + classItem.class_timestart;
      }
      that.setData({
        className: classItem.class_name,
        classIntro: classItem.class_intro,
        dateIndex: classItem.class_date,
        classPlace: classItem.class_place,
        timeEndIndex: classItem.class_timend,
        timeStartIndex: classItem.class_timestart,
      })
    } else if(contentType == "require") {
      courseItem = JSON.parse(options.class_content);

      if (courseItem.course_date.slice(6, 7) == "月"){
        courseItem.course_date = courseItem.course_date.replace("年", "-0");
      } else {
        courseItem.course_date = courseItem.course_date.replace("年", "-");       
      }

      courseItem.course_date = courseItem.course_date.replace("月", "-");
      courseItem.course_date = courseItem.course_date.replace("日", "");

      console.log(courseItem.course_timestart.slice(1,2));

      if (courseItem.course_timestart.slice(1, 2) == ":"){
        courseItem.course_timestart = "0"+courseItem.course_timestart;
      }

      if (courseItem.course_timend.slice(1, 2) == ":") {
        courseItem.course_timend = "0" + courseItem.course_timestart;
      }

      that.setData({
        courseName: courseItem.course_name,
        courseIntro: courseItem.course_intro,
        dateIndex: courseItem.course_date,
        coursePlace: courseItem.course_place,
        timeEndIndex: courseItem.course_timend,
        timeStartIndex: courseItem.course_timestart,
      })
    }
  }
  if (contentType == "class") {
    return classItem;
  } else if(contentType == "require") {
    return courseItem
  }
}

module.exports = {
  timeFormat: timeFormat,
  dateFormat: dateFormat
}