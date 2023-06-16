import { DateTime } from 'luxon';
import { ProductRelease } from '../public_api';

export function getReleaseLabel(release: ProductRelease) {
  return (
    release.id +
    ' (' +
    DateTime.fromJSDate(release.releaseDate).toFormat('yyyy-MM-dd') +
    ')'
  );
}
