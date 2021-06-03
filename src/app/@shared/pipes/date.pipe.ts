import { Pipe, PipeTransform } from "@angular/core";
import * as moment from "moment";

@Pipe({
  name: "mydate",
})
export class DatePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    console.log(args);
    if (args.length > 0) {
      return moment(value).format(args[0]);
    }
    return this.setDate(value);
  }

  setDate(date) {
    let d = new Date();
    d.setDate(d.getDate() - 1);
    let yesterdayDate = moment(d).format("DD-MM-YYYY");
    let currentDate = moment(new Date()).format("DD-MM-YYYY");
    let commingDate = moment(date).format("DD-MM-YYYY");
    if (currentDate == commingDate) {
      return this.setTime(date);
    } else if (yesterdayDate == commingDate) {
      return "Yesterday";
    }
    return moment(date).format("DD-MMM") || null;
  }

  setTime(value) {
    let date: any = new Date(value);
    try {
      var hours = date.getHours();
      var minutes: any = date.getMinutes();
      var ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? "0" + minutes : minutes;
      var strTime = hours + ":" + minutes + " " + ampm;
      return strTime;
    } catch (error) {
      return "n/a";
    }
  }
}
