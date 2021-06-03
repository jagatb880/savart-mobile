import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WatchlistdetailPage } from './watchlistdetail.page';

describe('WatchlistdetailPage', () => {
  let component: WatchlistdetailPage;
  let fixture: ComponentFixture<WatchlistdetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WatchlistdetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WatchlistdetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
