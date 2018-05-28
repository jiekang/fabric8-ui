import {
  Component,
  OnDestroy,
  ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { Broadcaster } from 'ngx-base';
import { Context, Space } from 'ngx-fabric8-wit';
import { User, UserService } from 'ngx-login-client';

import { ContextService } from 'app/shared/context.service';
import { DependencyCheckService } from 'ngx-forge';
import { Application, DeploymentApiService } from '../create/deployments/services/deployment-api.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8-add-app-overlay',
  styleUrls: ['./add-app-overlay.component.less'],
  templateUrl: './add-app-overlay.component.html'
})
export class AddAppOverlayComponent implements OnDestroy {
  currentSpace: Space;
  isProjectNameValid: boolean;
  loggedInUser: User;
  projectName: string = '';
  selectedFlow: string = '';
  spaces: Space[] = [];
  subscriptions: Subscription[] = [];
  applications: string[] = [];
  isProjectNameAvailable: boolean;

  constructor(private contextService: ContextService,
              private dependencyCheckService: DependencyCheckService,
              private broadcaster: Broadcaster,
              private userService: UserService,
              private router: Router,
              private deploymentApiService: DeploymentApiService) {
    this.loggedInUser = this.userService.currentLoggedInUser;
    this.subscriptions.push(this.dependencyCheckService.getDependencyCheck().subscribe((val) => {
      this.projectName = val.projectName;
    }));
    if (this.contextService && this.contextService.current) {
      this.subscriptions.push(
        this.contextService.current
          .map((ctx: Context) => ctx.space)
          .switchMap(space => {
            if (space) {
              this.currentSpace = space;
              return this.deploymentApiService.getApplications(space.id);
            } else {
              return Observable.empty();
            }
          })
          .subscribe((response: Application[]) => {
            if (response) {
              const applications: string[] = response.map(app => {
                return app.attributes.name ? app.attributes.name.toLowerCase() : '';
              });
              this.applications = applications;
            }
          })
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  /**
   * Helper to route to create app
   */
  hideAddAppOverlay(): void {
    this.broadcaster.broadcast('showAddAppOverlay', false);
  }

  /**
   * Helper to update launcher selection
   */
  updateLauncherFlowSelection(selLaunch: string): void {
    this.selectedFlow = selLaunch;
  }

  /**
   * Helper to route to create/import app
   */
  routeToLaunchApp(): void {
    this.router.navigate(['/',
      this.loggedInUser.attributes.username, this.currentSpace.attributes.name,
      'applauncher', this.selectedFlow, this.projectName]);
    this.hideAddAppOverlay();
  }

  /**
   * Validate the application name
   */
  validateProjectName(): void {
    this.projectName = this.projectName.toLowerCase();
    this.isProjectNameValid =
      this.dependencyCheckService.validateProjectName(this.projectName);
    this.isProjectNameAvailable = this.applications.indexOf(this.projectName) === -1 ? true : false;
  }
}
