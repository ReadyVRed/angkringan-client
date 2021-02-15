import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MitraPage } from './mitra.page';

describe('MitraPage', () => {
  let component: MitraPage;
  let fixture: ComponentFixture<MitraPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MitraPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MitraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
