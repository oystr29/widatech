'use client'

import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import type { OnSelectHandler } from 'react-day-picker'
import { cn } from '~/lib/utils'

export function DatePicker({
  selected,
  onSelect,
  classNameBtn,
}: {
  selected?: Date
  onSelect: OnSelectHandler<Date>
  classNameBtn?: string
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!selected}
          className={cn(
            'data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal',
            classNameBtn
          )}
        >
          <CalendarIcon />
          {selected ? format(selected, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-full p-0">
        <Calendar
          required
          mode="single"
          selected={selected}
          onSelect={onSelect}
        />
      </PopoverContent>
    </Popover>
  )
}
