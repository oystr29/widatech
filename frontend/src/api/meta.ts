type Meta = {
  current_page: number
  from: number
  last_page: number
  per_page: number
  to: number
  total: number
  links: {
    label: number
    active: boolean
  }[]
}

export type { Meta }
