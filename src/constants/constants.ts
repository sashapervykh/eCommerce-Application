export const INITIAL_CRITERIA = () => {
  return {
    sort: undefined,
    search: undefined,
    filters: {
      price: [0, 1000000],
      area: [0, 1000],
      floors: { 1: false, 2: false, 3: false },
      developers: {
        NebulaBuilders: false,
        StellarEstates: false,
        GalaxyConstruction: false,
        AstralArchitects: false,
      },
    },
  };
};

export const DEVELOPERS_NAMES: Record<string, string> = {
  NebulaBuilders: 'Nebula Builders',
  StellarEstates: 'Stellar Estates',
  GalaxyConstruction: 'Galaxy Construction',
  AstralArchitects: 'Astral Architects',
};

export type DevelopersType = 'NebulaBuilders' | 'StellarEstates' | 'GalaxyConstruction' | 'AstralArchitects';
export const DEVELOPERS_KEYS: DevelopersType[] = [
  'NebulaBuilders',
  'StellarEstates',
  'GalaxyConstruction',
  'AstralArchitects',
];

export type FloorsType = '1' | '2' | '3';
export const FLOORS: FloorsType[] = ['1', '2', '3'];
