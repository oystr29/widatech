import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '~/lib/axios'
import type { Invoice, InvoiceProduct } from './schema'

type InvoiceForm = Omit<Invoice, 'id' | 'invoice_no'> & {
  payment_type?: string | null
  products: {
    name: string
    picture: string
    price: number
    qty: number
  }[]
}

const invoicesApi = createApi({
  reducerPath: 'invoicesApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Invoices'],
  endpoints(build) {
    return {
      listInvoices: build.query<{ data: Invoice[] }, undefined>({
        query: () => {
          return {
            url: '/invoices',
            method: 'get',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        },
        providesTags: (result) =>
          // is result available?
          result
            ? // successful query
              [
                ...result.data.map(
                  ({ id }) => ({ type: 'Invoices', id }) as const
                ),
                { type: 'Invoices', id: 'LIST' },
              ]
            : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
              [{ type: 'Invoices', id: 'LIST' }],
      }),
      detailInvoices: build.query<
        {
          data: Invoice & {
            invoicesToProducts: (InvoiceProduct & {
              product: { cogs: number }
            })[]
            summary: { total: number }
          }
        },
        { id: string }
      >({
        query: ({ id }) => {
          return {
            url: `/invoices/${id}`,
            method: 'get',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        },
      }),
      detailInvoicesProducts: build.query<
        { data: InvoiceProduct[] },
        { id: string }
      >({
        query: ({ id }) => {
          return {
            url: `/invoices/${id}/products`,
            method: 'get',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        },
      }),
      createInvoices: build.mutation<
        { message: string },
        { data: InvoiceForm }
      >({
        query: (arg) => {
          console.log(`aku arg`)
          console.log(arg)
          return {
            url: `/invoices`,
            method: 'post',
            data: arg.data,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        },
        invalidatesTags: [{ type: 'Invoices', id: 'LIST' }],
      }),
    }
  },
})

const {
  useCreateInvoicesMutation,
  useListInvoicesQuery,
  useDetailInvoicesQuery,
  useDetailInvoicesProductsQuery,
} = invoicesApi

export {
  invoicesApi,
  useCreateInvoicesMutation,
  useListInvoicesQuery,
  useDetailInvoicesQuery,
  useDetailInvoicesProductsQuery,
}
