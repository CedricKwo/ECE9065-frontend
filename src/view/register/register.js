import {
  Button,
  DatePicker,
  Form,
  Input,
  message
} from 'antd';
import React, { useState } from 'react';
import { post, put } from '../../utils';
import './register.css'

let tt = 0;

const Register = () => {
  const [email, setEmail] = useState('')
  const [isVerify, setIsVerify] = useState(false)
  const [time, setTime] = useState(0)

  const onFinish = async (values) => {
    try {
      await post('/users/register', values)
      setTime(60)
      tt = 60
      const timerId = setInterval(() => {
        tt--;
        setTime(tt)
        if (tt == 0) {
          clearInterval(timerId)
        }
      }, 1000)
      message.success('register success')
      setIsVerify(true)
    } catch (error) {
      message.error(error.message)
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const sendEmail = async () => {
    if (tt == 0) {
      try {
        const { data } = await post('/users/resend-verification-code', {
          email,
          codeType: 'registration'
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

  const verifyEmail = async (values) => {
    try {
      const { data } = await put('/users/verify-verification-code', {
        ...values,
        email,
        verificationType: 'registration'
      })
      message.success(data.message)
      window.location.href = '/#/login'
    } catch (error) {
      message.error(error.message)
    }
  }

  return (
    <div className='reg-page page'>

      <div className="content">
        <h1>Register</h1>

        {
          !isVerify ? <Form
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 14,
            }}
            layout="horizontal"
            size='small'
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item label="username" name="username">
              <Input />
            </Form.Item>
            <Form.Item label="email" name="email">
              <Input />
            </Form.Item>
            <Form.Item label="password" name="password">
              <Input type='password' />
            </Form.Item>
            <Form.Item label="firstname" name="firstname">
              <Input />
            </Form.Item>
            <Form.Item label="middlename" name="middlename">
              <Input />
            </Form.Item>
            <Form.Item label="lastname" name="lastname">
              <Input />
            </Form.Item>
            <Form.Item label="birthday" name="birthday">
              <DatePicker />
            </Form.Item>
            <Form.Item label="phonenumber" name="phonenumber">
              <Input />
            </Form.Item>
            <Form.Item label="apartment" name="apartment">
              <Input />
            </Form.Item>
            <Form.Item label="streetnumber" name="streetnumber">
              <Input />
            </Form.Item>
            <Form.Item label="streetname" name="streetname">
              <Input />
            </Form.Item>
            <Form.Item label="postalcode" name="postalcode">
              <Input />
            </Form.Item>
            <Form.Item label="city" name="city">
              <Input />
            </Form.Item>
            <Form.Item label="province" name="province">
              <Input />
            </Form.Item>
            <Form.Item label="country" name="country">
              <Input />
            </Form.Item>
            <Form.Item label=" ">
              <Button type='primary' htmlType="submit">Submit</Button>
            </Form.Item>
          </Form> : <Form
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 14,
            }}
            layout="horizontal"
            onFinish={verifyEmail}
            onFinishFailed={onFinishFailed}
          >

            <Form.Item label="email" name="email">
              <Input.Group compact>
                <Input style={{ width: 'calc(100% - 200px)' }} onInput={handleOnInput} />
                <Button type="primary" onClick={() => { sendEmail() }}>{time == 0 ? 'SendCode' : `${time}s`}</Button>
              </Input.Group>
            </Form.Item>
            <Form.Item label="verificationCode" name="verificationCode">
              <Input />
            </Form.Item>
            <Form.Item label="Button">
              <Button type='primary' htmlType="submit">Verify</Button>
            </Form.Item>
          </Form>
        }
      </div>


    </div>
  );
};
export default Register;