import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CetakStrukPage } from './cetak-struk.page';

describe('CetakStrukPage', () => {
  let component: CetakStrukPage;
  let fixture: ComponentFixture<CetakStrukPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CetakStrukPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CetakStrukPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
