import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewAdvicePage } from './view-advice.page';

describe('ViewAdvicePage', () => {
  let component: ViewAdvicePage;
  let fixture: ComponentFixture<ViewAdvicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAdvicePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewAdvicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
