import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UpgradeComponent } from "@modules/profile/upgrade/upgrade.component";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";

@NgModule({
  declarations: [UpgradeComponent],
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  exports: [UpgradeComponent],
  providers: [InAppBrowser],
})
export class UpgradeModule {}
