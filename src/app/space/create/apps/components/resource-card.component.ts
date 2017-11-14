import {
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  APPS_SERVICE,
  IAppsService
} from '../services/apps.service';
import { Environment } from '../models/environment';

import { Observable } from 'rxjs';

@Component({
  selector: 'resource-card',
  templateUrl: 'resource-card.component.html'
})
export class ResourceCardComponent implements OnInit {

  @Input() spaceId: Observable<string>;
  @Input() environment: Environment;
  @Input() resourceTitle: string;
  @Input() statSupplier: Function;

  used: number;
  total: number;
  usedPercent: number;
  unusedPercent: number;

  constructor() { }

  ngOnInit(): void {
    this.statSupplier('fakeSpaceId', this.environment.environmentId)
        .subscribe(val => {
          this.used = val.used;
          this.total = val.total;
          this.usedPercent = (this.total !== 0) ? Math.floor(this.used / this.total * 100) : 0;
          this.unusedPercent = 100 - this.usedPercent;
        });
  }
}
