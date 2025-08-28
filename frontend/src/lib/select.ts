import type { LoadOptions } from 'react-select-async-paginate'
import { axios } from './axios'

type OptionType =
  | { value: string; label: string }
  | {
      value?: string
      label?: string
      __isNew__?: boolean
    }

interface GroupBase<Option> {
  readonly options: readonly Option[]
  readonly label?: string
}

// --NOTE: Dynamic Options

const loadProductsOptions: LoadOptions<
  OptionType,
  GroupBase<OptionType>,
  { page?: number }
> = async (search, _, params) => {
  const page = params?.page ?? 1
  const warehouses = await axios.get<{
    data: {
      id: number
      picture: string
      stock: number
      price: number
      name: string
    }[]
  }>('/products', { params: { search, page } })
  const options = warehouses.data.data.map((d) => ({
    label: `${d.name}`,
    value: JSON.stringify(d),
    sublabel: 'hehehe',
  }))

  return {
    options,
    hasMore: false,
    additional: {
      ...params,
      page: Number(page) + 1,
    },
  }
}

export { loadProductsOptions }
