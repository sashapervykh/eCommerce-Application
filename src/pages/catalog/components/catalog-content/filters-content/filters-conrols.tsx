import { Card, Slider, Text, TextInput } from '@gravity-ui/uikit';
import styles from './style.module.css';
import { useState } from 'react';

export function FiltersControls() {
  const [sliderValue, setSliderValue] = useState<number[]>([0, 1000000]);

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
        </form>
      </Card>
    </>
  );
}
