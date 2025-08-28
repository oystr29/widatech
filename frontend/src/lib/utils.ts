import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(v?: number, isCurrency: boolean = false) {
  return new Intl.NumberFormat('id-ID', {
    currency: isCurrency ? 'IDR' : undefined,
    style: isCurrency ? 'currency' : undefined,
    maximumFractionDigits: 0,
  }).format(v ?? 0)
}
