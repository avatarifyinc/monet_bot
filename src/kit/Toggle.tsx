import cx from 'classnames'
import { useMemo } from 'react'

const Toggle = ({ checked, onChange }: {
  checked: boolean,
  onChange: (val: boolean) => void
}) => {
  const name = useMemo(() => `Toggle-${Math.round(Math.random()*1e10)}`, [])
  return (
    <label
      htmlFor={name}
      className={cx(
        'Toggle relative w-[56px] h-[32px] rounded-full hover:brightness-[1.2] active:brightness-[1.3] transition-all cursor-pointer select-none group/Toggle',
        checked ? 'bg-accent' : 'bg-[#1C1C1D52]'
      )}
      // onClick={() => { onChange(!checked) }}
    >
      <input
        className=""
        type="checkbox"
        hidden
        name={name}
        id={name}
        checked={checked}
        onChange={() => { onChange(!checked) }}
      />
      <div className={cx(
          'absolute w-[28px] h-[28px] top-1/2 -translate-y-1/2 translate-x-[2px] rounded-full bg-white transition-all group-active/Toggle:scale-[0.9]',
          checked ? 'translate-x-[26px]' : 'translate-x-[2px]',
        )}
      />
    </label>
  )
}

export default Toggle
