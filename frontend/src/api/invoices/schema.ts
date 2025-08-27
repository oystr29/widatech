type Invoice = {
  date: string
  id: number
  customer_name: string
  sales_person_name: string
  notes?: string | null
}

type InvoiceProduct = {
  id: number
  name: string
  picture: string
  qty: number
  price: number
  invoiceId: number
}

export { type Invoice, type InvoiceProduct }
