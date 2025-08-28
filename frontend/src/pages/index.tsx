import { createColumnHelper } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Plus } from 'lucide-react'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router'
import { useListInvoicesQuery } from '~/api/invoices'
import type { Invoice } from '~/api/invoices/schema'
import type { Meta } from '~/api/meta'
import { Select } from '~/components/select'
import { Button } from '~/components/ui/button'
import { DataTable } from '~/components/ui/data-table'
import { Label } from '~/components/ui/label'
import { Loading } from '~/components/ui/loading'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '~/components/ui/pagination'
import { Skeleton } from '~/components/ui/skeleton'
import { Link } from '~/router'

const colHelper = createColumnHelper<Invoice>()

const columns = [
  colHelper.display({
    header: 'No',
    cell: ({ row }) => row.index + 1,
  }),
  colHelper.accessor('invoice_no', {
    header: 'Invoice Number',
    cell: ({ getValue, row }) => (
      <Link
        className="hover:underline"
        params={{ id: `${row.original.id}` }}
        to={`/invoices/detail/:id`}
      >
        {getValue()}
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
  colHelper.accessor('payment_type', {
    header: 'Payment Type',
    cell: ({ getValue }) => <div className="uppercase">{getValue()}</div>,
  }),
  colHelper.accessor('notes', {
    header: 'Notes',
  }),
]

export default function Page() {
  const [searchParams] = useSearchParams()
  const params = Object.fromEntries(searchParams.entries())
  const { data, isLoading } = useListInvoicesQuery(params)

  useEffect(() => {
    console.log(searchParams)
  }, [searchParams])

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
      <div className="mt-4 flex items-center justify-end gap-4">
        <Paginate meta={data?.meta} />
        <PaginationParams meta={data?.meta} />
      </div>
    </>
  )
}

const paginates = [5, 10, 20, 50, 500].map((v) => ({
  label: `${v}`,
  value: `${v}`,
}))
const defaultPaginate = 10
const Paginate = ({ meta }: { meta?: Meta }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  return (
    <div className="flex items-center gap-4">
      <Label className="whitespace-nowrap">Per Page:</Label>
      <Select
        defaultValue={{
          value: `${meta?.per_page ?? defaultPaginate}`,
          label: `${meta?.per_page ?? defaultPaginate}`,
        }}
        options={paginates}
        onChange={(v) => {
          if (searchParams.get('page')) {
            setSearchParams({ paginate: v?.value ?? `${defaultPaginate}` })
            return
          }
          setSearchParams((o) => ({
            ...o,
            paginate: v?.value ?? `${defaultPaginate}`,
          }))
        }}
      />
    </div>
  )
}

const PaginationParams = ({ meta }: { meta?: Meta }) => {
  const [searchParams, setSeachParams] = useSearchParams()
  if (!meta)
    return (
      <Loading keyname="loadpage" length={3}>
        <Skeleton className="mr-0.5 h-8 w-8" />
      </Loading>
    )
  return (
    <>
      <Pagination className="mx-0 w-auto justify-start">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className="cursor-pointer"
              isActive={meta.current_page > 1}
              onClick={() => {
                const page = !Number.isNaN(searchParams.get('page'))
                  ? Number(searchParams.get('page'))
                  : 1
                if (page <= 1) return
                setSeachParams((o) => ({ ...o, page: `${page - 1}` }))
                // router.push(`${pathname}?${params.toString()}`)
              }}
            />
          </PaginationItem>
          {meta.links.map((link, i) => {
            return (
              <PaginationItem key={`pageitem-${i}`}>
                <PaginationLink
                  className="hidden cursor-pointer sm:flex"
                  isActive={link.active}
                  onClick={() => {
                    if (link.active) return
                    setSeachParams((o) => ({ ...o, page: `${link.label}` }))
                  }}
                >
                  {link.label}
                </PaginationLink>
              </PaginationItem>
            )
          })}
          <PaginationItem>
            <PaginationNext
              className="cursor-pointer"
              isActive={meta.current_page !== meta.last_page}
              onClick={() => {
                const page = Number.isInteger(searchParams.get('page'))
                  ? Number(searchParams.get('page'))
                  : 1
                if (page === meta.last_page) return
                setSeachParams((o) => ({ ...o, page: `${page + 1}` }))
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  )
}
