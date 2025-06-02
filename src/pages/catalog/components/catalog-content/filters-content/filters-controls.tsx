import { Button, Card, Checkbox, Slider, Text, TextInput } from '@gravity-ui/uikit';
import styles from './style.module.css';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useProducts } from '../../../../../components/hooks/useProducts';
import { INITIAL_CRITERIA } from '../../../../../constants/constants';

interface FiltersControlsProps {
  categoryKey?: string;
  subcategoryKey?: string;
}

export function FiltersControls({ categoryKey, subcategoryKey }: FiltersControlsProps) {
  const { handleSubmit, register, reset } = useForm();
  const { criteriaData, getProductsByCriteria, setIsFiltersOpen } = useProducts();

  const [priceValue, setPriceValue] = useState<number[]>([
    criteriaData.filters.price[0],
    criteriaData.filters.price[1],
  ]);
  const [areaValue, setAreaValue] = useState<number[]>([criteriaData.filters.area[0], criteriaData.filters.area[1]]);
  const [nebulaBuildersValue, setNebulaBuildersValue] = useState<boolean>(
    criteriaData.filters.developers.NebulaBuilders,
  );
  const [stellarEstatesValue, setStellarEstatesValue] = useState<boolean>(
    criteriaData.filters.developers.StellarEstates,
  );
  const [galaxyConstructionValue, setGalaxyConstructionValue] = useState<boolean>(
    criteriaData.filters.developers.GalaxyConstruction,
  );
  const [astralArchitectsValue, setAstralArchitectsValue] = useState<boolean>(
    criteriaData.filters.developers.AstralArchitects,
  );
  const [oneFloorsValue, setOneFloorsValue] = useState<boolean>(criteriaData.filters.floors[1]);
  const [twoFloorsValue, setTwoFloorsValue] = useState<boolean>(criteriaData.filters.floors[2]);
  const [threeFloorsValue, setThreeFloorsValue] = useState<boolean>(criteriaData.filters.floors[3]);

  const onSubmit = (data: Record<string, boolean>) => {
    criteriaData.filters.area = areaValue;
    criteriaData.filters.price = priceValue;
    const floorsKeys = ['1', '2', '3'];
    const developKeys = ['NebulaBuilders', 'StellarEstates', 'GalaxyConstruction', 'AstralArchitects'];

    Object.keys(data).forEach((key) => {
      if (floorsKeys.find((element) => element === key)) {
        criteriaData.filters.floors[key] = data[key];
        console.log('done');
      }
      if (developKeys.find((element) => element === key)) {
        criteriaData.filters.developers[key] = data[key];
      }
    });
    console.log(criteriaData);
    console.log(data);
    getProductsByCriteria(criteriaData);
    if (window.innerWidth < 535) {
      setIsFiltersOpen(false);
    }
  };

  return (
    <>
      <Card className={styles['filters-wrapper']}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void handleSubmit(onSubmit)(event);
          }}
        >
          <div className={styles['filter-group']}>
            <Text variant="subheader-2">Price, $</Text>
            <Slider
              size="s"
              defaultValue={[priceValue[0], priceValue[1]]}
              value={[priceValue[0], priceValue[1]]}
              min={0}
              max={1000000}
              step={100000}
              onUpdate={(value) => setPriceValue(value)}
            ></Slider>
            <label className={styles['slider-label']}>
              {' '}
              <div className={styles['label-text']}>from:</div>
              <TextInput value={priceValue[0].toLocaleString('en-US')}></TextInput>
            </label>
            <label className={styles['slider-label']}>
              <div>to:</div>
              <TextInput value={priceValue[1].toLocaleString('en-US')}></TextInput>
            </label>
          </div>

          <div className={styles['filter-group']}>
            <Text variant="subheader-2">
              Area, m<sup>2</sup>
            </Text>
            <Slider
              size="s"
              defaultValue={[areaValue[0], areaValue[1]]}
              value={[areaValue[0], areaValue[1]]}
              min={0}
              max={1000}
              step={50}
              onUpdate={(value) => setAreaValue(value)}
            ></Slider>
            <label className={styles['slider-label']}>
              {' '}
              <div className={styles['label-text']}>from:</div>
              <TextInput value={areaValue[0].toLocaleString('en-US')}></TextInput>
            </label>
            <label className={styles['slider-label']}>
              <div>to:</div>
              <TextInput value={areaValue[1].toLocaleString('en-US')}></TextInput>
            </label>
          </div>
          <div className={styles['filter-group']}>
            <Text variant="subheader-2">Developers</Text>
            <div className={styles.developers}>
              <Checkbox
                {...register('NebulaBuilders')}
                checked={nebulaBuildersValue}
                onChange={(event) => setNebulaBuildersValue(event.target.checked)}
              >
                Nebula Builders
              </Checkbox>
              <Checkbox
                {...register('StellarEstates')}
                checked={stellarEstatesValue}
                onChange={(event) => setStellarEstatesValue(event.target.checked)}
              >
                Stellar Estates
              </Checkbox>
              <Checkbox
                {...register('GalaxyConstruction')}
                checked={galaxyConstructionValue}
                onChange={(event) => setGalaxyConstructionValue(event.target.checked)}
              >
                Galaxy Construction
              </Checkbox>
              <Checkbox
                {...register('AstralArchitects')}
                checked={astralArchitectsValue}
                onChange={(event) => setAstralArchitectsValue(event.target.checked)}
              >
                Astral Architects
              </Checkbox>
            </div>
          </div>
          <div className={styles['filter-group']}>
            <Text variant="subheader-2">Floors</Text>
            <label className={styles.floors}>
              <Checkbox
                {...register('1')}
                checked={oneFloorsValue}
                onChange={(event) => setOneFloorsValue(event.target.checked)}
              >
                1
              </Checkbox>
              <Checkbox
                {...register('2')}
                checked={twoFloorsValue}
                onChange={(event) => setTwoFloorsValue(event.target.checked)}
              >
                2
              </Checkbox>
              <Checkbox
                {...register('3')}
                checked={threeFloorsValue}
                onChange={(event) => setThreeFloorsValue(event.target.checked)}
              >
                3
              </Checkbox>
            </label>
          </div>
          <div className={styles['filters-buttons']}>
            <Button
              size="l"
              view="action"
              onClick={() => {
                reset({
                  '1': false,
                  '2': false,
                  '3': false,
                  NebulaBuilders: false,
                  StellarEstates: false,
                  GalaxyConstruction: false,
                  AstralArchitects: false,
                });
                setNebulaBuildersValue(false);
                setStellarEstatesValue(false);
                setGalaxyConstructionValue(false);
                setAstralArchitectsValue(false);
                setOneFloorsValue(false);
                setTwoFloorsValue(false);
                setThreeFloorsValue(false);
                console.log(oneFloorsValue, threeFloorsValue);
                setAreaValue([0, 1000]);
                setPriceValue([0, 1000000]);
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
      </Card>
    </>
  );
}
