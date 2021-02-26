import { Component } from '@angular/core';
import { AppService } from '../services/app.service';
import { USER } from '../services/datatype';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  CurrentUser = <USER>{};
  constructor(private appService: AppService) { }
  async ngOnInit() {
    this.CurrentUser = await this.appService.getCurrentUser();
  }
  async ionViewWillEnter() {
    this.CurrentUser = await this.appService.getCurrentUser();
  }
}
