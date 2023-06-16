import { Type } from 'class-transformer';

export type ParsedDevelopmentDataModel = Pick<
  ParsedModel,
  | 'productTeams'
  | 'securityRisks'
  | 'productReleases'
  | 'codeScanFindings'
  | 'penTestFindings'
>;
export type ParsedTrainingDataModel = Pick<
  ParsedModel,
  | 'developers'
  | 'trainingUnits'
  | 'trainingEntries'
  | 'productTeams'
  | 'securityRisks'
  | 'technologies'
>;

export class ParsedModel {
  @Type(() => Developer)
  developers: Developer[];
  @Type(() => TrainingUnit)
  trainingUnits: TrainingUnit[];
  @Type(() => TrainingEntry)
  trainingEntries: TrainingEntry[];
  @Type(() => ProductTeam)
  productTeams: ProductTeam[];
  @Type(() => Technology)
  technologies: Technology[];
  @Type(() => SecurityRisk)
  securityRisks: SecurityRisk[];
  @Type(() => ProductRelease)
  productReleases: ProductRelease[];
  @Type(() => CodeScanFinding)
  codeScanFindings: CodeScanFinding[];
  @Type(() => PenTestFinding)
  penTestFindings: PenTestFinding[];
}

export class IndustryReference {
  riskId: string;
  confidencePercentage: number;
}

export class Developer {
  id: string;
  name: string;
  productTeamsIds: string[];
}

export class TrainingUnit {
  id: string;
  addressedRiskIds: string[];
}

export class TrainingEntry {
  developerId: string;
  trainingUnitId: string;
  @Type(() => Date)
  completedDate?: Date;
  @Type(() => Date)
  scheduledDate: Date;
  loggedTime: number;
  confidencePercentage?: number;
}

export class ProductTeam {
  id: string;
  name: string;
  technologyIds: string[];
}

export class Technology {
  id: string;
  name: string;
}

export class SecurityRisk {
  id: string;
  name: string;
  url: string;
  industryPercentage: number;
}

export class ProductRelease {
  id: string;
  productId: string;
  @Type(() => Date)
  releaseDate: Date;
}

export class CodeScanFinding {
  releaseId: string;
  riskIds: string[];
}

export class PenTestFinding {
  releaseId: string;
  riskIds: string[];
  severity: number;
  @Type(() => Date)
  resolvedDate?: Date;
  ignored: boolean;
}
