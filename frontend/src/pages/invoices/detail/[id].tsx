import { createColumnHelper } from '@tanstack/react-table'
import { format } from 'date-fns'
import { AtSign, CreditCard, NotepadText, UserPen } from 'lucide-react'
import { useDetailInvoicesQuery } from '~/api/invoices'
import type { InvoiceProduct } from '~/api/invoices/schema'
import { DataTable } from '~/components/ui/data-table'
import { Skeleton } from '~/components/ui/skeleton'
import { useParams } from '~/router'

const colHelper = createColumnHelper<
  InvoiceProduct & { product: { cogs: number } }
>()

function formatNumber(v?: number, isCurrency: boolean = false) {
  return new Intl.NumberFormat('id-ID', {
    currency: isCurrency ? 'IDR' : undefined,
    style: isCurrency ? 'currency' : undefined,
    maximumFractionDigits: 0,
  }).format(v ?? 0)
}

const columns = [
  colHelper.display({
    header: 'No',
    cell: ({ row }) => row.index + 1,
  }),
  colHelper.accessor('product_picture', {
    header: 'Picture',
    cell: ({ getValue }) => (
      <img src={getValue() ?? ''} className="h-20 w-20" />
    ),
  }),
  colHelper.accessor('product_name', {
    header: 'Product Name',
  }),
  colHelper.accessor('product_price', {
    header: 'Price',
    cell: ({ getValue }) => formatNumber(getValue(), true),
  }),
  colHelper.accessor('qty', {
    header: 'Quantity',
    cell: ({ getValue }) => formatNumber(getValue()),
  }),
  colHelper.accessor('product.cogs', {
    header: 'COGS',
    cell: ({ getValue }) => formatNumber(getValue(), true),
  }),
  colHelper.display({
    header: 'Total',
    cell: ({ row: { original: product } }) =>
      formatNumber(product.qty * product.product_price, true),
  }),
]

export default function Page() {
  const { id } = useParams('/invoices/detail/:id')
  const { data: invoice, isLoading } = useDetailInvoicesQuery({ id })
  return (
    <>
      <div className="m-2 rounded-lg border p-4">
        <h1 className="mb-5 text-xl font-semibold">Widatech</h1>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4 border-y px-2 py-4">
          <p className="text-lg font-medium">Invoice#1234</p>
          {invoice?.data.date ? (
            <p className="text-muted-foreground text-lg font-medium">
              Date: {format(invoice?.data.date, 'dd/MM/yy')}
            </p>
          ) : (
            <Skeleton className="h-4 w-20" />
          )}
        </div>
        <div className="mb-4 flex flex-col gap-4 border-b pb-4">
          <div className="flex items-center gap-2">
            <UserPen size={16} className="" />
            <p className="text-sm">
              Created by:{' '}
              <span className="text-muted-foreground">
                {invoice?.data.sales_person_name}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <AtSign size={16} className="" />
            <p className="text-sm">
              Invoice to:{' '}
              <span className="text-muted-foreground">
                {invoice?.data.customer_name}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard size={16} className="" />
            <p className="text-sm">
              Payment type:{' '}
              <span className="text-muted-foreground">
                {invoice?.data.payment_type}
              </span>{' '}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <NotepadText size={16} className="" />
            <p className="text-sm">Notes:</p>
            <p className="text-muted-foreground text-sm italic">
              "{invoice?.data.notes}"
            </p>
          </div>
        </div>
        <DataTable
          columns={columns}
          data={invoice?.data.invoicesToProducts}
          isloading={isLoading}
        />
        <div className="mt-5 flex w-full justify-end gap-8">
          <div className="space-y-4">
            <div className="text-muted-foreground">Order Summary</div>
            <div className="flex items-center gap-20">
              <p className="text-xl font-semibold">Order Total</p>
              <p className="text-xl font-semibold">
                {formatNumber(invoice?.data.summary.total, true)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
