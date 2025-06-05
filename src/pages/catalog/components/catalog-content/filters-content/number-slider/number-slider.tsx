import { Slider, TextInput } from '@gravity-ui/uikit';
import { useProducts } from '../../../../../../components/hooks/useProducts';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import styles from './style.module.css';

export function NumberSlider({ type }: { type: 'area' | 'price' }) {
  const { control, setValue } = useFormContext();
  const { criteriaData } = useProducts();
  const [numberValue, setNumberValue] = useState<[number, number]>(
    type === 'area' ? criteriaData.filters.area : criteriaData.filters.price,
  );

  const max = type === 'area' ? 1000 : 1000000;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, inputNumber: number) => {
    let enteredValue = parseInt(event.target.value.replace(/,/g, ''));
    enteredValue = Number.isNaN(enteredValue) ? 0 : enteredValue;
    enteredValue = enteredValue > max ? max : enteredValue;
    const newValue: [number, number] = [...numberValue];
    newValue[inputNumber] = enteredValue;
    setValue(type, newValue);
    setNumberValue(newValue);
  };

  const handleInputBlur = () => {
    const from = numberValue[0];
    const to = numberValue[1];
    const newValue: [number, number] = from < to ? [from, to] : [to, from];
    setValue(type, newValue);
    setNumberValue(newValue);
  };

  return (
    <>
      <Controller
        control={control}
        name={type}
        render={({ field }: { field: { value: [number, number] } }) => (
          <>
            <Slider
              {...field}
              size="s"
              defaultValue={field.value}
              value={field.value}
              min={0}
              max={max}
              step={type === 'area' ? 100 : 100000}
              onUpdate={(value: [number, number]) => {
                setValue(type, value);
              }}
            />
            <label className={styles['slider-label']}>
              {' '}
              <div className={styles['label-text']}>from:</div>
              <TextInput
                value={field.value[0].toLocaleString('en-US')}
                onChange={(event) => {
                  handleInputChange(event, 0);
                }}
                onBlur={() => {
                  handleInputBlur();
                }}
              ></TextInput>
            </label>
            <label className={styles['slider-label']}>
              <div>to:</div>
              <TextInput
                value={field.value[1].toLocaleString('en-US')}
                onChange={(event) => {
                  handleInputChange(event, 1);
                }}
                onBlur={() => {
                  handleInputBlur();
                }}
              ></TextInput>
            </label>
          </>
        )}
      ></Controller>
    </>
  );
}
