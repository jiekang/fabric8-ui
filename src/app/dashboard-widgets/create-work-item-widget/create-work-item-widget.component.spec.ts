import { LocationStrategy } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgArrayPipesModule } from 'angular-pipes';
import { FilterService, WorkItem, WorkItemService } from 'fabric8-planner';
import { Broadcaster } from 'ngx-base';
import { Context, Contexts } from 'ngx-fabric8-wit';
import { User, UserService } from 'ngx-login-client';
import { ConnectableObservable,  Observable ,  of as observableOf, Subject } from 'rxjs';
import { publish } from 'rxjs/operators';
import { createMock } from 'testing/mock';
import { MockFeatureToggleComponent } from 'testing/mock-feature-toggle.component';
import {
  initContext,
  TestContext
} from 'testing/test-context';
import { WorkItemsData } from '../../shared/workitem-utils';
import { CreateWorkItemWidgetComponent } from './create-work-item-widget.component';

@Component({
  template: '<fabric8-create-work-item-widget [userOwnsSpace]="userOwnsSpace"></fabric8-create-work-item-widget>'
})
class HostComponent {
  userOwnsSpace: boolean;
}

describe('CreateWorkItemWidgetComponent', () => {
  type TestingContext = TestContext<CreateWorkItemWidgetComponent, HostComponent>;

  let fakeUser: Observable<User> = observableOf({
    id: 'fakeId',
    type: 'fakeType',
    attributes: {
      fullName: 'fakeName',
      imageURL: 'null',
      username: 'fakeUserName'
    }
  } as User);

  const testContext = initContext(CreateWorkItemWidgetComponent, HostComponent, {
    declarations: [ MockFeatureToggleComponent ],
    imports: [NgArrayPipesModule, RouterModule],
    providers: [
      { provide: ActivatedRoute, useValue: jasmine.createSpy('ActivatedRoute') },
      { provide: LocationStrategy, useValue: jasmine.createSpyObj('LocationStrategy', ['prepareExternalUrl']) },
      { provide: Broadcaster, useValue: createMock(Broadcaster) },
      { provide: Contexts, useValue: ({ current: new Subject<Context>() }) },
      {
        provide: UserService, useFactory: () => {
          let userService = createMock(UserService);
          userService.getUser.and.returnValue(fakeUser);
          userService.loggedInUser = fakeUser.pipe(publish()) as ConnectableObservable<User> & jasmine.Spy;
          return userService;
        }
      },
      {
        provide: WorkItemService, useFactory: () => {
          let workItemServiceMock = jasmine.createSpyObj('WorkItemService', ['buildUserIdMap', 'getWorkItems']);
          workItemServiceMock.buildUserIdMap.and.returnValue(fakeUser);
          workItemServiceMock.getWorkItems.and.returnValue(observableOf({ workItems: [] }) as Observable<WorkItemsData>);
          return workItemServiceMock;
        }
      },
      {
        provide: FilterService, useFactory: () => {
          let filterServiceMock = jasmine.createSpyObj('FilterService', ['queryBuilder']);
          return filterServiceMock;
        }
      },
      {
        provide: Router, useFactory: (): jasmine.SpyObj<Router> => {
          let mockRouterEvent: any = {
            'id': 1,
            'url': 'mock-url'
          };

          let mockRouter = jasmine.createSpyObj('Router', ['createUrlTree', 'navigate', 'serializeUrl']);
          mockRouter.events = observableOf(mockRouterEvent);

          return mockRouter;
        }
      }
    ],
    schemas: [
      NO_ERRORS_SCHEMA
    ]
  });

  it('should enable buttons if the user owns the space', function() {
    testContext.hostComponent.userOwnsSpace = true;
    testContext.testedDirective.myWorkItemsCount = observableOf(0);
    testContext.detectChanges();

    expect(testContext.fixture.debugElement.query(By.css('#spacehome-my-workitems-add-button'))).not.toBeNull();
    expect(testContext.fixture.debugElement.query(By.css('#spacehome-my-workitems-create-button'))).not.toBeNull();

  });

  it('should disable buttons if the user does not own the space', function() {
    testContext.hostComponent.userOwnsSpace = false;
    testContext.testedDirective.myWorkItemsCount = observableOf(0);
    testContext.detectChanges();

    expect(testContext.fixture.debugElement.query(By.css('#spacehome-my-workitems-add-button'))).toBeNull();
    expect(testContext.fixture.debugElement.query(By.css('#spacehome-my-workitems-create-button'))).toBeNull();
  });
});
