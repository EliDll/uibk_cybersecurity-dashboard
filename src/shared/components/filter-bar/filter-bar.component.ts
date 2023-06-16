import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';

type CurrentFilter = 'training' | 'development' | 'deployment';

@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss'],
})
export class FilterBarComponent {
  currentFilter$: Observable<CurrentFilter | null>;

  constructor(readonly router: Router, readonly location: Location) {
    this.currentFilter$ = router.events.pipe(
      map(() => {
        const url = location.path();
        if (url.endsWith('training')) {
          return 'training';
        }
        if (url.endsWith('deployment')) {
          return 'deployment';
        }
        if (url.endsWith('development')) {
          return 'development';
        }
        return null;
      })
    );
  }
}
