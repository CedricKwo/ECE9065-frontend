import React, { useState, useEffect } from 'react'
import { Input, Button, Form, message, Select, Table } from 'antd';
import Head from '../../components/head/head'
import { post, get, put } from '../../utils';
import Book from '../../components/book/book'
import './admin.css'

const { Search } = Input;
const { Option } = Select;

const Admin = () => {

  const [email, setEmail] = useState('')
  const [userInfo, setUserInfo] = useState({})
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    try {
      await get('/users/verify-admin')
    } catch (error) {
      window.location.href = '/#/'
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await get('/users/admin-query-user-list');
      if (response.data && Array.isArray(response.data.message)) {
        setUsers(response.data.message); 
      } else {
        setUsers([]); 
        console.log('No user data returned from the API');
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  {/*const queryUserInfo = async () => {
    const { data } = await get('/users/admin-query-userinfo?email=' + email)
    setUserInfo(data.message)
  }*/}
  const queryUserInfo = async () => {
    try {
      console.log('Querying user info for email:', email);
      const response = await get('/users/admin-query-userinfo?email=' + email);
      if (response.data && response.data.message) {
        console.log('User found:', response.data.message);
        setUserInfo(response.data.message);
      } else {
        console.log('User not found, setting userInfo to {}');
        setUserInfo({});
        message.error('User not found');
      }
    } catch (error) {
      console.log('Error occurred while fetching user info:', error);
      message.error('An error occurred while fetching user info');
    }
  };

  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
  ];

  const onFinish = async (values) => {
    try {
      await put('/users/admin-update-userinfo', values)
      queryUserInfo()
      message.success('success')
    } catch (error) {
      message.error(error.message)
    }
  };

  return (
    <div className="admin-page page">
      <Head></Head>
      <div className="content">
        <h2>Query User Info</h2>
        <Input.Group compact>
          <Input value={email} style={{ width: 300 }} onInput={({ target }) => {
            setEmail(target.value)
          }} />
          <Button type="primary" onClick={() => { queryUserInfo() }}>Query</Button>
        </Input.Group>
        {
          userInfo._id ?
            <Form
              labelCol={{
                span: 4,
              }}
              wrapperCol={{
                span: 14,
              }}
              layout="horizontal"
              style={{
                maxWidth: 600,
                marginTop: 16
              }}
              onFinish={onFinish}
              initialValues={userInfo}
            >

              <Form.Item label="email" name="email">
                <Input disabled></Input>
              </Form.Item>
              <Form.Item label="username" name="username">
                <Input></Input>
              </Form.Item>
              <Form.Item label="role" name="role">
                <Select style={{ width: 120 }} >
                  <Option value="user">user</Option>
                  <Option value="admin">manager</Option>
                </Select>
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
            </Form>
            : null
        }
      </div>
      <div className="user-table">
        <Table columns={columns} dataSource={users} />
      </div>
    </div>
  )
}
export default Admin