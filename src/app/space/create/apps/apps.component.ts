import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import {
  AppsService,
  Environment,
} from './services/apps.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-apps',
  templateUrl: 'apps.component.html'
})
export class AppsComponent implements OnInit {
  spaceId: string;
  environments: Environment[];
  applications: string[];

  constructor(
    private router: Router,
    private appsService: AppsService
  ) {
    this.spaceId = 'placeholder-space';
  }

  ngOnInit() {
    this.updateResources();
  }

  private updateResources(): void {
    this.appsService.getEnvironments(this.spaceId).subscribe(val => this.environments = val);
    this.appsService.getApplications(this.spaceId).subscribe(val => this.applications = val);
  }

}
