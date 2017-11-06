import { Injectable, Inject } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { AuthenticationService, UserService } from 'ngx-login-client';
import { Logger } from 'ngx-base';
import { Observable } from 'rxjs';

import { WIT_API_URL } from 'ngx-fabric8-wit';

export declare class Environment {
  environmentId: string;
  name: string;
}

@Injectable()
export class AppsService {

private static readonly POLL_RATE_MS: number = 5000;

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private spacesUrl: string;
  private nextLink: string = null;

  constructor(
    private http: Http,
    private logger: Logger,
    private auth: AuthenticationService,
    private userService: UserService,
    @Inject(WIT_API_URL) apiUrl: string) {
    if (this.auth.getToken() != null) {
      this.headers.set('Authorization', 'Bearer ' + this.auth.getToken());
    }
    this.spacesUrl = apiUrl + 'spaces';
  }

  getApplications(spaceId: string): Observable<string[]> {
    return Observable.of(['vertx-hello', 'vertx-paint', 'vertx-wiki']);
  }

  getEnvironments(spaceId: string): Observable<Environment[]> {
    return Observable.of([
      { environmentId: 'envId-stage', name: 'stage' } as Environment,
      { environmentId: 'envId-run', name: 'run' } as Environment
    ]);
  }

  getTotalCpuCount(spaceId: string, environmentId: string): Observable<number> {
    return Observable
      .interval(AppsService.POLL_RATE_MS)
      .map(() => Math.floor(Math.random() * 9) + 1);
  }

  getTotalMemory(spaceId: string, environmentId: string): Observable<number> {
    return Observable
      .interval(AppsService.POLL_RATE_MS)
      .map(() => Math.floor(Math.random() * 200) + 200);
  }

  getUsedCpuCount(spaceId: string, environmentId: string): Observable<number> {
    return Observable
    .interval(AppsService.POLL_RATE_MS)
    .map(() => Math.floor(Math.random() * 6) + 1);
  }

  getUsedMemory(spaceId: string, environmentId: string): Observable<number> {
    return Observable
    .interval(AppsService.POLL_RATE_MS)
    .map(() => Math.floor(Math.random() * 156) + 100);
  }
}
