import { Button, Card, Checkbox, Slider, Text, TextInput } from '@gravity-ui/uikit';
import styles from './style.module.css';
import { useState } from 'react';

export function FiltersControls() {
  const [sliderValue, setSliderValue] = useState<number[]>([0, 1000000]);
  const [areaValue, setAreaValue] = useState<number[]>([0, 1000]);

  return (
    <>
      <Card className={styles['filters-wrapper']}>
        <form>
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
              <Checkbox>Nebula Builders</Checkbox>
              <Checkbox>Stellar Estates</Checkbox>
              <Checkbox>Galaxy Construction</Checkbox>
              <Checkbox>Astral Architects</Checkbox>
            </div>
          </div>
          <div className={styles['filter-group']}>
            <Text variant="subheader-2">Floors</Text>
            <div className={styles.floors}>
              <Checkbox>1</Checkbox>
              <Checkbox>2</Checkbox>
              <Checkbox>3</Checkbox>
            </div>
          </div>
          <div className={styles['filters-buttons']}>
            <Button size="l" view="action">
              Clear
            </Button>
            <Button size="l" view="action">
              Apply
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
}
