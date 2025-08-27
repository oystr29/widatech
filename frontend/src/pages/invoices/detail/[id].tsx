import { createColumnHelper } from '@tanstack/react-table'
import { format } from 'date-fns'
import {
  useDetailInvoicesProductsQuery,
  useDetailInvoicesQuery,
} from '~/api/invoices'
import type { InvoiceProduct } from '~/api/invoices/schema'
import { DataTable } from '~/components/ui/data-table'
import { Skeleton } from '~/components/ui/skeleton'
import { useParams } from '~/router'

const colHelper = createColumnHelper<InvoiceProduct>()

const columns = [
  colHelper.display({
    header: 'No',
    cell: ({ row }) => row.index + 1,
  }),
  colHelper.accessor('picture', {
    header: 'Picture',
    cell: ({ getValue }) => <img src={getValue()} className="h-20 w-20" />,
  }),
  colHelper.accessor('name', {
    header: 'Product Name',
  }),
]

export default function Page() {
  const { id } = useParams('/invoices/detail/:id')
  const { data: invoice } = useDetailInvoicesQuery({ id })
  const { data: products, isLoading } = useDetailInvoicesProductsQuery({ id })
  return (
    <>
      <div className="m-2 rounded-lg border p-4">
        <h1 className="mb-5 text-xl font-semibold">Widatech</h1>
        <div className="mb-4 flex items-center justify-between border-y px-2 py-4">
          <p className="text-lg font-medium">Invoice#1234</p>
          {invoice?.data.date ? (
            <p className="text-muted-foreground text-lg font-medium">
              Date: {format(invoice?.data.date, 'dd/MM/yy')}
            </p>
          ) : (
            <Skeleton className="h-4 w-20" />
          )}
        </div>
        <DataTable
          columns={columns}
          data={products?.data}
          isloading={isLoading}
        />
      </div>
    </>
  )
}
