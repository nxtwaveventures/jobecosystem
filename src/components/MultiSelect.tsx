'use client'

import { useState, useEffect, useRef } from 'react'
import { Badge } from './ui'

interface MultiSelectProps {
  label: string
  options: string[]
  value: string[]
  onChange: (value: string[]) => void
  error?: string
}

export function MultiSelect({ label, options, value, onChange, error }: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filteredOptions = options.filter(
    option => option.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleOption = (option: string) => {
    const newValue = value.includes(option)
      ? value.filter(v => v !== option)
      : [...value, option]
    onChange(newValue)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      
      <div className="min-h-[42px] p-1 border rounded-md bg-white">
        <div className="flex flex-wrap gap-1">
          {value.map(item => (
            <Badge
              key={item}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {item}
              <button
                type="button"
                onClick={() => toggleOption(item)}
                className="ml-1 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </Badge>
          ))}
          
          <input
            type="text"
            className="flex-1 outline-none min-w-[120px] text-sm"
            placeholder={value.length === 0 ? 'Select items...' : ''}
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setIsOpen(true)}
          />
        </div>
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border max-h-60 overflow-auto">
          {filteredOptions.length === 0 ? (
            <div className="p-2 text-sm text-gray-500">
              No options found
            </div>
          ) : (
            filteredOptions.map(option => (
              <button
                key={option}
                type="button"
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100
                  ${value.includes(option) ? 'bg-gray-50' : ''}`}
                onClick={() => toggleOption(option)}
              >
                {option}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}