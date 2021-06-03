import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InvestmentProfilePage } from './investment-profile.page';

describe('InvestmentProfilePage', () => {
  let component: InvestmentProfilePage;
  let fixture: ComponentFixture<InvestmentProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestmentProfilePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InvestmentProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
