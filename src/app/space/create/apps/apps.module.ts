import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';

import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CollapseModule } from 'ngx-bootstrap/collapse';

import { ChartModule } from 'patternfly-ng';

import { AppModule as RuntimeConsoleModule } from '../../../../a-runtime-console/index';

import { AppsComponent } from './apps.component';
import { AppCardComponent } from './components/app-card.component';
import { AppsRoutingModule } from './apps-routing.module';

import { AppsService } from './services/apps.service';

const USE_RUNTIME_CONSOLE = ENV !== 'development';

const imports = USE_RUNTIME_CONSOLE ?
  [CommonModule, RuntimeConsoleModule] :
  [
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    AccordionModule.forRoot(),
    ChartModule,
    CommonModule,
    AppsRoutingModule
  ];

const declarations = USE_RUNTIME_CONSOLE ?
  [] :
  [AppsComponent, AppCardComponent];

const providers = USE_RUNTIME_CONSOLE ?
  [] :
  [BsDropdownConfig, AppsService];

@NgModule({
  imports: imports,
  declarations: declarations,
  providers: providers
})
export class AppsModule {
  constructor(http: Http) { }
}
