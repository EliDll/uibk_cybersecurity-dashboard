import { TestBed } from '@angular/core/testing';
import { FilterOption, FilterProviderService } from './filter-provider.service';
import { ParsedDataService } from 'src/normalization';
import { MOCKED_PARSED_TRAINING_DATA } from 'src/utils/testing.utils';
import { take } from 'rxjs';
import { Developer, ProductTeam, Technology } from '../../shared';

describe('TrainingFilterProviderService', () => {
  let provider: FilterProviderService;
  let parseDataService: ParsedDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FilterProviderService, ParsedDataService],
    });

    provider = TestBed.inject(FilterProviderService);
    parseDataService = TestBed.inject(ParsedDataService);
  });

  it('returns distinct developers', (done: DoneFn) => {
    parseDataService.setParsedTrainingData$(MOCKED_PARSED_TRAINING_DATA);

    provider.developerOptions$.pipe(take(1)).subscribe((result) => {
      const expected = MOCKED_PARSED_TRAINING_DATA.developers.map(
        (it: Developer) => ({ label: it.name, id: it.id } as FilterOption)
      );

      expect(result).toEqual(expected);
      done();
    });
  });

  it('returns distinct product teams', (done: DoneFn) => {
    parseDataService.setParsedTrainingData$(MOCKED_PARSED_TRAINING_DATA);

    provider.productTeamOptions$.pipe(take(1)).subscribe((result) => {
      const expected = MOCKED_PARSED_TRAINING_DATA.productTeams.map(
        (it: ProductTeam) => ({ label: it.name, id: it.id } as FilterOption)
      );

      expect(result.sort()).toEqual(expected.sort());
      done();
    });
  });

  it('returns distinct technologies', (done: DoneFn) => {
    parseDataService.setParsedTrainingData$(MOCKED_PARSED_TRAINING_DATA);

    provider.technologyOptions$.pipe(take(1)).subscribe((result) => {
      const expected = MOCKED_PARSED_TRAINING_DATA.technologies.map(
        (it: Technology) => ({ label: it.name, id: it.id } as FilterOption)
      );

      expect(result.sort()).toEqual(expected.sort());
      done();
    });
  });
});
