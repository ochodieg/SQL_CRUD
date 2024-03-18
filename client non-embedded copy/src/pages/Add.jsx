import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Add = () => {
    //useState takes values from webpage inputs into json object
    const [book,setBook] = useState({   // whenever a value is set on webpage, setBook binds to it?? (idk this dude mumbles way too much but checkout his usestate video i guess)
        // name attributes below must match these
        title:"",
        desc:"",
        price:null,
        cover:null
    })

    const navigate = useNavigate()

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
            await axios.post("http://10.0.0.181:8800/books", book)  // send to json object
            navigate("/")   // use router dom navigate function to return to home page
        }catch(err){
            console.log(err)
        }
    }

    console.log(book);

    return(
        <div className='form'>
            <h1>Add New Book</h1>
            <input type="text" placeholder='title' onChange={handleChange} name="title" /> 

            <input type="text" placeholder='description' onChange={handleChange} name="desc" />

            <input type="number" placeholder='price' onChange={handleChange} name="price"/>

            <input type="file" placeholder='cover' onChange={handleChange} name="cover" />

            <button className="formButton" onClick={handleClick}>Add</button>
        </div>
    )
}


// // new handles file data
// const Add = () => {
//     //useState takes values from webpage inputs into json object
//     const [book,setBook] = useState({   // whenever a value is set on webpage, setBook binds to it?? (idk this dude mumbles way too much but checkout his usestate video i guess)
//         // name attributes below must match these
//         title:"",
//         desc:"",
//         price:null,
//         cover:null
//     })

//     const formData = new FormData();

//     const navigate = useNavigate()
//     const url ="http://10.0.0.181:8800/books"
//     const createImage = (newImage) => axios.post(url, newImage); // for img file

//     const createPost = async (post) =>{ // for img file
//         try{
//             await createImage(post);
//         }catch(err){
//             console.log(err.message);
//         }
//     };

//     const handleChange = (e) =>{ // updates whenever input field changes
//         // if(e.target.name === "cover"){
//         //     const file = e.target.files
//         //     // if input is for the cover image, it sets the cover property to the selected file
//         //     setBook((prev) => ({ ...prev, cover: e.target.files[0]}));
//         // }else{// otherwise it updates the corresponding property based on the inputs name
//         //     //whenever input changes, set book
//         //     // this allows fields to update in real-time?
//         //     setBook((prev)=>({ ...prev, [e.target.name]: e.target.value}));
//         //     // syntax here is wild. jesus
//         // }
//         setBook((prev)=>({ ...prev, [e.target.name]: e.target.value}));
//     };

//     const handleSubmit = async (e) =>{ //handles form submission by first converting img to base64
//         e.preventDefault();
//         try{
//             //upload and get base64 data
//             const base64 = await convertToBase64(book.coverFile);
//             // add base64 data to book object
//             const newBook ={...book, cover:base64};

//             //send to back end
//             await axios.post(url,newBook);

//             //clear form
//             setBook({
//                 title:"",
//                 desc:"",
//                 price:'',
//                 cover:'',
//                 coverFile: null,

//             });
//         }catch(error){
//             console.log(error.message);
//         }
//     };

//     const convertToBase64 = (file) => {
//         return new Promise((resolve, reject)=>{
//             const fileReader = new FileReader();
//             fileReader.readAsDataURL(file);
//             fileReader.onload =() =>{
//                 resolve(fileReader.result);
//             };

//             fileReader.onerror = (error) => {
//                 reject(error);
//             };
//         });
//     };

//     const handleFileUpload = (e) =>{
//         const file = e.target.files[0];
//         setBook({...book, coverFile: file});
//     }
//     //will use axios to send data to backend
//     // if you make a "???" cast(?) it should be an async function?
//     const handleClick = async e =>{
//         e.preventDefault() // button default behavior refreshes page
//         try{
//             // create formdata object to send form data including the image file
            
//             formData.append("title", book.title);
//             formData.append("desc", book.desc);
//             formData.append("price", book.price);
//             formData.append("cover", book.cover);
//             console.log("SUCCESS!!!")

//             await axios.post("http://10.0.0.181:8800/books", book,{
//                 headers:{
//                     "Content-Type": "multipart/form-data", // set content type in http header
                    
//                 },
//             });
//             navigate("/"); // use router dom navigate function to return to home page
//         }catch(err){
//             console.log(err);
//         }
//     };

//     console.log("BOOK: ")
//     console.log(book);

//     console.log("FORM DATA: ")
//     console.log(formData)
//     return(


//         <div className='form'>
//             <h1>Add New Book</h1>
            
//             <input type="text" placeholder='title' onChange={handleChange} name="title" /> 

//             <input type="text" placeholder='description' onChange={handleChange} name="desc" />

//             <input type="number" placeholder='price' onChange={handleChange} name="price"/>

//             <input type="file" label="Image" accept=".jpeg, .png, .jpg" onChange={handleFileUpload} name="cover" />

//             <button className="formButton" onClick={handleSubmit}>Add</button>
//         </div>
//     )
// }

export default Add

/*
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Add = () => {
    const [book, setBook] = useState({
        title: "",
        desc: "",
        price: "",
        coverFile: null // Added coverFile state for the image file
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setBook(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', book.title);
            formData.append('desc', book.desc);
            formData.append('price', book.price);
            formData.append('cover', book.coverFile); // Append the image file directly

            await axios.post("http://10.0.0.181:8800/books", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Set the content type
                },
            });

            navigate("/"); // Navigate to home page after successful submission
        } catch (err) {
            console.log(err);
        }
    };

    const handleFileChange = (e) => {
        setBook(prev => ({ ...prev, coverFile: e.target.files[0] }));
    };

    return (
        <div className='form'>
            <h1>Add New Book</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder='Title' onChange={handleChange} name="title" />

                <input type="text" placeholder='Description' onChange={handleChange} name="desc" />

                <input type="number" placeholder='Price' onChange={handleChange} name="price" />

                <input type="file" onChange={handleFileChange} name="cover" accept=".jpeg, .png, .jpg" />

                <button className="formButton" type="submit">Add</button>
            </form>
        </div>
    );
}

export default Add;*/