import { Injectable } from '@angular/core';

import {
  Notifications,
  NotificationType
} from 'ngx-base';

import { EVENTS_LISTENER } from '../../../../shared/event-bus-registry';
import {
  Event,
  EventBus
} from '../../../../shared/event-bus.service';

import { DeploymentsBackendService } from './deployments-backend.service';

@Injectable()
export class DeploymentsNotificationsService {
  constructor(
    private readonly eventBus: EventBus,
    private readonly notifications: Notifications
  ) {
    eventBus
      .for(DeploymentsBackendService.EVENT_TYPE)
      .subscribe((event: Event<number>): void => {
        notifications.message({
          type: NotificationType.INFO,
          header: event.type,
          message: String(event.message)
        });
      });
  }
}
