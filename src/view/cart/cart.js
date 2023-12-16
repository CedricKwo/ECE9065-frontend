import React, { useEffect, useState } from 'react';
import { del, get, post, put } from '../../utils';
import Head from '../../components/head/head';
import Book from '../../components/book/book'
import { Button, InputNumber, message } from 'antd';
import './cart.css'

const Cart = () => {
  const [books, setBooks] = useState([])
  const [subtotal, setSubtotal] = useState(0)
  const [tax, setTax] = useState(0)
  const [shipping, setShipping] = useState(0)
  const [grandTotal, setGrandTotal] = useState(0)

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const { data } = await get('/cart/display-cart')
      handleSetBooks(data.message)
    } catch (error) {

    }
  }

  const handleSetBooks = async (message) => {
    setBooks(message)
    updataData(message)
  }

  const updataData = (list) => {
    let s = 0
    list.forEach(item => {
      s += item.bookPrice * item.bookCount
    })
    let t = s * 0.13
    let shipping = 20
    if (s >= 100) {
      shipping = 0
    }

    let grandtotal = s + t + shipping
    setSubtotal(parseFloat(s.toFixed(2)))
    setShipping(parseFloat(shipping.toFixed(2)))
    setTax(parseFloat(t.toFixed(2)))
    setGrandTotal(parseFloat(grandtotal.toFixed(2)))
  }

  const checkout = async () => {
    await post('/cart/checkout-cart', {
      products: books,
      subtotal,
      tax,
      shipping,
      grandTotal,
    })
    window.location.href = '/#/createOrder'
  }

  const countChange = async (index, value) => {
    let book = books[index]
    let res
    if (Math.abs(book.bookCount - value) == 1) {
      if (book.bookCount < value) {
        res = await put('/cart/increase-book', { bookId: book.bookId })
      } else if (book.bookCount > value) {
        res = await put('/cart/reduce-book', { bookId: book.bookId })
      }
    } else {
      res = await put('/cart/set-book-count', { bookId: book.bookId, bookCount: value })
    }
    const list = [...books]
    list.forEach((item, j) => {
      item.bookCount = res.data.message.items[j].bookCount
    })
    handleSetBooks(list)
  }

  const handleDelete = async (bookId) => {
    await del('/cart/remove-book', { bookId })
    message.success('success')
    fetchCart()
    window.location.reload()
  }

  const callback = async (book) => {
    const list = [...books]
    const index = list.findIndex(item => item.bookId == book.id)
    if (index != -1) {
      try {
        list[index].bookPrice = book.saleInfo.listPrice.amount
      } catch (error) {
        list[index].bookPrice = 0
      }
    }
    handleSetBooks(list)
  }


  return (
    <div className="cart-page page">
      <Head></Head>
      <div className='cart-list'>
        {
          books.map((book, index) => {
            return <div className='cart-item' key={book.bookId}>
              <Book bookId={book.bookId} hideBtn={true} callback={callback}>
                <Button type='primary' danger onClick={() => { handleDelete(book.bookId) }}>Delete</Button>
              </Book>
              <div>
                <p>${book.bookPrice}</p>
                <InputNumber min={1} value={book.bookCount} onChange={(e) => {
                  countChange(index, e)
                }} />
              </div>
            </div>
          })
        }

        <p>Subtotal: ${subtotal}</p>
        <p>Tax: ${tax}</p>
        <p>Shipping: ${shipping}</p>
        <p>GrandTotal: ${grandTotal}</p>

        <Button type='primary' onClick={() => { checkout() }}>Checkout</Button>

      </div>

    </div>
  );
};

export default Cart;
