import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserSistemPage } from './user-sistem.page';

describe('UserSistemPage', () => {
  let component: UserSistemPage;
  let fixture: ComponentFixture<UserSistemPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSistemPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserSistemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
