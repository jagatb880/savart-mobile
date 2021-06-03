import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ScreenerPage } from './screener.page';

describe('ScreenerPage', () => {
  let component: ScreenerPage;
  let fixture: ComponentFixture<ScreenerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScreenerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ScreenerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
