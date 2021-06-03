import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewPortfolioPage } from './view-portfolio.page';

describe('ViewPortfolioPage', () => {
  let component: ViewPortfolioPage;
  let fixture: ComponentFixture<ViewPortfolioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPortfolioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewPortfolioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
