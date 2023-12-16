import React, { useEffect, useState } from 'react';
import bookCoverImg from '../../assets/book_cover.png'
import './book.css'
import axios from 'axios';
import { Button, Modal } from 'antd';

const Cart = ({ book, bookId, children, callback = () => { }, showPrice = false }) => {

  const [newBook, setNewBook] = useState({})

  useEffect(() => {
    // Cached books
    let books = window.localStorage.getItem('books')
    if (books) {
      books = JSON.parse(books)
    } else {
      books = []
    }

    if (book) {
      setNewBook(book)
      const target = books.find(item => item.id == book.id)
      if (!target) {
        books.push(book)
        callback(book)
      }
    } else if (bookId) {
      const target = books.find(item => item.id == bookId)
      if (target) {
        setNewBook(target)
        books.push(target)
        callback(target)
      } else {
        fetchBookInfo(bookId).then((data) => {
          books.push(data)
          callback(data)
          window.localStorage.setItem('books', JSON.stringify(books))
        })
      }
    }

    window.localStorage.setItem('books', JSON.stringify(books))
  }, [book, bookId])

  const fetchBookInfo = async (bookId) => {
    const { data } = await axios.get('https://www.googleapis.com/books/v1/volumes/' + bookId)
    setNewBook(data)
    return data
  }

  const getThumbnail = (book) => {
    const volumeInfo = book.volumeInfo
    if (volumeInfo.imageLinks) {
      return volumeInfo.imageLinks.smallThumbnail
    } else {
      return bookCoverImg
    }
  }

  const toBookInfo = (book) => {
    window.open(book.volumeInfo.infoLink, '_blank')
  }

  const price = () => {
    try {
      return newBook.saleInfo.listPrice.amount
    } catch (error) {
      return 0
    }
  }

  const renderDesc = () => {
    return newBook.volumeInfo.description
  }

  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true)
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div className='c-book'>
      {
        newBook.id ? <>
          <img src={getThumbnail(newBook)} width={128} height={171} style={{ marginRight: 16 }} alt="" />
          <div>
            <p className="title" onClick={() => { showModal() }}>{newBook.volumeInfo.title}</p>
            <p className="authors">{newBook.volumeInfo.authors}</p>
            {
              showPrice ? <p>${price()}</p> : null
            }
            {price() > 0 ? children : null}
          </div>
          <Modal
            open={open}
            title={newBook.volumeInfo.title}
            onCancel={handleCancel}
            footer={null}
          >
            {renderDesc()}
          </Modal>
        </> : null
      }
    </div>
  );
};

export default Cart;
