type TInput = {
  placeholder?: string
  onChange: (value: string) => void
}

function Input({ placeholder, onChange }: TInput) {
  return (
    <input
      type="text"
      className="w-full ?max-w-[500px] h-[44px] px-3 py-2.5 rounded-[12px] border border-oslo/[0.16] text-[17px] leading-[22px] text-oslo appearance-none transition-all focus:outline-none focus:border-accent focus:shadow-accent focus:shadow-[0_0_1px_1px_accent] selection:bg-accent selection:text-buttonText placeholder:text-oslo/[0.64]"
      placeholder={placeholder}
      onChange={(e) => { onChange(e.target.value) }}
    />
  )
}

export default Input
