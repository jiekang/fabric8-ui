// import {
//   ComponentFixture,
//   TestBed
// } from '@angular/core/testing';

// import { By } from '@angular/platform-browser';
// import { DebugElement } from '@angular/core';

// import { Observable } from 'rxjs';

// import { CollapseModule } from 'ngx-bootstrap/collapse';

// import { ResourceCardComponent } from './resource-card.component';
// import { AppsService } from '../services/apps.service';

// describe('ResourceCardComponent', () => {
//   let component: ResourceCardComponent;
//   let fixture: ComponentFixture<ResourceCardComponent>;
//   let mockSvc: AppsService;

//   beforeEach(() => {
//     mockSvc = {
//       getApplications: () => { throw 'Not Implemented'; },
//       getEnvironments: () => { throw 'Not Implemented'; },
//       getPodCount: () => Observable.of(2),
//       getCpuStat: () => Observable.of({ used: 3, total: 10}),
//       getMemoryStat: () => Observable.of({ used: 500, total: 1024}),
//       getNetworkStat: () => Observable.of({ used: 64, total: 2048})
//     };

//     spyOn(mockSvc, 'getApplications').and.callThrough();
//     spyOn(mockSvc, 'getEnvironments').and.callThrough();
//     spyOn(mockSvc, 'getPodCount').and.callThrough();
//     spyOn(mockSvc, 'getCpuStat').and.callThrough();
//     spyOn(mockSvc, 'getMemoryStat').and.callThrough();
//     spyOn(mockSvc, 'getNetworkStat').and.callThrough();

//     TestBed.configureTestingModule({
//       imports: [ CollapseModule.forRoot() ],
//       declarations: [ ResourceCardComponent ],
//       providers: [ { provide: AppsService, useValue: mockSvc } ]
//     });

//     fixture = TestBed.createComponent(ResourceCardComponent);
//     component = fixture.componentInstance;

//     component.spaceId = Observable.of('mockSpaceId');
//     component.environment = { environmentId: 'mockEnvironmentId', name: 'mockEnvironment'};
//     component.resourceTitle = 'mockResourceTitle';
//     component.statSupplier = (spaceId: string, environmentId: string) => {
//       return Observable.of({ used: 3, total: 5 })
//     };

//     fixture.detectChanges();
//   });

//   describe('supplied stat data', () => {
//     let de: DebugElement;
//     let el: HTMLElement;

//     beforeEach(() => {
//       de = fixture.debugElement.query(By.css('#resourceCardLabel'));
//       el = de.nativeElement;
//     });

//     it('should be set from mockSvc function', () => {
//       // expect(mockSvc.getPodCount).toHaveBeenCalledWith('mockAppId', 'mockEnvironmentId');
//       expect(el.textContent).toEqual('3 of 5');
//     });
//   });
// });
