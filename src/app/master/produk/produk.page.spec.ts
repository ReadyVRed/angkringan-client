import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProdukPage } from './produk.page';

describe('ProdukPage', () => {
  let component: ProdukPage;
  let fixture: ComponentFixture<ProdukPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdukPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProdukPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
