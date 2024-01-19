import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';

const Range = ({ min, max, value, onInput }: {
  min: number,
  max: number,
  value: number,
  onInput: (val: number) => void
}) => (
  <div className="h-[22px]">
    <RangeSlider
      className="mt-[10px]"
      min={min}
      max={max}
      value={[0, value]}
      thumbsDisabled={[true, false]}
      rangeSlideDisabled={true}
      onInput={(val: number[]) => { onInput(val[1]) }}
    />
  </div>
)

export default Range
