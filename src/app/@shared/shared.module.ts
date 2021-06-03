import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DynamicInputComponent } from "@shared/components/dynamic-input/dynamic-input.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NkTextComponent } from "@shared/components/nk-text/nk-text.component";
import { NkRadioComponent } from "@shared/components/nk-radio/nk-radio.component";
import { NkSingleSelectComponent } from "@shared/components/nk-single-select/nk-single-select.component";
import { LogoutComponent } from "@shared/components/logout/logout.component";
import { NkCardComponent } from "@shared/components/nk-card/nk-card.component";
import { NkSubsCardComponent } from "@shared/components/nk-subs-card/nk-subs-card.component";
import { NkSelectButtonComponent } from "@shared/components/nk-select-button/nk-select-button.component";
import { CountryImgPipe } from "./pipes/country-img.pipe";
import { ImagesafePipe } from "./pipes/imagesafe.pipe";
import { NkToggleComponent } from "@shared/components/nk-toggle/nk-toggle.component";
import { DatePipe } from "./pipes/date.pipe";
import { NumcommaDirective } from "./directives/numcomma.directive";
import { MaskDirective } from "./directives/mask.directive";

@NgModule({
  declarations: [
    DynamicInputComponent,
    NkTextComponent,
    NkRadioComponent,
    NkSingleSelectComponent,
    NkCardComponent,
    LogoutComponent,
    NkSubsCardComponent,
    NkSelectButtonComponent,
    NkToggleComponent,
    CountryImgPipe,
    ImagesafePipe,
    DatePipe,
    NumcommaDirective,
    MaskDirective,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [
    DynamicInputComponent,
    NkTextComponent,
    NkRadioComponent,
    NkSingleSelectComponent,
    NkCardComponent,
    LogoutComponent,
    NkSubsCardComponent,
    NkSelectButtonComponent,
    NkToggleComponent,
    CountryImgPipe,
    ImagesafePipe,
    DatePipe,
    NumcommaDirective,
    MaskDirective,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
