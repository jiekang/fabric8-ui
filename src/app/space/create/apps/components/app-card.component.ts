import {
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';

import { Observable } from 'rxjs';

import {
  APPS_SERVICE,
  IAppsService
} from '../services/apps.service';
import { Environment } from '../models/environment';

@Component({
  selector: 'app-card',
  templateUrl: 'app-card.component.html'
})
export class AppCardComponent implements OnDestroy, OnInit {

  @Input() applicationId: string;
  @Input() environment: Environment;

  collapsed: boolean = true;
  podCount: Observable<number>;
  version: Observable<string>;

  constructor(
    @Inject(APPS_SERVICE) private appsService: IAppsService
  ) { }

  ngOnDestroy(): void { }

  ngOnInit(): void {
    this.podCount =
      this.appsService.getPodCount(this.applicationId, this.environment.environmentId);

    this.version =
      this.appsService.getVersion(this.applicationId, this.environment.environmentId);
  }

}
