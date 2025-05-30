import { Button, Card, Checkbox, Slider, Text, TextInput } from '@gravity-ui/uikit';
import styles from './style.module.css';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useProducts } from '../../../../../components/hooks/useProducts';

export function FiltersControls() {
  const { handleSubmit, register } = useForm();
  const [sliderValue, setSliderValue] = useState<number[]>([0, 1000000]);
  const [areaValue, setAreaValue] = useState<number[]>([0, 1000]);
  const { getProductsByCriteria } = useProducts();

  const onSubmit = (data: Record<string, boolean>) => {
    const allFilters = [
      `variants.attributes.Area:range (${areaValue[0].toString()} to ${areaValue[1].toString()})`,
      `variants.price.centAmount:range (${(sliderValue[0] * 100).toString()} to ${(50000000 * 100).toString()})`,
    ];
    const floorsKeys = ['1', '2', '3'];
    const developKeys = ['NebulaBuilders', 'StellarEstates', 'GalaxyConstruction', 'AstralArchitects'];
    const floorsFilters: string[] = [];
    const developersFilters: string[] = [];

    Object.keys(data).forEach((key) => {
      if (floorsKeys.find((element) => element === key) && data[key]) {
        floorsFilters.push(`"${key}"`);
      }
      if (developKeys.find((element) => element === key) && data[key]) {
        developersFilters.push(`"${key}"`);
      }
    });

    if (developersFilters.length > 0) {
      allFilters.push(`variants.attributes.Developer.key: ${developersFilters.join(',')}`);
    }
    if (floorsFilters.length > 0) {
      allFilters.push(`variants.attributes.Floors.key: ${floorsFilters.join(',')}`);
    }

    console.log(allFilters);
    getProductsByCriteria({ filters: allFilters });
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
              defaultValue={[sliderValue[0], sliderValue[1]]}
              min={0}
              max={1000000}
              step={100000}
              onUpdate={(value) => setSliderValue(value)}
            ></Slider>
            <label className={styles['slider-label']}>
              {' '}
              <div className={styles['label-text']}>from:</div>
              <TextInput value={sliderValue[0].toLocaleString('en-US')}></TextInput>
            </label>
            <label className={styles['slider-label']}>
              <div>to:</div>
              <TextInput value={sliderValue[1].toLocaleString('en-US')}></TextInput>
            </label>
          </div>

          <div className={styles['filter-group']}>
            <Text variant="subheader-2">
              Area, m<sup>2</sup>
            </Text>
            <Slider
              size="s"
              defaultValue={[areaValue[0], areaValue[1]]}
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
              <Checkbox {...register('NebulaBuilders')}>Nebula Builders</Checkbox>
              <Checkbox {...register('StellarEstates')}>Stellar Estates</Checkbox>
              <Checkbox {...register('GalaxyConstruction')}>Galaxy Construction</Checkbox>
              <Checkbox {...register('AstralArchitects')}>Astral Architects</Checkbox>
            </div>
          </div>
          <div className={styles['filter-group']}>
            <Text variant="subheader-2">Floors</Text>
            <label className={styles.floors}>
              <Checkbox {...register('1')}>1</Checkbox>
              <Checkbox {...register('2')}>2</Checkbox>
              <Checkbox {...register('3')}>3</Checkbox>
            </label>
          </div>
          <div className={styles['filters-buttons']}>
            <Button size="l" view="action">
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
