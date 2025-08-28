import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { DatePicker } from '~/components/ui/datepicker'
import { Input, InputCurrency } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Button } from '~/components/ui/button'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { Select, SelectAsync } from '~/components/select'
import { loadProductsOptions } from '~/lib/select'
import { useCreateInvoicesMutation } from '~/api/invoices'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { useNavigate } from '~/router'
import { formatNumber } from '~/lib/utils'

const formSchema = z.object({
  date: z.date(),
  customer_name: z.string().min(1, 'Please fill the customer name'),
  sales_person_name: z.string().min(1, 'Please fill the sales person name'),
  notes: z.string().optional(),
  payment_type: z
    .object({
      label: z.string(),
      value: z.string(),
    })
    .nullable(),
  products: z
    .object({
      id: z.string(),
      product_id: z.number(),
      name: z.object({
        label: z.string(),
        value: z.string(),
      }),
      picture: z.string(),
      price: z.coerce
        .number<number>({ error: 'Please fill the price' })
        .min(1, "Price can't be 0"),
      qty: z.coerce
        .number<number>({ error: 'Please fill the quantity' })
        .min(1, "Quantity can't be 0"),
    })
    .array()
    .min(1, 'Please fill at least 1 product'),
})

type FormSchema = z.infer<typeof formSchema>

const payments_type = ['Cash', 'Credit'].map((v) => ({ label: v, value: v }))

const date = new Date()

export default function Page() {
  const nav = useNavigate()
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    values: {
      date,
      customer_name: '',
      products: [],
      sales_person_name: '',
      notes: '',
      payment_type: null,
    },
  })

  const { append, remove, fields } = useFieldArray({
    control: form.control,
    name: 'products',
  })

  const [createInvoice, { isSuccess, data, error, isError, isLoading }] =
    useCreateInvoicesMutation()

  useEffect(() => {
    if (isSuccess && data) {
      toast.success(data.message)
      nav('/')
      return
    }
    if (isError) {
      console.error(error)
      toast.error('Error when create invoices')
    }
  }, [isSuccess, isError])

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((v) => {
            console.log(v)
            // createInvoice({ data: 'hehehehe' })
            createInvoice({
              data: {
                ...v,
                payment_type: v.payment_type?.value ?? '',
                date: format(v.date, 'yyyy-MM-dd'),
                products: v.products.map((vv) => ({
                  ...vv,
                  name: vv.name.label,
                })),
              },
            })
          })}
          className="space-y-4"
        >
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-lg font-medium">Add New Invoices</h1>
            <Button type="submit">
              {isLoading ? <Loader2 className="animate-spin" /> : <Plus />}
              <span>Create Invoice</span>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <DatePicker
                      classNameBtn="w-full"
                      selected={field.value}
                      onSelect={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="payment_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Time</FormLabel>
                  <FormControl>
                    <Select
                      isClearable
                      options={payments_type}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select payment type"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="customer_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Customer Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sales_person_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sales Person Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Sales Person Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Note" />
                </FormControl>
              </FormItem>
            )}
          />
          <div>
            <div className="mb-1 flex items-center gap-x-2">
              <p>Products</p>
              <Button
                onClick={() => {
                  const id = crypto.randomUUID()
                  append({
                    id,
                    // @ts-expect-error its okay
                    name: null,
                    picture:
                      'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?v=1530129081',
                    price: 0,
                    stock: 1,
                    product_id: 0,
                  })
                }}
                type="button"
                className="h-6 w-6"
                size={'icon'}
              >
                <Plus />
              </Button>
              {fields.length > 0 && (
                <div className="text-muted-foreground text-sm">
                  ({fields.length})
                </div>
              )}
            </div>
            {form.formState.errors.products && (
              <div className="text-destructive text-xs">
                {form.formState.errors.products.message}
              </div>
            )}
          </div>
          <div className="mt-4">
            {fields.map((d, i) => (
              <div key={d.id} className="mb-4 rounded-lg border p-2 shadow-md">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name={`products.${i}.picture`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Picture</FormLabel>
                        <div className="flex items-center gap-2">
                          <img
                            src={field.value}
                            className="h-10 w-10 rounded-lg border object-cover"
                          />
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Insert Picture Link"
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`products.${i}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <SelectAsync
                            isClearable
                            placeholder="Choose Product"
                            loadOptions={loadProductsOptions}
                            formatOptionLabel={(v) => {
                              const { picture, stock, price } = JSON.parse(
                                `${v.value}`
                              ) as {
                                id: number
                                stock: number
                                price: number
                                picture: string
                              }

                              return (
                                <div className="flex items-center gap-2">
                                  <img
                                    src={picture}
                                    className="h-8 w-8 rounded-md"
                                  />
                                  <div className="">
                                    <p>{v.label}</p>
                                    <p className="text-muted-foreground text-xs">
                                      {formatNumber(price, true)} | Stock{' '}
                                      {formatNumber(stock)} pcs
                                    </p>
                                  </div>
                                </div>
                              )
                            }}
                            value={field.value}
                            onChange={(v) => {
                              field.onChange(v)
                              if (v) {
                                const { id, picture, stock, price } =
                                  JSON.parse(`${v.value}`) as {
                                    id: number
                                    stock: number
                                    price: number
                                    picture: string
                                  }
                                form.setValue(`products.${i}.product_id`, id)
                                form.setValue(`products.${i}.price`, price)
                                form.setValue(`products.${i}.picture`, picture)
                                form.setValue(`products.${i}.qty`, stock)
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-wrap items-end gap-4">
                  <div className="mt-2 grid flex-1 items-end gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name={`products.${i}.price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <InputCurrency
                              ref={field.ref}
                              value={field.value}
                              onValueChange={(v) => {
                                console.log(v)
                                field.onChange(v ?? 0)
                              }}
                              placeholder="Fill Price"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`products.${i}.qty`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <InputCurrency
                              ref={field.ref}
                              prefix=""
                              defaultValue={field.value}
                              onValueChange={(v) => {
                                console.log(v)
                                field.onChange(v ?? 0)
                              }}
                              placeholder="Please fill quantity "
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <Button
                      type="button"
                      className="h-10"
                      variant={'destructive'}
                      onClick={() => {
                        remove(i)
                      }}
                    >
                      <Trash2 />
                    </Button>
                    <div className="h-6" />
                  </div>{' '}
                </div>
              </div>
            ))}
          </div>
        </form>
      </Form>
    </>
  )
}
