'use client'

import { useState } from 'react'

interface AutocompleteInputProps {
  id: string
  label: string
  value: string
  suggestions: string[]
  placeholder?: string
  onChange: (value: string) => void
}

export default function AutocompleteInput({
  id,
  label,
  value,
  suggestions,
  placeholder,
  onChange,
}: AutocompleteInputProps) {
  const [filtered, setFiltered] = useState<string[]>([])
  const [open, setOpen] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    onChange(val)
    if (val) {
      const match = suggestions
        .filter((s) => s.toLowerCase().includes(val.toLowerCase()))
        .slice(0, 5)
      setFiltered(match)
      setOpen(match.length > 0)
    } else {
      setFiltered([])
      setOpen(false)
    }
  }

  const handleSelect = (s: string) => {
    onChange(s)
    setOpen(false)
  }

  return (
    <div className="relative">
      <label htmlFor={id} className="block text-2xl">
        {label}
      </label>
      <input
        id={id}
        type="text"
        className="border p-2 w-full"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        autoComplete="off"
      />
      {open && (
        <ul className="absolute z-10 bg-white border w-full mt-1 max-h-40 overflow-y-auto">
          {filtered.map((s) => (
            <li
              key={s}
              className="p-2 cursor-pointer hover:bg-gray-200"
              onMouseDown={(e) => {
                e.preventDefault()
                handleSelect(s)
              }}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
