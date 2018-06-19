import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { EventsProvider } from '../../../../shared/event-bus.service';

@Injectable()
export class DeploymentsBackendService implements EventsProvider<number> {
  static readonly EVENT_TYPE: string = 'DeploymentsBackend';
  readonly eventType: string = DeploymentsBackendService.EVENT_TYPE;
  readonly events: Observable<number> = Observable.timer(0, 10000);
}
