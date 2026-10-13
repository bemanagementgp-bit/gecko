export default function QtyStepper({ value, onChange, label = 'Cantidad', size = 'md' }) {
  const s = size === 'sm' ? 'h-9 w-9 text-[18px]' : 'h-12 w-12 text-[22px]'
  return (
    <div className="inline-flex items-center rounded-full border-[1.5px] border-current" role="group" aria-label={label}>
      <button type="button" aria-label="Restar uno" disabled={value <= 1} onClick={() => onChange(value - 1)} className={`${s} font-black disabled:opacity-30`}>−</button>
      <span className="min-w-7 text-center text-[19px] font-black tabular-nums" aria-live="polite">{value}</span>
      <button type="button" aria-label="Sumar uno" disabled={value >= 99} onClick={() => onChange(value + 1)} className={`${s} font-black disabled:opacity-30`}>+</button>
    </div>
  )
}
