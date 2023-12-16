import React, { useState, useEffect } from 'react'
import './mybooklist.css';
import Head from '../../components/head/head'
import { get, post, put, del } from '../../utils';
import Book from '../../components/book/book'
import { Button, Form, Input, Select, message, Modal, Empty, Comment } from 'antd';

const { Option } = Select;

const MyBookList = () => {

  const [booklist, setBooklist] = useState([]);
  const [booklistData, setBooklistData] = useState({
    name: '',
    describe: '',
    accessibility: 'public'
  })
  const [isEdit, setIsEdit] = useState(false)
  const [show, setShow] = useState(false)

  useEffect(() => {
    fetchBooklist()
  }, [])

  const fetchBooklist = async () => {
    const { data } = await get('/booklists/query-booklist-info')
    setBooklist(data.message)
  }

  const createBooklist = async (values) => {
    if (isEdit) {
      await put('/booklists/update-booklist-info', {
        ...values,
        _id: booklistData._id
      })
    } else {
      await post('/booklists/create-new-booklist', values)
    }
    message.success('success')
    fetchBooklist();
    handleCancel()
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const [open, setOpen] = useState(false);
  const showModal = (data) => {
    setBooklistData(data ? data : {
      name: '',
      describe: '',
      accessibility: 'public'
    })
    setIsEdit(!!data)
    setOpen(true);
    setTimeout(() => {
      setShow(true)
    }, 100);
  };

  const handleCancel = () => {
    setOpen(false);
    setShow(false)
  };

  const handleDelete = async (bookListName) => {
    await del('/booklists/delete-booklist', {
      bookListName
    })
    message.success('success')
    fetchBooklist();
  }

  const handleDeleteBook = async (bookListName, bookId) => {
    await put('/booklists/remove-book-from-booklist', {
      bookId,
      bookListName
    })
    message.success('success')
    fetchBooklist()
  }

  return (
    <div className="index-page page">
      <Head></Head>
      <div className="left">
        <Button type="primary" onClick={() => { showModal() }}>
          Create Booklist
        </Button>

        <h2>My Book List</h2>
        <div className="book-list">
          {
            booklist.map((bl, index) => {
              return (
                <div className="booklist" key={index}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <p className='name'>{bl.name}</p>
                    <Button size='small' style={{ margin: '0 8px' }} onClick={() => { showModal(bl) }}>Edit</Button>
                    <Button danger size='small' onClick={() => { handleDelete(bl.name) }}>Delete</Button>
                  </div>
                  <p className="desc" style={{ marginTop: 8 }}>{bl.discription}</p>
                  {
                    bl.books.length ? <>
                      <div className='book-wrap'>
                        {
                          bl.books.map(bookId => {
                            return <Book bookId={bookId} hideBtn={true} key={bookId}>
                              <Button onClick={() => { handleDeleteBook(bl.name, bookId) }}>Delete</Button>
                            </Book>
                          })
                        }
                      </div>
                      {
                        bl.comments.length ? <>
                          {bl.comments.map((comment, j) => {
                            return <Comment
                              key={comment._id}
                              author={comment.username}
                              content={comment.text}
                              datetime={comment.createdAt}
                            />
                          })}
                        </> : null
                      }
                    </> : <Empty></Empty>
                  }

                </div>
              )
            })
          }
        </div>
      </div>

      <Modal
        open={open}
        title="Create Booklist"
        onCancel={handleCancel}
        footer={null}
      >
        {
          show ? <Form
            layout="horizontal"
            initialValues={booklistData}
            onFinish={createBooklist}
            onFinishFailed={onFinishFailed}
          >

            <Form.Item label="name" name="name">
              <Input />
            </Form.Item>
            <Form.Item label="discription" name="discription">
              <Input />
            </Form.Item>
            <Form.Item label="accessibility" name="accessibility">
              <Select defaultValue="public" style={{ width: 120 }} >
                <Option value="public">public</Option>
                <Option value="private">private</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type='primary' htmlType="submit">{isEdit ? 'Edit' : 'Create'}</Button>
            </Form.Item>
          </Form> : null
        }
      </Modal>
    </div>
  )
}
export default MyBookList