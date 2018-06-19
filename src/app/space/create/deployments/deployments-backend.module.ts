import { NgModule } from '@angular/core';

import { EVENTS_LISTENER } from '../../../shared/event-bus-registry';
import { EVENTS_PROVIDER } from '../../../shared/event-bus.service';

import { DeploymentsBackendService } from './services/deployments-backend.service';
import { DeploymentsNotificationsService } from './services/deployments-notifications.service';

@NgModule({
  providers: [
    {
      provide: EVENTS_PROVIDER,
      useClass: DeploymentsBackendService,
      multi: true
    },
    {
      provide: EVENTS_LISTENER,
      useClass: DeploymentsNotificationsService,
      multi: true
    }
  ]
})
export class DeploymentsBackendModule { }
