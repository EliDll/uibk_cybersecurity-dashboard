import { TestBed } from '@angular/core/testing';
import { TrainingFilterService } from './training-filter.service';
import { ParsedDataService } from 'src/normalization';
import { MOCKED_PARSED_TRAINING_DATA } from 'src/utils/testing.utils';
import { take } from 'rxjs';
import { Developer, ProductTeam, Technology } from '../../shared';

describe('TrainingFilterService', () => {
  let filter: TrainingFilterService;
  let parseDataService: ParsedDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrainingFilterService, ParsedDataService],
    });

    filter = TestBed.inject(TrainingFilterService);
    parseDataService = TestBed.inject(ParsedDataService);
  });

  it('filters developers', (done: DoneFn) => {
    parseDataService.setParsedTrainingData$(MOCKED_PARSED_TRAINING_DATA);

    const names = MOCKED_PARSED_TRAINING_DATA.developers
      .slice(1, -1)
      .map((it: Developer) => it.name);

    filter.applyFilter({
      developerIds: names,
    });

    filter.filteredData$.pipe(take(1)).subscribe((data) => {
      const result = data.developers.map((it) => it.name);

      expect(result.sort()).toEqual(names.sort());
      done();
    });
  });

  it('filters teams', (done: DoneFn) => {
    parseDataService.setParsedTrainingData$(MOCKED_PARSED_TRAINING_DATA);

    const filteredTeamIds = MOCKED_PARSED_TRAINING_DATA.productTeams
      .slice(1, -1)
      .map((it: ProductTeam) => it.id);

    filter.applyFilter({
      productTeamIds: filteredTeamIds,
    });

    filter.filteredData$.pipe(take(1)).subscribe((data) => {
      data.productTeams.map((productTeam: ProductTeam) =>
        expect(filteredTeamIds.includes(productTeam.id))
      );
      done();
    });
  });

  it('filters technologies', (done: DoneFn) => {
    parseDataService.setParsedTrainingData$(MOCKED_PARSED_TRAINING_DATA);

    const filteredTechnologyIds = MOCKED_PARSED_TRAINING_DATA.technologies
      .slice(1, -1)
      .map((it: Technology) => it.id);

    filter.applyFilter({
      technologyIds: filteredTechnologyIds,
    });

    filter.filteredData$.pipe(take(1)).subscribe((data) => {
      data.technologies.map((technology: Technology) =>
        expect(filteredTechnologyIds.includes(technology.id))
      );
      done();
    });
  });

  it('filters developers, product team and technologies', (done: DoneFn) => {
    parseDataService.setParsedTrainingData$(MOCKED_PARSED_TRAINING_DATA);

    const filteredDeveloperIds = MOCKED_PARSED_TRAINING_DATA.productTeams
      .slice(0, -1)
      .map((it: Developer) => it.id);
    const filteredProductTeamIds = MOCKED_PARSED_TRAINING_DATA.productTeams
      .slice(0, -1)
      .map((it: ProductTeam) => it.id);
    const filteredTechnologyIds = MOCKED_PARSED_TRAINING_DATA.technologies
      .slice(0, -1)
      .map((it: Technology) => it.id);

    filter.applyFilter({
      developerIds: filteredDeveloperIds,
      productTeamIds: filteredProductTeamIds,
      technologyIds: filteredTechnologyIds,
    });

    filter.filteredData$.pipe(take(1)).subscribe((data) => {
      data.developers.map((developer: Developer) =>
        expect(filteredDeveloperIds.includes(developer.id))
      );
      done();
    });
    filter.filteredData$.pipe(take(1)).subscribe((data) => {
      data.productTeams.map((productTeam: ProductTeam) =>
        expect(filteredProductTeamIds.includes(productTeam.id))
      );
      done();
    });
    filter.filteredData$.pipe(take(1)).subscribe((data) => {
      data.technologies.map((technology: Technology) =>
        expect(filteredTechnologyIds.includes(technology.id))
      );
      done();
    });
  });
});
