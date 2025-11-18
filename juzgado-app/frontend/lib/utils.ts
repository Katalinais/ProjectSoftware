import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function handleNameChange(value: string): string {
  return value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]/g, '')
}

export function handleProcessNumberChange(value: string): string {
  const numbersOnly = value.replace(/\D/g, '')
  const limited = numbersOnly.slice(0, 9)
  if (limited.length <= 4) {
    return limited
  } else {
    return limited.slice(0, 4) + '-' + limited.slice(4)
  }
}
