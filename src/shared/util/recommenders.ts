import {
  ParsedTrainingDataModel,
  Developer,
  ProductTeam,
  TrainingUnit,
  SecurityRisk,
} from '../public_api';

export type RankedTrainingUnit = TrainingUnit & {
  score: number;
  risks: SecurityRisk[];
};

const ascendingScoreComparator = (
  a: RankedTrainingUnit,
  b: RankedTrainingUnit
) => {
  return b.score - a.score;
};

export function getScoredTrainingsForTeam(
  data: ParsedTrainingDataModel,
  team: ProductTeam
): RankedTrainingUnit[] {
  const devs = data.developers.filter((dev) =>
    dev.productTeamsIds.includes(team.id)
  );

  const rankedUnitsPerDev = devs.map((dev) =>
    getScoredTrainingsForDeveloper(data, dev)
  );

  const finalRankedUnits: RankedTrainingUnit[] = [];
  rankedUnitsPerDev.map((devUnits) => {
    devUnits.map((unit) => {
      const existing = finalRankedUnits.find((x) => x.id === unit.id);
      if (existing) {
        existing.score += unit.score;
      } else {
        finalRankedUnits.push(unit);
      }
    });
  });

  return finalRankedUnits.sort(ascendingScoreComparator);
}

export function getScoredTrainingsForDeveloper(
  data: ParsedTrainingDataModel,
  developer: Developer
): RankedTrainingUnit[] {
  const entries = data.trainingEntries.filter(
    (e) => e.developerId === developer.id
  );

  const plannedTrainingIds = entries.map((e) => e.trainingUnitId);

  //Find units that are not yet scheduled for this dev
  const newUnits = data.trainingUnits.filter(
    (u) => !plannedTrainingIds.includes(u.id)
  );

  const plannedUnits = data.trainingUnits.filter((u) =>
    plannedTrainingIds.includes(u.id)
  );

  const coveredRisks = plannedUnits.map((u) => u.addressedRiskIds).flat();

  const rankedUnits = newUnits.map((u) => {
    const score = u.addressedRiskIds.filter(
      (risk) => !coveredRisks.includes(risk)
    ).length;
    const risks = data.securityRisks.filter((r) =>
      u.addressedRiskIds.includes(r.id)
    );
    return { ...u, score: score, risks: risks };
  });

  return rankedUnits.sort(ascendingScoreComparator);
}
