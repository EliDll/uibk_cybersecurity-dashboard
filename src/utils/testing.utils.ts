import { ParsedTrainingDataModel } from 'src/normalization';

export const MOCKED_PARSED_TRAINING_DATA: ParsedTrainingDataModel = {
  technologies: [
    {
      id: '1',
      name: 'JavaScript',
    },
    {
      id: '2',
      name: 'Python',
    },
    {
      id: '3',
      name: 'Java',
    },
    {
      id: '4',
      name: 'C#',
    },
    {
      id: '5',
      name: 'Go',
    },
  ],
  securityRisks: [
    {
      id: '1',
      name: 'Injection',
      url: 'tstUrl',
    },
    {
      id: '2',
      name: 'Cross-Site Scripting (XSS)',
      url: 'tstUrl',
    },
    {
      id: '3',
      name: 'Broken Authentication and Session Management',
      url: 'tstUrl',
    },
    {
      id: '4',
      name: 'Broken Access Control',
      url: 'tstUrl',
    },
    {
      id: '5',
      name: 'Security Misconfiguration',
      url: 'tstUrl',
    },
  ],
  trainingUnits: [
    {
      id: '1',
      revisionDate: new Date('2023-04-10'),
      addressedRiskIds: ['1', '2'],
    },
    {
      id: '2',
      revisionDate: new Date('2023-04-12'),
      addressedRiskIds: ['3'],
    },
    {
      id: '3',
      revisionDate: new Date('2023-04-15'),
      addressedRiskIds: ['1', '3'],
    },
    {
      id: '4',
      revisionDate: new Date('2023-04-09'),
      addressedRiskIds: ['2'],
    },
    {
      id: '5',
      revisionDate: new Date('2023-04-13'),
      addressedRiskIds: ['1'],
    },
  ],
  productTeams: [
    {
      id: '1',
      name: 'Team 1',
      technologyIds: ['1', '3'],
    },
    {
      id: '2',
      name: 'Team 2',
      technologyIds: ['2', '4'],
    },
    {
      id: '3',
      name: 'Team 3',
      technologyIds: ['2', '5'],
    },
  ],
  developers: [
    {
      id: 'dev1',
      name: 'John Smith',
      loggedTrainingTime: 3600,
      completedTrainingUnitsIds: ['1', '2', '3'],
      scheduledTrainingUnitsIds: ['4'],
      productTeamsIds: ['1'],
    },
    {
      id: 'dev2',
      name: 'Jane Doe',
      loggedTrainingTime: 7200,
      completedTrainingUnitsIds: ['unit2'],
      scheduledTrainingUnitsIds: ['1', '3', '4'],
      productTeamsIds: ['2'],
    },
    {
      id: 'dev3',
      name: 'Bob Johnson',
      loggedTrainingTime: 1800,
      completedTrainingUnitsIds: ['2', '4'],
      scheduledTrainingUnitsIds: ['1', '3'],
      productTeamsIds: ['1', '2'],
    },
    {
      id: 'dev4',
      name: 'Alice Williams',
      loggedTrainingTime: 5400,
      completedTrainingUnitsIds: ['1', '2', '3'],
      scheduledTrainingUnitsIds: ['4'],
      productTeamsIds: ['2', '3'],
    },
  ],
};
