import { Button, Card, Text } from '@gravity-ui/uikit';
import styles from './style.module.css';
import { FormProvider, useForm } from 'react-hook-form';
import { useProducts } from '../../../../../components/hooks/useProducts';
import { DEVELOPERS_KEYS, FLOORS, INITIAL_CRITERIA } from '../../../../../constants/constants';
import { Xmark } from '@gravity-ui/icons';
import { CheckComponent } from './check-component/check-component';
import { FiltersFieldsType } from './types';
import { NumberSlider } from './number-slider/number-slider';

interface FiltersControlsProps {
  categoryKey?: string;
  subcategoryKey?: string;
}

const INITIAL_FORM_STATE: FiltersFieldsType = {
  price: [0, 1000000],
  area: [0, 1000],
  '1': false,
  '2': false,
  '3': false,
  NebulaBuilders: false,
  StellarEstates: false,
  GalaxyConstruction: false,
  AstralArchitects: false,
};

export function FiltersControls({ categoryKey, subcategoryKey }: FiltersControlsProps) {
  const methods = useForm<FiltersFieldsType>({
    defaultValues: INITIAL_FORM_STATE,
  });
  const { isFiltersOpen } = useProducts();
  const { criteriaData, getProductsByCriteria, setIsFiltersOpen } = useProducts();

  const onSubmit = (data: FiltersFieldsType) => {
    console.log(data);
    criteriaData.filters.area = data.area;
    criteriaData.filters.price = data.price;

    for (const key of Object.keys(data)) {
      const value: unknown = data[key];
      if (key in criteriaData.filters.floors && typeof value === 'boolean') {
        criteriaData.filters.floors[key] = value;
      }
      if (key in criteriaData.filters.developers && typeof value === 'boolean') {
        criteriaData.filters.developers[key] = value;
      }
    }

    getProductsByCriteria(criteriaData);
    if (window.innerWidth < 570) {
      setIsFiltersOpen(false);
    }
  };

  return (
    <>
      <Card className={`${styles['filters-wrapper']} ${isFiltersOpen ? styles['filters-shown'] : ''}`}>
        <FormProvider {...methods}>
          <form
            className={styles.form}
            onSubmit={(event) => {
              event.preventDefault();
              void methods.handleSubmit(onSubmit)(event);
            }}
          >
            <Xmark className={styles['close-button']} onClick={() => setIsFiltersOpen(false)}></Xmark>

            <div className={styles['filter-group']}>
              <Text variant="subheader-2">Price, $</Text>
              <NumberSlider type="price" />
            </div>

            <div className={styles['filter-group']}>
              <Text variant="subheader-2">
                Area, m<sup>2</sup>
              </Text>
              <NumberSlider type="area" />
            </div>
            <div className={styles['filter-group']}>
              <Text variant="subheader-2">Developers</Text>
              <div className={styles.developers}>
                {DEVELOPERS_KEYS.map((element) => (
                  <CheckComponent element={element} key={element} />
                ))}
              </div>
            </div>
            <div className={styles['filter-group']}>
              <Text variant="subheader-2">Floors</Text>
              <label className={styles.floors}>
                {FLOORS.map((element) => (
                  <CheckComponent key={element} element={element} />
                ))}
              </label>
            </div>
            <div className={styles['filters-buttons']}>
              <Button
                size="l"
                view="action"
                onClick={() => {
                  methods.reset(INITIAL_FORM_STATE);

                  getProductsByCriteria({
                    ...INITIAL_CRITERIA(),
                    categoryKey,
                    subcategoryKey,
                  });
                }}
              >
                Clear
              </Button>
              <Button size="l" view="action" type="submit">
                Apply
              </Button>
            </div>
          </form>
        </FormProvider>
      </Card>
    </>
  );
}
