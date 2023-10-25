import './App.css';
import { useState } from 'react';

function App() {
  const ranges = [
    { value: 30, label: "30 Days"},
    { value: 60, label: "60 Days"},
    { value: 120, label: "120 Days"},
    { value: 360, label: "1 Year"},
    { value: 1080, label: "3 Years"}
  ]

  const numberOfSegments = ranges.length - 1;
  const segmentSize = 100 / numberOfSegments

  const marks = ranges.map((elem, index) => {
    return { value: index * segmentSize, label: elem.label }
  })
  const segments = []

  for(let i = 0; i < marks.length - 1; i++) {
    const segment = { min: marks[i].value, max: marks[i+1].value, realMin: ranges[i].value, realMax: ranges[i+1].value };
    segments.push(segment);
  }

  const [realValue, setRealValue] = useState(ranges[0].value)
  const [inputValue, setInputValue] = useState(0)

  const calculateRealValue = (inputValue) => {
    const { min, max, realMin, realMax } = segments.find( segm => segm.min <= inputValue && inputValue <= segm.max )
    const realValue = ((inputValue - min) / (max - min) * (realMax - realMin)) + realMin;
    return Math.floor(realValue);
  }

  const calculateInputValue = (realValue) => {
    const segment = segments.find( segm => segm.realMin <= realValue && realValue <= segm.realMax )
    if(!segment){
      return Number(realValue) < ranges[0].value ? 0 : 100
    }
    const { min, max, realMin, realMax } = segment;
    const inputValue = ((realValue - realMin) * (max - min) / (realMax - realMin)) + min;
    return Math.floor(inputValue);
  }

  const handleInput = (e) => {
    const inputValue = Number(e.target.value)
    const realValue = calculateRealValue(inputValue)
    setInputValue(inputValue)
    setRealValue(realValue)
  }

  const handleNumberInput = (e) => {
    const realValue = e.target.value
    const inputValue = calculateInputValue(realValue)
    setRealValue(realValue)
    setInputValue(inputValue)
  }

  return (
    <div className='w-full p-8 flex gap-4'>
      <div className='flex flex-col flex-1'>
        <input
          type='range'
          list='marks'
          name='time'
          step={0.5}
          min={marks[0].value}
          max={marks[marks.length - 1 ].value}
          value={inputValue}
          onInput={handleInput}
        />
        <datalist id="marks" className='flex justify-between'>
          {
            marks.map((elem, index) => {
              return <option key={index} value={elem.value} label={elem.label}></option>
            })
          }
        </datalist>
      </div>
      <input
        className='border-black border-[1px] indent-4 w-24'
        type='number'
        min={ranges[0].value}
        max={ranges[ranges.length - 1].value}
        value={realValue}
        onChange={handleNumberInput}
      />
    </div>
  );
}

export default App;
