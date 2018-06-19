import { Injectable } from '@angular/core';

import {
  Notifications,
  NotificationType
} from 'ngx-base';

import {
  EVENTS_LISTENER,
  EventsListener
} from '../../../../shared/event-bus-registry';
import { Event } from '../../../../shared/event-bus.service';

import { DeploymentsBackendService } from './deployments-backend.service';

@Injectable()
export class DeploymentsNotificationsService extends EventsListener<Event<number>> {

  readonly eventTypes: string[] = [ DeploymentsBackendService.EVENT_TYPE ];

  constructor(
    private readonly notifications: Notifications
  ) {
    super();
  }

  next(event: Event<number>): void {
    this.notifications.message({
      type: NotificationType.INFO,
      header: event.type,
      message: String(event.message)
    });
  }

}
