import {
  Component,
  ViewEncapsulation
} from '@angular/core';

import {
  Space,
  Spaces
} from 'ngx-fabric8-wit';
import { Observable } from 'rxjs';

import { DeploymentStatusService } from './services/deployment-status.service';
import {
  DeploymentsService,
  POLL_RATE_TOKEN,
  TIMER_TOKEN,
  TIMESERIES_SAMPLES_TOKEN
} from './services/deployments.service';
import { DeploymentsWsService } from './services/deployments.ws.service';

export function timerFactory(): Observable<void> {
  return Observable
    .timer(DeploymentsService.DEFAULT_INITIAL_UPDATE_DELAY, DeploymentsService.DEFAULT_POLL_RATE_MS)
    .map((unused: number): void => null)
    .share();
}

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-apps',
  templateUrl: 'deployments.component.html',
  styleUrls: ['./deployments.component.less'],
  providers: [
    DeploymentStatusService,
    DeploymentsService,
    { provide: TIMER_TOKEN, useFactory: timerFactory },
    DeploymentsWsService,
    { provide: TIMESERIES_SAMPLES_TOKEN, useValue: DeploymentsService.DEFAULT_FRONT_LOAD_SAMPLES },
    { provide: POLL_RATE_TOKEN, useValue: DeploymentsService.DEFAULT_POLL_RATE_MS }
  ]
})
export class DeploymentsComponent {

  readonly spaceId: Observable<string>;
  readonly spaceName: Observable<string>;
  readonly environments: Observable<string[]>;
  readonly applications: Observable<string[]>;

  constructor(
    private readonly spaces: Spaces,
    private readonly deploymentsService: DeploymentsService,
    private readonly deploymentsWsService: DeploymentsWsService
  ) {
    this.spaceId = this.spaces.current.first().map((space: Space): string => space.id);
    this.spaceName = this.spaces.current.first().map((space: Space): string => space.attributes.name);
    this.environments = this.spaceId.flatMap((spaceId: string): Observable<string[]> => this.deploymentsService.getEnvironments(spaceId));
    this.applications = this.spaceId.flatMap((spaceId: string): Observable<string[]> => this.deploymentsService.getApplications(spaceId));
  }

  ngOnInit(): void {
    this.deploymentsWsService.getText();
  }
}
