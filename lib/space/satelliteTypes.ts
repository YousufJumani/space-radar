export type SatelliteCategory =
  | 'ISS'
  | 'Starlink'
  | 'GPS'
  | 'Weather'
  | 'Communication'
  | 'Scientific'
  | 'Other';

export interface Satellite {
  id: string;
  name: string;
  category: SatelliteCategory;
  tle1?: string;
  tle2?: string;
  inclination: number;
  raan: number;
  eccentricity: number;
  argPerigee: number;
  meanAnomaly: number;
  meanMotion: number;
  epoch: number;
  altitude?: number;
  velocity?: number;
  period?: number;
}
