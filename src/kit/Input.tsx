type TInput = {
  placeholder?: string
  onChange: (value: string) => void
}

function Input({ placeholder, onChange }: TInput) {
  return (
    <input
      type="text"
      className="w-full h-[44px] px-3 py-2.5 rounded-[12px] border border-oslo/[0.16] text-[17px] leading-[22px] text-oslo appearance-none transition-all outline-none focus:outline-none focus:border-accent focus:shadow-[inset_0_0_0px_1px] focus:shadow-accent selection:bg-accent selection:text-buttonText placeholder:text-oslo/[0.64]"
      placeholder={placeholder}
      onChange={(e) => { onChange(e.target.value) }}
    />
  )
}

export default Input
