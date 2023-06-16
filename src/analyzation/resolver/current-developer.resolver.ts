import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Developer } from 'src/shared';
import { TrainingFilterService } from '../public_api';
import { map } from 'rxjs';

export const currentDeveloperResolver: ResolveFn<
  Developer | undefined
> = () => {
  return inject(TrainingFilterService).filteredData$.pipe(
    map((it) => {
      const devs = it.developers;
      if (devs.length !== 1) {
        return undefined;
      }
      return devs[0];
    })
  );
};
