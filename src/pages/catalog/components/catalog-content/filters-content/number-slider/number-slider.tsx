import { Slider, TextInput } from '@gravity-ui/uikit';
import { useProducts } from '../../../../../../components/hooks/useProducts';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import styles from './style.module.css';

export function NumberSlider({ type }: { type: 'area' | 'price' }) {
  const { control, setValue } = useFormContext();
  const { criteriaData } = useProducts();
  const value = type === 'area' ? criteriaData.filters.area : criteriaData.filters.price;

  const [_, setInputValue] = useState<[string, string]>([
    value[0].toLocaleString('en-US'),
    value[1].toLocaleString('en-US'),
  ]);
  const max = type === 'area' ? 1000 : 1000000;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, inputNumber: number) => {
    let enteredValue = parseInt(event.target.value.replace(/,/g, ''));
    enteredValue = Number.isNaN(enteredValue) ? 0 : enteredValue;
    enteredValue = enteredValue > max ? max : enteredValue;
    const from = inputNumber === 0 ? enteredValue : value[0];
    const to = inputNumber === 1 ? enteredValue : value[1];
    const newValue: [number, number] = from < to ? [from, to] : [to, from];
    setValue(type, newValue);
    setInputValue([newValue[0].toLocaleString('en-US'), newValue[1].toLocaleString('en-US')]);
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
                setInputValue([value[0].toLocaleString('en-US'), value[1].toLocaleString('en-US')]);
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
              ></TextInput>
            </label>
            <label className={styles['slider-label']}>
              <div>to:</div>
              <TextInput
                value={field.value[1].toLocaleString('en-US')}
                onChange={(event) => {
                  handleInputChange(event, 1);
                }}
              ></TextInput>
            </label>
          </>
        )}
      ></Controller>
    </>
  );
}
