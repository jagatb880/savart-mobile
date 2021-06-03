import { Directive, Attribute, Optional, HostListener, ElementRef, Renderer2 } from "@angular/core";

@Directive({
  selector: "[appMask]",
})
export class MaskDirective {
  pattern: string;

  constructor(
    @Optional() private elemRef: ElementRef,
    private render: Renderer2,
    @Attribute("appMask") pattern: string
  ) {
    this.pattern = pattern;
  }

  @HostListener("input", ["$event"])
  onInputChange(e) {
    if (!isNaN(e.data)) {
      console.log({ e });

      try {
        let value = e.target.value,
          caret = e.target.selectionStart,
          pattern = this.pattern,
          reserve = pattern.replace(/\*/, "g"),
          applied = "",
          ordinal = 0;

        console.log(value);

        console.log(e.key);
        if (e.keyCode === 8 || e.key === "Backspace" || e.keyCode === 46 || e.key === "Delete") {
          if (value.length) {
            //remove all trailing formatting
            while (value.length && pattern[value.length] && pattern[value.length] !== "*") {
              value = value.substring(0, value.length - 1);
            }
            //remove all leading formatting to restore placeholder
            if (pattern.substring(0, value.length).indexOf("*") < 0) {
              value = value.substring(0, value.length - 1);
            }
          }
        }

        //apply mask characters
        for (var i = 0; i < value.length; i++) {
          //enforce pattern limit
          if (i < pattern.length) {
            //match mask
            if (value[i] === pattern[ordinal]) {
              applied += value[i];
              ordinal++;
            } else if (reserve.indexOf(value[i]) > -1) {
              //skip other reserved characters
            } else {
              //apply leading formatting
              while (ordinal < pattern.length && pattern[ordinal] !== "*") {
                applied += pattern[ordinal];
                ordinal++;
              }
              applied += value[i];
              ordinal++;
              //apply trailing formatting
              while (ordinal < pattern.length && pattern[ordinal] !== "*") {
                applied += pattern[ordinal];
                ordinal++;
              }
            }
          }
        }
        e.target.value = applied;
        console.log({ applied });
        this.render.setValue(this.elemRef.nativeElement, applied);
      } catch (ex) {
        console.error(ex.message);
      }
    } else {
      let value = e.target.value;
      console.log(value.slice(0, value.length - 1));
      let newvalue = value.slice(0, value.length - 1) || null;
      e.target.value = newvalue;
      this.render.setValue(this.elemRef.nativeElement, newvalue);
    }
  }
}
