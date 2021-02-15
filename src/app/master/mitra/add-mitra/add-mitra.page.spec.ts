import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddMitraPage } from './add-mitra.page';

describe('AddMitraPage', () => {
  let component: AddMitraPage;
  let fixture: ComponentFixture<AddMitraPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMitraPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddMitraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
