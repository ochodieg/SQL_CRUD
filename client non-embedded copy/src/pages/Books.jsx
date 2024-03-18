import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useRef } from 'react'  // used to query for DOM elements
import axios from 'axios'
import { Link } from 'react-router-dom'

/*
showing all books in home page: fetch data from backend server using axios
which lets us make api requests? isn't that what jsx does when stringing together an sql command?
*/


/*
whenever Books component is ran,
it will run the useEffect function,
within useEffect, our defined fetchAllBooks function will attempt to fetch "all data"???
*/


const Books = () => {
    //create book state
    const [books,setBooks] = useState([])

    // this portion correlates  with the middleware function "app.use(cors())" in the index.js
    useEffect(() =>{
        // fetching function
        const fetchAllBooks = async () =>{  // async function because we are making an api request???
            try{
                const res = await axios.get("http://10.0.0.181:8800/books")   // response? because it is async, we need to await?
                /*
                 using http://localhost:8800/books makes the server bound to the localhost interface only
                 making it inaccessible from remote client on same network 
                 using http://10.0.0.181:8800/books ensures it is accessible from both localhost and other client on same network
                */
                 setBooks(res.data); // update this variable with data from axios.get method above
                console.log(res)    // show response
            }catch(err){
                console.log("uh oh, stinky: " + err)
            }
        }
        fetchAllBooks()
    }, []) // second arg: dependency will be an empty array meaning it will run just once??

    const handleDelete = async (id) =>{ // handles delete button action
        try{
            await axios.delete("http://10.0.0.181:8800/books/"+id) // have to send id
            window.location.reload() // refresh window (can also use redux??)
        }catch(err){
            console.log(err)
        }
    }

//////////////////////////////////////////////////////////////////
//attempting to adjust top padding when resizing window
//NOTE: it is better to use Reacts ref system instead a direct query to access DOM elements

const  booksRef = useRef(null);
    useEffect(() =>{
        function setTopPadding(){
        //   const container = document.querySelector('.books');
        //   const flexItems = container.querySelector('.book')//.offsetHeight;
        if(booksRef.current){
            const flexItems = booksRef.current.querySelectorAll('.book');

            // check if flexItems exist
            if(flexItems.length > 0){
                // calc height of the first row
                const firstRowHeight = Array.from(flexItems)
                .filter(item=> item.offsetTop === flexItems[0].offsetTop) // grab item in first row
                .reduce((acc, item)=> Math.max(acc, item.offsetHeight), 0); // find max height
      
                // set top padding of container to height of first row
                // container.style.paddingTop = `${firstRowHeight}px`;
                booksRef.current.style.paddingTop = `${firstRowHeight}px`;
            }
        }
      }
    
    
      // set top padding
      setTopPadding();
    
      // adjust padding when window is resized
      window.addEventListener('resize', setTopPadding);
    
      //cleanup function to remove event listener?
      return () =>{
          window.removeEventListener('resize', setTopPadding);
        };
      }, []); // empty dependency array?
      /////////////////////////////////////////////////////////////////////////

    

    // // Set padding-top of container to the height of the first row
    // container.style.paddingTop = `${firstRowHeight}px`;

    // return map to books array in "books" div
    // for each book inside array, return another book div
    // recall that cover can be null in sql table so we use the conditional:
    // {book.cover && <img src="book.cover" alt=""/>} meaning if book cover is null, don't show the additional info
    // also, because we use a map, we need to unit keys, which are the book id's in the sql table "<div className="book" key={book.id}>"
    return(
        <div>
            <header className="header"><h1>Ivans Bookshop</h1></header>
            <div className="books">
                {books.map((book)=>(
                    <div className="book" key={book.id}>
                        {book.cover && <img src={book.cover} alt=""/>}
                        
                        <li className="titleLi"><h2 className="title">{book.title}</h2></li>
                        <li className="descLi"><p className="description">{book.desc}</p></li>
                        <li className="priceLi"><span className="price">{"$" + book.price}</span></li>
                        
                        <button className="delete" onClick={()=>handleDelete(book.id)}>Delete</button>
                        <button className="update"><Link to={`/update/${book.id}`}>Update</Link></button>
                    </div>
                ))}
            </div>
            <button className='addButton'><Link to="/add">Add new book</Link></button>
        </div>
    )
}

export default Books

/*
import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const Books = () => {
    const [books, setBooks] = useState([]);
    const booksRef = useRef(null);

    useEffect(() => {
        const fetchAllBooks = async () => {
            try {
                const res = await axios.get("http://10.0.0.181:8800/books");
                setBooks(res.data);
            } catch (err) {
                console.log("Error: " + err);
            }
        };
        fetchAllBooks();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://10.0.0.181:8800/books/${id}`);
            setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        function setTopPadding() {
            if (booksRef.current) {
                const flexItems = booksRef.current.querySelectorAll('.book');
                if (flexItems.length > 0) {
                    const firstRowHeight = Array.from(flexItems)
                        .filter(item => item.offsetTop === flexItems[0].offsetTop)
                        .reduce((acc, item) => Math.max(acc, item.offsetHeight), 0);
                    booksRef.current.style.paddingTop = `${firstRowHeight}px`;
                }
            }
        }
        setTopPadding();
        window.addEventListener('resize', setTopPadding);
        return () => {
            window.removeEventListener('resize', setTopPadding);
        };
    }, []);

    return (
        <div>
            <header className="header"><h1>Ivan's Bookshop</h1></header>
            <div className="books" ref={booksRef}>
                {books.map((book) => (
                    <div className="book" key={book.id}>
                        <img src={book.cover} alt="" />
                        <li><h2 className="title">{book.title}</h2></li>
                        <li><p className="description">{book.desc}</p></li>
                        <li><span className="price">{"$" + book.price}</span></li>
                        <button className="delete" onClick={() => handleDelete(book.id)}>Delete</button>
                        <button className="update"><Link to={`/update/${book.id}`}>Update</Link></button>
                    </div>
                ))}
            </div>
            <button className='addButton'><Link to="/add">Add new book</Link></button>
        </div>
    );
};

export default Books;


*/