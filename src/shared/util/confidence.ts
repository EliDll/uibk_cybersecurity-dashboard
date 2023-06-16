import { averageArray } from 'src/utils/array.utils';
import { DataUtils } from 'src/analyzation/data-util/data-utils';
import {
  Developer,
  ParsedModel,
  ProductTeam,
  SecurityRisk,
  TrainingEntry,
} from '../public_api';
import { DateTime } from 'luxon';

export type AverageConfidenceArgs = Pick<
  ParsedModel,
  'trainingEntries' | 'trainingUnits' | 'developers' | 'productTeams'
>;
export function getAverageConfidenceAtDate<TData extends AverageConfidenceArgs>(
  data: TData,
  date: Date,
  risk?: SecurityRisk
): number {
  return getAverageConfidence(
    {
      ...data,
      trainingEntries: data.trainingEntries.filter((it) =>
        trainingIsBeforeDate(it, date)
      ),
    },
    risk
  );
}

export function getAverageConfidence<TData extends AverageConfidenceArgs>(
  data: TData,
  risk?: SecurityRisk
): number {
  return averageArray(
    data.productTeams
      .map((it) => getTeamAverageConfidence(data, it, risk))
      .filter((it) => it > 0)
  );
}

export type DeveloperAverageConfidenceArgs = Pick<
  ParsedModel,
  'trainingEntries' | 'trainingUnits'
>;

export function getDeveloperAverageConfidence<
  TData extends DeveloperAverageConfidenceArgs
>(data: TData, dev: Developer, risk?: SecurityRisk): number {
  let entries = data.trainingEntries.filter((it) => it.developerId === dev.id);
  if (risk) {
    const unitIDs = new Set<string>(
      data.trainingUnits
        .filter((it) => it.addressedRiskIds.includes(risk.id))
        .map((it) => it.id)
        .flat()
    );

    entries = entries.filter(
      (it) => it.completedDate !== undefined && unitIDs.has(it.trainingUnitId)
    );
  }

  return averageArray(
    entries
      .map((it) => it.confidencePercentage)
      .filter((it): it is number => it !== undefined)
  );
}

export type TeamAverageConfidenceArgs = Pick<
  ParsedModel,
  'trainingEntries' | 'trainingUnits' | 'developers'
>;
export function getTeamAverageConfidence<
  TData extends TeamAverageConfidenceArgs
>(data: TData, team: ProductTeam, risk?: SecurityRisk): number {
  return averageArray(
    data.developers
      .filter((it) => it.productTeamsIds.includes(team.id))
      .map((it) => getDeveloperAverageConfidence(data, it, risk))
      .filter((it) => it > 0)
  );
}

function trainingIsBeforeDate(
  training: TrainingEntry,
  snapshotDate: Date
): boolean {
  const referencedDate = DataUtils.isTrainingEntryCompleted(training)
    ? training.completedDate
    : training.scheduledDate;
  if (referencedDate == null) {
    return false;
  }

  const snapshotDateTime = DateTime.fromJSDate(snapshotDate).endOf('day');
  const referenceDateTime = DateTime.fromJSDate(referencedDate).endOf('day');

  return referenceDateTime <= snapshotDateTime;
}
