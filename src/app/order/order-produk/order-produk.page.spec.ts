import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrderProdukPage } from './order-produk.page';

describe('OrderProdukPage', () => {
  let component: OrderProdukPage;
  let fixture: ComponentFixture<OrderProdukPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderProdukPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderProdukPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
