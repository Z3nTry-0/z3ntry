export interface GlobePoint {
  lat: number;
  lng: number;
  label: string;
}

export interface GlobeConnection {
  source: GlobePoint;
  target: GlobePoint;
}
