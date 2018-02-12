import {
  Injectable,
  OnDestroy
} from '@angular/core';

import {
  Observable,
  Observer,
  Subject,
  Subscription
} from 'rxjs';

import { AuthenticationService } from 'ngx-login-client';

@Injectable()
export class DeploymentsWsService implements OnDestroy {

  apiUrl: string;

  private serviceSubscriptions: Subscription[] = [];

  constructor(
    private readonly auth: AuthenticationService
  ) {
    this.apiUrl = 'ws://localhost:8080/api/deployments/environments/jkang-stage/events/watch';
    let token: string = this.auth.getToken();
    if (token != null && token != '') {
      this.apiUrl = this.apiUrl + '?access_token=' + this.auth.getToken();
    }
   }

  ngOnDestroy() {
    this.serviceSubscriptions.forEach(sub => {
      console.log('unsubscribe');
      sub.unsubscribe();
    });
  }

  getText() {
    let socket: Subject<MessageEvent> = this.createSocket();

    this.serviceSubscriptions.push(
      socket.subscribe(
        (msg) => console.log('message received: ' + JSON.stringify(msg)),
        (err) => console.log(err),
        () => console.log('socket complete')
      )
    );
  }

  createSocket(): Subject<MessageEvent> {
    return Observable.webSocket(this.apiUrl);
  }

}
