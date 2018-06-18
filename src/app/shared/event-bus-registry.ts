import {
  Inject,
  Injectable,
  InjectionToken
} from '@angular/core';

// EVENTS_LISTENER *must* also be used with "multi" attribute set to true
export const EVENTS_LISTENER: InjectionToken<string> = new InjectionToken<string>('EventsListener');

@Injectable()
export class EventBusRegistry {
  constructor(
    @Inject(EVENTS_LISTENER) listeners: any[]
  ) {}
}
