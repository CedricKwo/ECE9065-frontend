import React, { useState, useEffect } from 'react'
import { Input, Button, Switch, message, Drawer, Select, Empty, Comment } from 'antd';
import './home.css';
import Head from '../../components/head/head'
import { post, get, put } from '../../utils';
import Book from '../../components/book/book'

const { Search } = Input;

const Home = () => {

  const [searchBooks, setSearchBooks] = useState([]);
  const [publickBooklist, setPublickBooklist] = useState([]);
  const [booklist, setBooklist] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const uinfo = window.localStorage.getItem('userInfo')
    if (uinfo) {
      setUserInfo(JSON.parse(uinfo))
      fetchPublickBooklist(true)
      fetchMyBooklist();
      checkAdmin()
    } else {
      fetchPublickBooklist(false)
    }
  }, [])

  const fetchPublickBooklist = async (bool) => {
    if (bool) {
      const { data } = await get('/booklists/get-all-public-booklist')
      setPublickBooklist(data.message.map(item => {
        return {
          ...item,
          commentText: ''
        }
      }))
    } else {
      const { data } = await get('/booklists/unauthorized-get-public-booklist')
      setPublickBooklist(data.message.map(item => {
        return {
          ...item,
          commentText: ''
        }
      }))
    }
  }

  const checkAdmin = async () => {
    try {
      await get('/users/verify-admin')
      setIsAdmin(true)
    } catch (error) {
      setIsAdmin(false)
    }
  }

  const onSearch = async (value) => {
    const { data } = await get('/books/search/' + value)
    setSearchBooks(data)
  }

  const fetchMyBooklist = async () => {
    const { data } = await get('/booklists/query-booklist-info')
    setBooklist(data.message)
    if (data.message.length) {
      setCurrentBooklist(data.message[0].name)
    }
  }

  const addCart = async (bookId) => {
    const { data } = await post('/cart/add-to-cart', {
      bookId
    })
    message.success(data.message)
  }

  const addBooklist = async () => {
    await post('/booklists/add-book-to-booklist', {
      bookId: currentBook.id,
      bookListName: currentBooklist
    })
    message.success('success')
    onClose()
  }

  const [open, setOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState({});
  const [currentBooklist, setCurrentBooklist] = useState('');

  const showDrawer = (book) => {
    if (booklist.length) {
      setOpen(true);
      setCurrentBook(book)
    } else {
      message.info('create booklist first')
    }
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleChange = (value) => {
    setCurrentBooklist(value)
  };

  const commentInput = (index, value) => {
    const list = [...publickBooklist]
    list[index].commentText = value
    setPublickBooklist(list)
  }

  const sendComment = async (bl) => {
    await put('/booklists/make-comment-to-booklist', {
      user: bl.user, // "_id" of booklist owner
      name: bl.name,
      commentText: bl.commentText
    })
    message.success('success')
    fetchPublickBooklist()
  }

  {/*const handleDelComment = (commentId, bookListId, displayStatus) => {
    let newDisplayStatus = displayStatus
    if (displayStatus === 'hidden') {
      newDisplayStatus = 'unhidden'
    }
    else {
      newDisplayStatus = 'hidden'
    }
    put('/booklists/admin-maintain-comments', {
      bookListId,
      commentId,
      display: newDisplayStatus
    })
  }*/}
  const handleDelComment = async (commentId, bookListId, displayStatus) => {
    try {
      // 发起 PUT 请求
      const response = await put('/booklists/admin-maintain-comments', {
        bookListId,
        commentId,
        display: displayStatus === 'hidden' ? 'unhidden' : 'hidden'
      });
      // 处理成功的响应
      if (response && response.data) {
        message.success('Update successful');
        fetchPublickBooklist(); // 重新获取公开书单的数据以更新状态
      }
    } catch (error) {
      // 捕获并处理错误
      message.error('Failed to update comment visibility');
      console.error('Error updating comment visibility:', error);
    }
  };



  const addAnyBooklist = async (id) => {
    await get('/booklists/request-add-book-to-booklist?bookId=' + id)
    message.success('success')
  }

  return (
    <>
      <div className="index-page page">
        <Head></Head>
        <div className="left">
          <Search placeholder="Search book" onSearch={onSearch} style={{ width: 200 }} />
          <h2>Search</h2>
          <div className='book-search'>
            {
              searchBooks.length ? searchBooks.map((book, index) => {
                return <Book key={book.id} book={book} showPrice>
                  {
                    userInfo.email ? <> <Button onClick={() => { addCart(book.id) }}>Add Cart</Button>
                      <Button onClick={() => { showDrawer(book) }}>Add Booklist</Button></> : null
                  }

                </Book>
              }) : <Empty></Empty>
            }
          </div>
          <h2>BookList</h2>
          <div className="book-list">
            {
              publickBooklist.map((bl, index) => {
                return (
                  <div className="booklist" key={index}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <p className='name'>{bl.name}</p>
                    </div>
                    <p className="desc" style={{ marginTop: 8 }}>{bl.discription}</p>
                    {
                      bl.books.length ? <>
                        <div className='book-wrap'>
                          {
                            bl.books.map(bookId => {
                              return <Book bookId={bookId} hideBtn={true} key={bookId}>
                              </Book>
                            })
                          }
                        </div>
                        {
                          userInfo.email ? <Input.Group compact>
                            <Input value={bl.commentText} style={{ width: 300 }} onInput={({ target }) => {
                              commentInput(index, target.value)
                            }} />
                            <Button type="primary" onClick={() => { sendComment(bl) }}>Comment</Button>
                          </Input.Group> : null
                        }
                        {
                          bl.comments.length ? <>
                            {bl.comments
                            .filter(comment => {
                              if (isAdmin) {
                                return true
                              }
                              return comment.display !== 'hidden';
                            })
                            .map((comment, j) => {
                              const buttonText = comment.display === 'hidden' ? 'Unhidden' : 'Hidden';
                              return <Comment
                                key={comment._id}
                                author={comment.username}
                                /*content={<div>
                                  {comment.text}
                                  {isAdmin ? (
                                    <Button
                                      size='small'
                                      danger
                                      style={{ marginLeft: 8 }}
                                      onClick={() => {
                                        handleDelComment(comment._id, bl._id, comment.display);
                                      }}
                                    >
                                      Hidden/Unhidden
                                    </Button>
                                  ) : null}
                                  
                                    </div>}*/
                                    content={
                                      <div>
                                        {comment.text}
                                        {isAdmin && (
                                          <Button
                                            size='small'
                                            danger
                                            style={{ marginLeft: 8 }}
                                            onClick={() => {
                                              handleDelComment(comment._id, bl._id, comment.display);
                                            }}
                                          >
                                            {buttonText}
                                          </Button>
                                        )}
                                      </div>
                                    }

                                
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
      </div>
      <Drawer title="Add To Booklist" placement="right" onClose={onClose} open={open}>
        {
          booklist.length ? <div>
            <Select
              defaultValue={booklist[0].name}
              style={{ width: 120 }}
              onChange={handleChange}
              options={booklist.map(item => {
                return {
                  label: item.name,
                  value: item.name
                }
              })}
            />
            <Button type='primary' onClick={addBooklist}>Submit</Button>
          </div> : <div>
            <p>There is no book list yet. Click the button to create it.</p>
            <Button type='primary' onClick={() => {
              window.location.href = '/#/mybooklist'
            }}>MyBooklist</Button>
          </div>
        }

      </Drawer>
    </>
  )
}
export default Home