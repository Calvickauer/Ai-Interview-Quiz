'use client'

import { useState, useRef } from 'react'
import { typesense } from '../lib/typesense'

interface AutocompleteInputProps {
  id: string
  label: string
  value: string
  collection: string
  field?: string
  placeholder?: string
  onChange: (value: string) => void
}

export default function AutocompleteInput({
  id,
  label,
  value,
  collection,
  field = 'name',
  placeholder,
  onChange,
}: AutocompleteInputProps) {
  const [filtered, setFiltered] = useState<string[]>([])
  const [open, setOpen] = useState(false)

  const debounce = useRef<NodeJS.Timeout>()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    onChange(val)
    clearTimeout(debounce.current)
    if (val) {
      debounce.current = setTimeout(async () => {
        try {
          const res = await typesense
            .collections(collection)
            .documents()
            .search({
              q: val,
              query_by: field,
              prefix: true,
              num_typos: 1,
              per_page: 5,
            })
          const opts = (res.hits || []).map((h: any) => h.document[field])
          setFiltered(opts)
          setOpen(opts.length > 0)
        } catch (err) {
          console.error('Typesense search failed', err)
        }
      }, 300)
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
