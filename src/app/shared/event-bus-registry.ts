import {
  Inject,
  Injectable,
  InjectionToken
} from '@angular/core';

import {
  Observable,
  Observer
} from 'rxjs';

import {
  Event,
  EventBus
} from './event-bus.service';

// EVENTS_LISTENER *must* also be used with "multi" attribute set to true
export const EVENTS_LISTENER: InjectionToken<string> = new InjectionToken<string>('EventsListener');

export abstract class EventsListener<Event> implements Observer<Event> {
  eventTypes: string[];
  abstract next(event: Event);
  error(err: any): void { }
  complete(): void { }
}

@Injectable()
export class EventBusRegistry {
  constructor(
    private readonly eventBus: EventBus,
    // Force DI to initialize all listeners in hierarchy
    @Inject(EVENTS_LISTENER) private readonly listeners: EventsListener<Event<any>>[]
  ) {
    listeners.forEach((listener: EventsListener<Event<any>>): void => {
      if (listener.eventTypes == null) {
        console.error('Received EventsListener without EventTypes!');
        return;
      }
      if (!listener.next) {
        console.error('Received EventsListener without "next" function!');
        return;
      }
      let obs: Observable<any>;
      if (listener.eventTypes.length > 0) {
        obs = eventBus.for(listener.eventTypes[0], ...listener.eventTypes.slice(1));
      } else {
        obs = eventBus.for(listener.eventTypes[0]);
      }
      obs.subscribe(listener);
    });
  }
}
