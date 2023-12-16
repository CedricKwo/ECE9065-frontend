import { Button, Form, Input, message } from 'antd';
import React, { useState } from 'react';
import { post, put } from '../../utils';
import './forgetPassword.css'

let tt = 0;

const ForgetPassword = () => {

  const [email, setEmail] = useState('')
  const [time, setTime] = useState(0)

  const resetPasswrod = async (values) => {
    await put('/users/reset-password', {
      email,
      verificationCode: values.verificationCode,
      newPassword: values.newPassword
    })
    message.success('success')
    window.location.href = '/#/login'
  };

  const sendEmail = async () => {
    if (tt == 0) {
      try {
        const { data } = await post('/users/request-resetting-password', {
          userEmail: email
        })
        setTime(60)
        tt = 60
        const timerId = setInterval(() => {
          tt--;
          setTime(tt)
          if (tt == 0) {
            clearInterval(timerId)
          }
        }, 1000)

        message.success(data.message)
      } catch (error) {
        message.error(error.message)
      }
    }
  }

  const handleOnInput = ({ target }) => {
    setEmail(target.value)
  }

  return (
    <div className='fp-page page'>
      <div className="content">
        <h1>Forget Password</h1>

        <Form
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 14,
          }}
          layout="horizontal"
          onFinish={resetPasswrod}
        >

          <Form.Item label="email" name="email">
            <Input.Group compact>
              <Input placeholder='Email' style={{ width: 200 }} onInput={handleOnInput} />
              <Button type="primary" onClick={() => { sendEmail() }}>{time == 0 ? 'SendCode' : `${time}s`}</Button>
            </Input.Group>
          </Form.Item>
          <Form.Item label="verificationCode" name="verificationCode">
            <Input />
          </Form.Item>
          <Form.Item label="newPassword" name="newPassword">
            <Input type='password' />
          </Form.Item>
          <Form.Item label="  " colon={false}>
            <Button type='primary' htmlType="submit">Verify</Button>
          </Form.Item>
        </Form>
      </div>
    </div>

  );
};
export default ForgetPassword;
