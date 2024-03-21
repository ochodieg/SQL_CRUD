import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { useLoaderData, useLocation, useNavigate } from 'react-router-dom'

const Update = () => {
    const [file, setFile] = useState(); //handleChange var
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

    const handleFileChange = (e) => { // handles any change in file input
        //HANDLE FILE UPLOAD
        setFile(e.target.files[0]);  // store first file in array in file const var
        console.log(e.target.files[0]);
        console.log("file is:");
        console.log(file);
        // in order for 

    }

    //will use axios to send data to backend
    // if you make a "???" cast(?) it should be an async function?
    // const handleClick = async e =>{
    //     e.preventDefault() // button default behavior refreshes page
    //     try{
    //         await axios.put("http://10.0.0.181:8800/books/"+ bookId, book)  // send to json object with deliminated id
    //         navigate("/")   // use router dom navigate function to return to home page
    //     }catch(err){
    //         console.log(err)
    //     }
    // }
    const handleClick = async e =>{
        e.preventDefault() // button default behavior refreshes page

        const formData = new FormData(); //creating a container for the http form data 
        formData.append('image', file); //adds a file to the container , associating it with the name 'image'

        //console.log("stinky"+ file.filename); why cant i access filename 
        // until the put method? does upload.single('image') have something to do with it?

        formData.append("document", JSON.stringify(book));
        formData.append("id", JSON.stringify(bookId) );

        try{
            await axios.put("http://10.0.0.181:8800/books/"+ bookId, formData)  // send to json object with deliminated id
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

            <input type="file" placeholder='cover' onChange={handleFileChange} name="cover" />

            <button className="formButton" onClick={handleClick}>Update</button>
        </div>
    )
}

export default Update