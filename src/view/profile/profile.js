import React, { useEffect, useState } from 'react';
import { get, post, put } from '../../utils';
import Head from '../../components/head/head';
import Book from '../../components/book/book'
import './profile.css'
import {
  Button,
  Form,
  Input,
  message,
} from 'antd';

let tt = 0;

const Profile = () => {
  const [user, setUser] = useState({})
  const [verificationCode, setVerificationCode] = useState('')
  const [time, setTime] = useState(0)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    const { data } = await get('/users/get-profile')
    setUser(data.message)
  }

  const onFinish = async (values) => {
    try {
      await put('/users/update-profile', values)
      fetchProfile()
      message.success('success')
    } catch (error) {
      message.error(error.message)
    }
  }


  const resetPasswrod = async (values) => {
    await put('/users/update-password', {
      verificationCode: verificationCode,
      currentPassword: values.password,
      newPassword: values.newPassword
    })
    message.success('Password updating successful, please login again')
    window.location.href = '/#/login'
  };


  const sendEmail = async () => {
    if (tt == 0) {
      try {
        const { data } = await post('/users/request-changing-password')
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
    setVerificationCode(target.value)
  }

  return (
    <div className="profile-page page">
      <Head></Head>
      <div className='panel'>
        <div className='left'>
          <h2>Profile</h2>
          {user.email ? <Form
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 14,
            }}
            layout="horizontal"
            style={{
              maxWidth: 600,
            }}
            onFinish={onFinish}
            initialValues={user}
          >

            <Form.Item label="email" name="email">
              <Input disabled></Input>
            </Form.Item>
            <Form.Item label="username" name="username">
              <Input></Input>
            </Form.Item>
            <Form.Item label="firstname" name="firstname">
              <Input></Input>
            </Form.Item>
            <Form.Item label="middlename" name="middlename">
              <Input></Input>
            </Form.Item>
            <Form.Item label="lastname" name="lastname">
              <Input></Input>
            </Form.Item>
            <Form.Item label="phonenumber" name="phonenumber">
              <Input></Input>
            </Form.Item>
            <Form.Item label="apartment" name="apartment">
              <Input></Input>
            </Form.Item>
            <Form.Item label="streetnumber" name="streetnumber">
              <Input></Input>
            </Form.Item>
            <Form.Item label="streetname" name="streetname">
              <Input></Input>
            </Form.Item>
            <Form.Item label="postalcode" name="postalcode">
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
              <Button type='primary' htmlType="submit">Edit</Button>
            </Form.Item>

          </Form> : null}
        </div>
        <div className='right'>
          <h2>Password</h2>
          <Form
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 14,
            }}
            layout="horizontal"
            onFinish={resetPasswrod}
          >

            <Form.Item label="verificationCode" name="verificationCode">
              <Input.Group compact>
                <Input placeholder='verificationCode' style={{ width: 'calc(100% - 200px)' }} onInput={handleOnInput} />
                <Button type="primary" onClick={() => { sendEmail() }}>{time == 0 ? 'SendCode' : `${time}s`}</Button>
              </Input.Group>
            </Form.Item>
            <Form.Item label="password" name="password">
              <Input type='password' placeholder='password' />
            </Form.Item>
            <Form.Item label="newPassword" name="newPassword">
              <Input type='password' placeholder='newPassword' />
            </Form.Item>
            <Form.Item label="  " colon={false}>
              <Button type='primary' htmlType="submit">Verify</Button>
            </Form.Item>
          </Form>
        </div>

      </div>

    </div>
  );
};

export default Profile;
