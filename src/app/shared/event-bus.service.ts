import {
  Inject,
  Injectable,
  InjectionToken
} from '@angular/core';

import {
  Observable,
  Subject
} from 'rxjs';

import { includes } from 'lodash';

// Per-module EventsProvider implementations *MUST* set the "multi" attribute to true
export const EVENTS_PROVIDER: InjectionToken<string> = new InjectionToken<string>('EventsProvider');

export interface EventsProvider<T> {
  eventType: string;
  events: Observable<T>;
}

// Common event types for all publishers and subscribers.
// Publishers and subscribers are also free to use plain strings
// as event types to tag their own events so that this enum does
// not need to be updated to reflect every single use case.
export enum EventType {
  GENERIC = 'Generic'
}

export interface Event<T> {
  type: string;
  message: T;
}

@Injectable()
export class EventBus {

  private readonly stream: Subject<Event<any>> = new Subject<Event<any>>();

  constructor(@Inject(EVENTS_PROVIDER) eventsProviders: EventsProvider<any>[]) {
    eventsProviders.forEach((eventsProvider: EventsProvider<any>): void => this.register(eventsProvider));
  }

  private register(eventsProvider: EventsProvider<any>): void {
    if (eventsProvider.eventType == null) {
      console.error('Received EventsProvider without EventType!');
      return;
    }
    if (!eventsProvider.events) {
      console.error('Received EventsProvider without events!');
      return;
    }
    eventsProvider.events
      .map((e: any): Event<any> => ({ type: eventsProvider.eventType, message: e }))
      .subscribe((event: any): void => this.stream.next(event));
  }

  all(): Observable<Event<any>> {
    return this.stream.asObservable();
  }

  for(eventType: string, ...eventTypes: string[]): Observable<Event<any>> {
    return this.all()
      .filter((event: Event<any>): boolean => includes([eventType, ...eventTypes], event.type));
  }

}
