import { NgModule } from '@angular/core';

import { Observable } from 'rxjs';

import {
  EventBusRegistry,
  EVENTS_LISTENER
} from './event-bus-registry';
import {
  Event,
  EventBus,
  EVENTS_PROVIDER,
  EventsProvider,
  EventType
} from './event-bus.service';

@NgModule({
  imports: [],
  providers: [
    EventBus,
    EventBusRegistry,
    // stub default EVENTS_PROVIDER so DI doesn't choke if no other modules provide custom EVENTS_PROVIDERs
    {
      provide: EVENTS_PROVIDER,
      useValue: ({
        eventType: EventType.GENERIC,
        events: Observable.never()
      } as EventsProvider<void>),
      multi: true
    },
    {
      provide: EVENTS_LISTENER,
      useValue: null,
      multi: true
    }
  ]
})
export class EventBusModule { }
