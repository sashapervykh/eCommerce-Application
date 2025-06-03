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
