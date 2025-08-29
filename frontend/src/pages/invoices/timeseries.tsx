import type { ApexOptions } from 'apexcharts'
import { CircleCheck, Loader2 } from 'lucide-react'
import { useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { useTimeseriesInvoicesQuery } from '~/api/invoices'
import { cn, formatNumber } from '~/lib/utils'
import * as RadioGroup from '@radix-ui/react-radio-group'
import { useSearchParams } from 'react-router'

const optionsRadio = [
  {
    value: 'daily',
    label: 'Daily',
  },
  {
    value: 'weekly',
    label: 'Weekly',
  },
  {
    value: 'monthly',
    label: 'Monthly',
  },
]

export default function Page() {
  const [searchParams, setSearchParams] = useSearchParams()
  const params = Object.fromEntries(searchParams.entries())
  const { data, isLoading, isFetching } = useTimeseriesInvoicesQuery(params)

  const [options] = useState<ApexOptions>({
    chart: {
      id: 'timeseries-demo',
      type: 'area',
      height: 380,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
      animations: { enabled: true },
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.45,
        opacityTo: 0.05,
      },
    },
    grid: { borderColor: '#e5e7eb' },
    xaxis: {
      type: 'datetime',
      labels: { datetimeUTC: true },
      tooltip: { enabled: false },
    },
    yaxis: {
      decimalsInFloat: 2,
      labels: {
        formatter: (val) => formatNumber(val, true),
      },
    },
    tooltip: {
      x: { format: 'dd MMM yyyy' },
      shared: true,
      intersect: false,
    },
    markers: { size: 0 },
    theme: { mode: 'light' },
  })

  return (
    <>
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold">Invoices Timeseries</h1>
        {(isLoading || isFetching) && (
          <Loader2 size={16} className="animate-spin" />
        )}
      </div>
      <div>
        <RadioGroup.Root
          defaultValue={optionsRadio[0].value}
          className="flex w-full max-w-md items-center gap-4"
          onValueChange={(type) => {
            if (type === 'daily') {
              setSearchParams({})
              return
            }

            setSearchParams({ type })
          }}
        >
          {optionsRadio.map((option) => (
            <RadioGroup.Item
              key={option.value}
              value={option.value}
              className={cn(
                'group ring-border relative rounded px-3 py-2 text-start ring-[1px] hover:bg-gray-50',
                'data-[state=checked]:ring-2 data-[state=checked]:ring-blue-500'
              )}
            >
              <span className="text-sm font-semibold tracking-tight">
                {option.label}
              </span>
              <CircleCheck className="text-primary absolute top-0 right-0 h-6 w-6 translate-x-1/2 -translate-y-1/2 fill-blue-500 stroke-white group-data-[state=unchecked]:hidden" />
            </RadioGroup.Item>
          ))}
        </RadioGroup.Root>
      </div>
      <ReactApexChart
        options={options}
        series={[{ name: 'Invoices', data: data?.data ?? [] }]}
        type="area"
        height={350}
      />
    </>
  )
}
