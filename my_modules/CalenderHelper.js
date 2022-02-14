/**Sytem package*/

/**User package*/
const config = require('../config/default');



class CalenderHelper {
    constructor() {
    }
    /*AES Encrypt*/
    
    
    nthWeekdayOfMonth(weekday, n, date) {
        var count = 0,
            idate = new Date(date.getFullYear(), date.getMonth(), 1);
        while (true) {
          if (idate.getDay() === weekday) {
            if (++count == n) {
                
              break;
            }
          }
          idate.setDate(idate.getDate() + 1);
        }
        idate.setDate(idate.getDate() + 1);
        return idate;
      }
      addWeeks (weeks, date = new Date()) { 
        //console.log(date); 
        var idate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        idate.setDate(date.getDate() + (weeks * 7)+1);
      
        return idate
      }
      addDays(days,date = new Date()){
        var idate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        idate.setDate(date.getDate()+days+1);
      
        return idate
      }
      toDate(dStr,format) {
        var now = new Date();
        if (format == "h:m") {
           now.setHours(dStr.substr(0,dStr.indexOf(":")));
           now.setMinutes(dStr.substr(dStr.indexOf(":")+1));
           now.setSeconds(0);
           return now;
        }else 
          return "Invalid Format";
      }
}
module.exports = CalenderHelper