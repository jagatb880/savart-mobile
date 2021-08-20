import { Component, OnInit, Input, forwardRef, ElementRef, Renderer2 } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup } from "@angular/forms";
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ActionSheetController } from '@ionic/angular';


@Component({
  selector: "app-dynamic-input",
  templateUrl: "./dynamic-input.component.html",
  styleUrls: ["./dynamic-input.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DynamicInputComponent),
      multi: true,
    },
  ],
})
export class DynamicInputComponent implements OnInit, ControlValueAccessor {
  @Input() label: string = "How much amount you too invest ?";
  @Input() inputType: string = null;
  @Input() values: any[] = [];
  @Input() order: number;
  @Input() name: string;
  @Input() id: string;
  @Input() fieldset: string;
  @Input() formGroup: FormGroup;
  @Input() isOrder = false;
  @Input() isFirstDisabled = false;
  @Input() disabled = false;

  value;
  imageCode: string;
  imgPreview: string;
  imageData: any;
  imageName: string;
  options: any;
  onChange: any = () => {};
  onTouched: any = () => {};
  img: string;
  adharfontimage: string;
  adharabackimage: string;
  panfontimage: string;
  adhrafont: any;
  adharaback: any;
  panfont: any;

  constructor(private elemRef: ElementRef, private render: Renderer2, private camera: Camera,public actionSheetCtrl: ActionSheetController) {
    this.options = {
      maximumImagesCount: 4,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      quality: 70,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      toBack: true,
      height: 10
    };
    
  }
  getRandomNumberWithLength(length: number) {
    const chars = '0123456789ABCDEFGHIJ';
    length = length || 20;
    // tslint:disable-next-line:one-variable-per-declaration
    let str = '', rnd: number;
    while (length > 0) {
      rnd = Math.floor(Math.random() * chars.length);
      str += chars.charAt(rnd);
      length--;
    }
    return str;
  }
  chooseimage(formGroup,type){
    console.log(formGroup);
    this.camera.getPicture(this.options).then((imageData) => {
      if(formGroup.controls.custresponse.value == null){
        formGroup.controls.custresponse.value = {}
      }
      formGroup.controls.custresponse.value[type]= {
        imgSrc: 'data:image/jpeg;base64,' + imageData,
        imgName: this.getRandomNumberWithLength(10) + '.jpg'
      }
      this.onChanged(formGroup.controls.custresponse.value)
      return formGroup;
    }, (err) => {
      console.log('err3' + JSON.stringify(err));
    });
  }

  clickImg(formGroup,type){
    console.log(formGroup);
    console.log(type);
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    };
    this.camera.getPicture(options).then((imageData) => {
    if(formGroup.controls.custresponse.value == null){
      formGroup.controls.custresponse.value = {}
    }
    formGroup.controls.custresponse.value[type] = {
      imgSrc: 'data:image/jpeg;base64,' + imageData,
      imgName: this.getRandomNumberWithLength(10) + '.jpg'
    }
    this.onChanged(formGroup.controls.custresponse.value)
    return formGroup;
    }, (err) => {
      alert(err);
    });
  }
  
  async getPhoto(value,type) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Choose or take a picture',
      buttons: [
        {
          text: 'Choose picture',
          role: 'destructive',
          handler: () => {
            this.chooseimage(value,type);
          }
        }, {
          text: 'Take picture',
          handler: () => {
            this.clickImg(value,type);
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            actionSheet.dismiss();
          }
        }
      ]
    });
    await actionSheet.present();
  }
  onChanged(value) {
    console.log({ value });
    this.writeValue(value);
  }

  allowNumberOnly(evt) {
    var Num = evt.target.value;
    console.log('Nummdata',evt.data)
    const regExp = new RegExp(/^[0-9,]*$/);
    if (regExp.test(evt.data)) {
      Num += "";
      Num = Num.replace(",", "");
      Num = Num.replace(",", ""); 
      Num = Num.replace(",", "");
      Num = Num.replace(",", "");
      Num = Num.replace(",", "");
      Num = Num.replace(",", "");
      var x = Num.split(".");
      var x1 = x[0];
      var x2 = x.length > 1 ? "." + x[1] : "";
      var rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) x1 = x1.replace(rgx, "$1" + "," + "$2");
      var result : string =  x1 + x2;
      if(result.charAt(0) == '.'){
        result = result.slice(1);
      }
      this.render.setValue(this.elemRef.nativeElement, result);
      this.onChange(result || null);
    } else {
      console.log('Num1',Num);
      Num = Num.replace('INR.','') ;
      console.log('Num2',Num);
      console.log(Num.replace(new RegExp(/[^0-9,.]/), ""));
      this.render.setValue(this.elemRef.nativeElement, Num.replace(new RegExp(/[^0-9,.]/), ""));
      this.onChange(Num.replace(new RegExp(/[^0-9,.]/), ""));
    }
  }

  keypressnumber(event) {
    console.log(event);
    // event.preventDefault();
  }
  ngOnInit() {
    console.log(this.formGroup);
    if(this.inputType == 'P'){
      this.formGroup.controls.custresponse.clearValidators();
      this.formGroup.controls.custresponse.updateValueAndValidity();
    }
    if(this.inputType == 'U'){
      this.formGroup.controls.custresponse.clearValidators();
      this.formGroup.controls.custresponse.updateValueAndValidity();
      if(this.values.length == 0){
        this.values.push("Front")
      }
      let a= this.formGroup.controls.custresponse.value
      a = {}
      a[this.values[0]] = {}
      a[this.values[1]] = {}
    }
  }

  writeValue(value: any): void {
    this.value = value;
    this.onChange(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
