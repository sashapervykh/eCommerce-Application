export interface FiltersFieldsType {
  price: [number, number];
  area: [number, number];
  '1': boolean;
  '2': boolean;
  '3': boolean;
  NebulaBuilders: boolean;
  StellarEstates: boolean;
  GalaxyConstruction: boolean;
  AstralArchitects: boolean;
  [key: string]: [number, number] | boolean;
}
