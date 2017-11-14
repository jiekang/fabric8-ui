import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { Spaces } from 'ngx-fabric8-wit';

import {
  APPS_SERVICE,
  IAppsService
} from './services/apps.service';
import { Environment } from './models/environment';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-apps',
  templateUrl: 'apps.component.html'
})
export class AppsComponent implements OnDestroy, OnInit {

  spaceId: Observable<string>;
  environments: Observable<Environment[]>;
  applications: Observable<string[]>;

  constructor(
    private spaces: Spaces,
    @Inject(APPS_SERVICE) private appsService: IAppsService
  ) {
    this.spaceId = this.spaces.current.first().map(space => space.id);
   }

  ngOnDestroy(): void { }

  ngOnInit(): void {
    this.updateResources();
  }

  private updateResources(): void {
    this.spaceId.subscribe(spaceId => {
      this.environments =
        this.appsService.getEnvironments(spaceId);

      this.applications =
        this.appsService.getApplications(spaceId);
    });
  }

}
