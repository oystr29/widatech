type Invoice = {
  date: string
  invoice_no: string
  payment_type: string
  id: number
  customer_name: string
  sales_person_name: string
  notes?: string | null
}

type InvoiceProduct = {
  id: number
product_name: string
  product_picture: string
  qty: number
  product_price: number
  invoiceId: number
}

export { type Invoice, type InvoiceProduct }
