import { Component } from '@angular/core';
import { AppService } from '../services/app.service';
import { USER } from '../services/datatype';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  CurrentUser = <USER>{};
  constructor(private appService: AppService) {

  }
  async ngOnInit() {
    this.CurrentUser = await this.appService.getCurrentUser();
  }
  async Logout() {
    let confirm = await this.appService.presentAlertConfirm('Yakin akan logout ?');
    if (confirm) {
      await this.appService.Logout();
    }
  }
}
