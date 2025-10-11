import { useState } from 'react'
import type { ChangeEvent } from 'react'

interface FieldProps {
  type: string
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

interface UseFieldReturn extends FieldProps {
  reset: () => void
}

const useField = (type: string): UseFieldReturn => {
  const [value, setValue] = useState('')

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  return {
    type,
    value,
    onChange,
    reset,
  }
}

export { useField }
export type { FieldProps }
