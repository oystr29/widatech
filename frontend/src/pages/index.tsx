import { createColumnHelper } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Plus } from 'lucide-react'
import { useListInvoicesQuery } from '~/api/invoices'
import type { Invoice } from '~/api/invoices/schema'
import { Button } from '~/components/ui/button'
import { DataTable } from '~/components/ui/data-table'
import { Link } from '~/router'

const colHelper = createColumnHelper<Invoice>()

const columns = [
  colHelper.display({
    header: 'No',
    cell: ({ row }) => row.index + 1,
  }),
  colHelper.display({
    header: 'No. Invoice',
    cell: () => (
      <Link
        className="hover:underline"
        params={{ id: '1' }}
        to={`/invoices/detail/:id`}
      >
        Invoice#1234
      </Link>
    ),
  }),
  colHelper.accessor('date', {
    header: 'Tanggal',
    cell: ({ getValue }) => format(getValue(), 'dd MMM yy'),
  }),
  colHelper.accessor('customer_name', {
    header: 'Customer',
  }),
  colHelper.accessor('sales_person_name', {
    header: 'Sales',
  }),
  colHelper.accessor('notes', {
    header: 'Notes',
  }),
]

export default function Page() {
  const { data, isLoading } = useListInvoicesQuery(undefined)
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Invoices</h1>
        <Button asChild>
          <Link to={'/invoices/create'}>
            <Plus />
            <span>Add Invoices</span>
          </Link>
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isloading={isLoading}
      />
    </>
  )
}
