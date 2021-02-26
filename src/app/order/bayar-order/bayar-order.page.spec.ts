import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BayarOrderPage } from './bayar-order.page';

describe('BayarOrderPage', () => {
  let component: BayarOrderPage;
  let fixture: ComponentFixture<BayarOrderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BayarOrderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BayarOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
