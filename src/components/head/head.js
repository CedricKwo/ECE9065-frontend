import React, { useState, useEffect } from 'react'
import './head.css';
import { Button } from 'antd';
import { get, put } from '../../utils';

const Head = () => {
  const [userInfo, setUserInfo] = useState({});
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const uinfo = window.localStorage.getItem('userInfo')
    if (uinfo) {
      setUserInfo(JSON.parse(uinfo))
      checkAdmin()
    }
  }, [])

  const toHome = () => {
    window.location.href = '/#/'
  }

  const toBookList = () => {
    window.location.href = '/#/mybooklist'
  }
  const toCart = () => {
    window.location.href = '/#/cart'
  }

  const logout = () => {
    put('/users/logout')
    window.localStorage.removeItem('userInfo')
    window.location.href = '/#/login'
  }

  const toLogin = () => {
    window.location.href = '/#/login'
  }
  const toOrder = () => {
    window.location.href = '/#/myOrder'
  }

  const checkAdmin = async (userInfo) => {
    try {
      await get('/users/verify-admin')
      setIsAdmin(true)
    } catch (error) {
      setIsAdmin(false)
    }
  }

  const toReg = () => {
    window.location.href = '/#/register'
  }

  const toProfile = () => {
    window.location.href = '/#/profile'
  }
  const toAdmin = () => {
    window.location.href = '/#/admin'
  }

  return (
    <div className="header">
      <div className="content">
        <div className='logo' onClick={() => { toHome() }}>BookStore</div>
        <div style={{ flex: 1 }}></div>
        <div style={{ display: 'flex' }}>
          {
            !userInfo.email ? (
              <>
                <Button type='primary' onClick={() => { toLogin() }} >Login</Button>
                <Button type='primary' onClick={() => { toReg() }} style={{ marginLeft: 8 }}>Register</Button>
              </>
            ) : (
              <div className='action'>
                {isAdmin ? <span onClick={() => { toAdmin() }}>Admin</span> : null}
                <span onClick={() => { toProfile() }}>{userInfo.email}</span>
                <span onClick={() => { toBookList() }}>MyBookList</span>
                <span onClick={() => { toOrder() }}>MyOrder</span>
                <span onClick={() => { toCart() }}>Cart</span>
                <span onClick={() => { logout() }}>Logout</span>
              </div>
            )
          }
        </div>
      </div>
    </div >
  )
}
export default Head