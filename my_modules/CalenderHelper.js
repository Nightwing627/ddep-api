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
}
module.exports = CalenderHelper