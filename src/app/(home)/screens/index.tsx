'use client'

import jsPDF from 'jspdf'
import moment from 'moment'
import html2canvas from 'html2canvas-pro'
import { Input } from '@/components/Input'
import { Select } from '@/components/Select'
import { ChangeEvent, HTMLAttributes, ReactNode, useState } from 'react'

const initialState = {
  date: '',
  bankName: '',
  issuedBy: '',
  currency: '₦',
  accountName: '',
  description: '',
  phoneNumber: '',
  customerName: '',
  receiptNumber: '',
  accountNumber: '',
  customerEmail: '',
}

interface Item {
  name: string
  price: number
  quantity: number
}

export const ReceiptGenerator = () => {
  const [total, setTotal] = useState(0)
  const [data, setData] = useState(initialState)
  const [items, setItems] = useState([{ name: '', quantity: 1, price: 0 }])

  const {
    date,
    bankName,
    currency,
    issuedBy,
    accountName,
    description,
    phoneNumber,
    customerName,
    accountNumber,
    customerEmail,
    receiptNumber,
  } = data

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target as HTMLInputElement

    setData({ ...data, [name]: value })
  }

  const handleItemChange = (
    index: number,
    field: keyof Item,
    value: string | number,
  ) => {
    const newItems = [...items]

    newItems[index][field] = value as never

    setItems(newItems)
    calculateTotal(newItems)
  }

  const addItem = () => {
    setItems([...items, { name: '', quantity: 1, price: 0 }])
  }

  const deleteItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
    calculateTotal(newItems)
  }

  const calculateTotal = (items: Item[]) => {
    const total = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0,
    )
    setTotal(total)
  }

  const generatePDF = () => {
    const input = document.getElementById('receipt')

    // @ts-expect-error: possibly null
    input.style.display = 'block'

    // @ts-expect-error: possibly null
    html2canvas(input, {
      scale: 2, // Increase scale for better quality
      logging: true, // Enable logging for debugging
      useCORS: true, // Enable CORS for external resources (if any)
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF('p', 'mm', [75, 200])
        const imgProps = pdf.getImageProperties(imgData)
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

        // Add the image to the PDF
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
        pdf.save('receipt.pdf')

        // @ts-expect-error: possibly null
        input.style.display = 'none'
      })
      .catch((error) => {
        console.error('Error generating PDF:', error)
      })
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl space-y-12 mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8 space-y-6">
          Receipt Generator
        </h1>

        <form className="space-y-6">
          <FlexBox>
            <Input
              required
              name="customerName"
              value={customerName}
              label="Customer Name"
              onChange={handleChange}
            />

            <Input
              name="customerEmail"
              value={customerEmail}
              onChange={handleChange}
              label="Customer Email (Optional)"
            />
          </FlexBox>

          <FlexBox>
            <Input
              required
              name="bankName"
              value={bankName}
              label="Bank Name"
              onChange={handleChange}
            />

            <Input
              required
              name="accountNumber"
              value={accountNumber}
              label="Account Number"
              onChange={handleChange}
            />
          </FlexBox>

          <Input
            required
            name="accountName"
            value={accountName}
            label="Account Name"
            onChange={handleChange}
          />

          <FlexBox>
            <Input
              required
              type="date"
              name="date"
              value={date}
              label="Date Issued"
              onChange={handleChange}
            />

            <Select
              required
              label="Currency"
              value={currency}
              onChange={handleChange}
            >
              <option value="$">USD ($)</option>
              <option value="₦">NGN (₦)</option>
              <option value="€">EUR (€)</option>
              <option value="£">GBP (£)</option>
              <option value="¥">JPY (¥)</option>
            </Select>
          </FlexBox>

          <Input
            required
            name="description"
            value={description}
            onChange={handleChange}
            label="Transaction Description"
          />

          <Input
            required
            name="issuedBy"
            value={issuedBy}
            onChange={handleChange}
            label="Issued By"
          />

          <Input
            name="receiptNumber"
            value={receiptNumber}
            onChange={handleChange}
            label="Receipt Number (Optional)"
          />

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Items</h2>

            {items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4"
              >
                <Input
                  label="Item Name"
                  value={item.name}
                  onChange={(e) =>
                    handleItemChange(index, 'name', e.target.value)
                  }
                />

                <Input
                  type="number"
                  label="Quantity"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(
                      index,
                      'quantity',
                      parseInt(e.target.value),
                    )
                  }
                />

                <Input
                  type="number"
                  label="Price"
                  value={item.price}
                  onChange={(e) =>
                    handleItemChange(index, 'price', parseFloat(e.target.value))
                  }
                />

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => deleteItem(index)}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addItem}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Add Item
            </button>
          </section>
        </form>

        <main
          id="receipt"
          className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 relative space-y-10 border-dashed"
          style={{ width: '400px', margin: '0 auto' }}
        >
          <section className="text-center border-dashed border-b border-gray-200 pb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Payment Information
            </h2>

            <p className="text-xs text-gray-600 italic">
              {description || 'Your transaction description here'}
            </p>

            {phoneNumber && (
              <p className="text-sm text-gray-600">Phone: {phoneNumber}</p>
            )}
          </section>

          <article className="text-center">
            <p className="text-sm text-gray-500">Total Payment</p>
            <p className="font-semibold">
              {currency}
              {Number(total.toFixed(2) || 0).toLocaleString()}
            </p>
          </article>

          <section className="space-y-7 mt-4 pb-6 border-dashed border-b border-gray-200">
            {receiptNumber && (
              <div className="flex items-center justify-between text-sm">
                <p className="max-w-[60%] text-gray-500 text-xs">Receipt #</p>
                <p className="max-w-[35%] text-xs font-semibold">
                  #{receiptNumber}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <p className="max-w-[60%] text-gray-500 text-xs">Sender Name</p>

              <p className="max-w-[35%] text-xs font-semibold">
                {customerName}
              </p>
            </div>

            {customerEmail && (
              <div className="flex items-center justify-between text-sm">
                <p className="max-w-[60%] text-gray-500 text-xs">
                  Sender Email
                </p>

                <p className="max-w-[35%] text-xs font-semibold">
                  {customerEmail}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <p className="max-w-[60%] text-gray-500 text-xs">Bank Name</p>

              <p className="max-w-[35%] text-xs font-semibold">{bankName}</p>
            </div>

            <div className="flex items-center justify-between text-sm">
              <p className="max-w-[60%] text-gray-500 text-xs">
                Account Number
              </p>

              <p className="max-w-[35%] text-xs font-semibold">
                {accountNumber}
              </p>
            </div>

            <div className="flex items-center justify-between text-sm">
              <p className="max-w-[60%] text-gray-500 text-xs">Account Name</p>

              <p className="max-w-[35%] text-xs font-semibold">{accountName}</p>
            </div>

            <div className="flex items-center justify-between text-sm">
              <p className="max-w-[60%] text-gray-500 text-xs">Payment Date</p>

              <p className="max-w-[35%] text-xs font-semibold">
                {date && moment(date).format('Do MMMM, YYYY')}
              </p>
            </div>

            <div className="flex items-center justify-between text-sm">
              <p className="max-w-[60%] text-gray-500 text-xs">Issued By</p>

              <p className="max-w-[35%] text-xs font-semibold">{issuedBy}</p>
            </div>
          </section>

          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 text-sm text-gray-700">Item</th>
                <th className="text-left py-2 text-sm text-gray-700">Qty</th>
                <th className="text-left py-2 text-sm text-gray-700">Price</th>
                <th className="text-left py-2 text-sm text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 text-xs text-gray-700 !capitalize">
                    {item.name}
                  </td>
                  <td className="py-2 text-xs text-gray-700">
                    {item.quantity}
                  </td>
                  <td className="py-2 text-xs text-gray-700">
                    {currency}
                    {Number(item.price.toFixed(2) || 0).toLocaleString()}
                  </td>
                  <td className="py-2 text-xs text-gray-700">
                    {currency}
                    {Number(
                      (item.quantity * item.price).toFixed(2) || 0,
                    ).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <footer className="text-center text-xs text-gray-500">
            <p>Thank you for your business!</p>
            <p>Please visit us again.</p>
          </footer>
        </main>

        <button
          onClick={generatePDF}
          className="w-full mt-6 bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Download as PDF
        </button>
      </div>
    </div>
  )
}

export const FlexBox = ({ children }: { children: ReactNode }) => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {children}
    </section>
  )
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface CardTextProps extends HTMLAttributes<HTMLElement> {}

const Root = ({ children }: CardTextProps) => {
  return (
    <article className="flex items-center justify-between text-sm">
      {children}
    </article>
  )
}

const Title = ({ children }: CardTextProps) => {
  return <p className="max-w-[60%] text-gray-500 text-xs">{children}</p>
}

const Subject = ({ children }: CardTextProps) => {
  return <p className="max-w-[35%] text-xs font-semibold">{children}</p>
}

export const CardText = { Root, Title, Subject }
