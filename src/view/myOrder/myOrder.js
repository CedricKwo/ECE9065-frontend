import React, { useEffect, useState, } from 'react';
import { get, post, put } from '../../utils';
import Head from '../../components/head/head';
import './myOrder.css'
import { Descriptions } from 'antd';

const MyOrder = () => {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    const { data } = await get('/orders/query-order')
    setOrders(data.message)
  }

  return (
    <div className="myOrder-page page">
      <Head></Head>
      <div className='order-list'>
        {
          orders.map(order => {
            return <Descriptions title="Order Info" bordered key={order.orderId}>
              <Descriptions.Item label="orderId">{order.orderId}</Descriptions.Item>
              <Descriptions.Item label="status">{order.status}</Descriptions.Item>
              <Descriptions.Item label="createTime">{order.createTime}</Descriptions.Item>
              <Descriptions.Item label="firstName">{order.firstName}</Descriptions.Item>
              <Descriptions.Item label="lastName">{order.lastName}</Descriptions.Item>
              <Descriptions.Item label="phoneNumber">{order.phoneNumber}</Descriptions.Item>
              <Descriptions.Item label="paymentCard">{order.paymentCard}</Descriptions.Item>
              {/*<Descriptions.Item label="cardNumber">{order.cardNumber}</Descriptions.Item>*/}
              <Descriptions.Item label="unit">{order.unit}</Descriptions.Item>
              <Descriptions.Item label="streetNumber">{order.streetNumber}</Descriptions.Item>
              <Descriptions.Item label="streetName">{order.streetName}</Descriptions.Item>
              <Descriptions.Item label="postalCode">{order.postalCode}</Descriptions.Item>
              <Descriptions.Item label="city">{order.city}</Descriptions.Item>
              <Descriptions.Item label="province">{order.province}</Descriptions.Item>
              <Descriptions.Item label="country">{order.country}</Descriptions.Item>
              <Descriptions.Item label="Subtotal">${order.subtotal.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="Tax">${order.tax.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="Shipping">${order.shipping.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="GrandTotal">${order.grandTotal.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="discount">${order.discount.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="actualPayment">${order.grandTotal.toFixed(2)}</Descriptions.Item>
            </Descriptions>
          })
        }

      </div>

    </div>
  );
};

export default MyOrder;
