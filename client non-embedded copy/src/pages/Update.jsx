import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { useLoaderData, useLocation, useNavigate } from 'react-router-dom'

const Update = () => {
    //useState takes values from webpage inputs into json object
    const [book,setBook] = useState({   // whenever a value is set on webpage, setBook binds to it?? (idk this dude mumbles way too much but checkout his usestate video i guess)
        // name attributes below must match these
        title:"",
        desc:"",
        price:null,
        cover:""
    })

    const navigate = useNavigate()
    const location = useLocation()  // using router dom to get router location/book id
    console.log(location.pathname.split("/")[2])   // this will print to the console the pathname of location 
                            // because we have the route for update set as "/update/:id"
                            // we will try to extract only the id portion of route for the handleClick put method
                            // split() will creat an array of the route string using the slash as a delimiter
                            // we will then use the index location of the id string

    const bookId = location.pathname.split("/")[2];

    const handleChange = (e) =>{
        //whenever input changes, set book
        // this allows fields to update in real-time?
        setBook((prev)=>({ ...prev, [e.target.name]: e.target.value}));
        // syntax here is wild. jesus
    };

    //will use axios to send data to backend
    // if you make a "???" cast(?) it should be an async function?
    const handleClick = async e =>{
        e.preventDefault() // button default behavior refreshes page
        try{
            await axios.put("http://10.0.0.181:8800/books/"+ bookId, book)  // send to json object with deliminated id
            navigate("/")   // use router dom navigate function to return to home page
        }catch(err){
            console.log(err)
        }
    }

    console.log(book);

    return(
        <div className='form'>
            <h1>Update Book</h1>
            <input type="text" placeholder='title' onChange={handleChange} name="title" /> 

            <input type="text" placeholder='description' onChange={handleChange} name="desc" />

            <input type="number" placeholder='price' onChange={handleChange} name="price"/>

            <input type="text" placeholder='cover' onChange={handleChange} name="cover" />

            <button className="formButton" onClick={handleClick}>Update</button>
        </div>
    )
}

export default Update