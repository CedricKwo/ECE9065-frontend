import React, { useEffect, useState, useRef} from 'react';
import { get, post, put } from '../../utils';
import Head from '../../components/head/head';
import { Button, Form, message, Input } from 'antd';
import axios from 'axios';
import Book from '../../components/book/book'

const CreateOrder = () => {
  const [books, setBooks] = useState([])
  const [subtotal, setSubtotal] = useState(0)
  const [tax, setTax] = useState(0)
  const [shipping, setShipping] = useState(0)
  const [grandTotal, setGrandTotal] = useState(0)
  const expiryDataRef = useRef();
  const cvvRef = useRef();

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    const { data } = await get('/cart/display-cart')
    handleSetBooks(data.message)
  }

  const handleSetBooks = async (message) => {
    const res = await Promise.all(message.map(book => {
      return fetchBookInfo(book.bookId)
    }))

    const list = message.map((book, index) => {
      return {
        ...book,
        bookInfo: res[index]
      }
    })

    setBooks(list)
    updataData(list)
  }

  const fetchBookInfo = async (bookId) => {
    const { data } = await axios.get('https://www.googleapis.com/books/v1/volumes/' + bookId)
    return data
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

  const pay = async (values) => {
    const { data } = await post('/orders/create-order', {
      products: books,
      subtotal,
      tax,
      shipping,
      grandTotal,
      discount: 0.00,
      actualPayment: grandTotal,
      ...values,
      "ExpiryDate": "12/34",
      "CVC": "248"
    })

    message.success('success')
    window.location.href = '/#/myOrder'
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

  const onFinish = (values) => {

  }

  return (
    <div className="createOrder-page page">
      <Head></Head>
      <div style={{ position: 'absolute', left: -99999, top: -99999 }}>
        {
          books.map((book, index) => {
            return <div className='cart-item' key={book.bookId}>
              <Book bookId={book.bookId} hideBtn={true} callback={callback}></Book>
            </div>
          })
        }
      </div>
      <div className='good-list' style={{ display: 'flex', background: '#fff', padding: 16 }}>
        <div style={{ flex: 1 }}>
          {
            books.map((book, index) => {
              return <p key={book.bookId}>{book.bookInfo.volumeInfo.title} x{book.bookCount}</p>
            })
          }

          <p>Subtotal: ${subtotal}</p>
          <p>Tax: ${tax}</p>
          <p>Shipping: ${shipping}</p>
          <p>GrandTotal: ${grandTotal}</p>
          <p>discount: 0</p>
          <p>actualPayment: ${grandTotal}</p>

        </div>
        <Form
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 14,
          }}
          layout="horizontal"
          style={{
            width: 600,
          }}
          onFinish={pay}
        >
          <Form.Item label="firstName" name="firstName">
            <Input></Input>
          </Form.Item>
          <Form.Item label="lastName" name="lastName">
            <Input></Input>
          </Form.Item>
          <Form.Item label="phoneNumber" name="phoneNumber">
            <Input></Input>
          </Form.Item>
          <Form.Item label="paymentCard" name="paymentCard">
            <Input></Input>
          </Form.Item>
          {/*<Form.Item label="cardNumber" name="cardNumber">
            <Input></Input>
          </Form.Item>*/}
          
          <Form.Item label="expiryData">
            <Input ref={expiryDataRef}></Input>
          </Form.Item>
          <Form.Item label="CVV">
            <Input ref={cvvRef}></Input>
          </Form.Item>
          <Form.Item label="unit" name="unit">
            <Input></Input>
          </Form.Item>
          <Form.Item label="streetNumber" name="streetNumber">
            <Input></Input>
          </Form.Item>
          <Form.Item label="streetName" name="streetName">
            <Input></Input>
          </Form.Item>
          <Form.Item label="postalCode" name="postalCode">
            <Input></Input>
          </Form.Item>
          <Form.Item label="city" name="city">
            <Input></Input>
          </Form.Item>
          <Form.Item label="province" name="province">
            <Input></Input>
          </Form.Item>
          <Form.Item label="country" name="country">
            <Input></Input>
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType="submit">Pay</Button>
          </Form.Item>

        </Form>
      </div>

    </div>
  );
};

export default CreateOrder;
