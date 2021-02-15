import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddProdukPage } from './add-produk.page';

describe('AddProdukPage', () => {
  let component: AddProdukPage;
  let fixture: ComponentFixture<AddProdukPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProdukPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddProdukPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
