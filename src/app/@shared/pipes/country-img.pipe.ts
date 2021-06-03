import { Pipe, PipeTransform } from "@angular/core";
import { CommonService } from "@service/common.service";

@Pipe({
  name: "countryImg",
})
export class CountryImgPipe implements PipeTransform {
  constructor(private commonService: CommonService) {}
  async transform(value: any, ...args: any[]): Promise<any> {
    var a: string;
    console.log(value);
    let flagObj: any = await this.commonService.getRestCountriesByName(value.sercountry).toPromise();
    let flag = ((await flagObj) && flagObj[0].flag) || null;
    console.log(flag);
    return flag;
  }
}
