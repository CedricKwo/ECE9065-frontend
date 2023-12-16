import { Button, Form, Input, message } from 'antd';
import React from 'react';
import { post } from '../../utils';
import './login.css'

const Login = () => {

  const onFinish = async (values) => {
    console.log('Success:', values);
    try {
      const { data } = await post('/users/login', values)
      window.localStorage.setItem('userInfo', JSON.stringify({
        email: values.email,
        token: data.message.token
      }))
      window.location.href = '/#/home'
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const toForget = () => {
    window.location.href = '/#/forgetPassword'
  }

  const toReg = () => {
    window.location.href = '/#/register'
  }

  return (
    <div className='login-page page'>
      <div className="content">
        <h1>Login</h1>

        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="email"
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input your email!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Login
            </Button>
            <Button type="link" onClick={toReg} style={{ margin: '0 8px' }}>
              Register
            </Button>
            <Button type="link" onClick={toForget}>
              Forget Password
            </Button>
          </Form.Item>
        </Form>

      </div>
    </div>

  );
};
export default Login;