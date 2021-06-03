import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({
  name: "imagesafe",
})
export class ImagesafePipe implements PipeTransform {
  constructor(private domSanitizer: DomSanitizer) {}
  transform(value: any, ...args: any[]): any {
    if (args.length > 0 && args[0] === "HTML") {
      return this.domSanitizer.bypassSecurityTrustHtml(value);
    }
    return this.domSanitizer.bypassSecurityTrustUrl(value);
  }
}
