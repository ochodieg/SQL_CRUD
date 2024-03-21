/*TESTING file upload functionality before adding to other route pages*/
/*theory of op:
    uploads name of image to data base and actual image to 
    images folder. Then uses the file name stored in db to find 
    file in images folder

    currently, a useEffect() calls the '/piss' route GET method
    which returns a json list of all names in cover column
    then I use setData() to manually select which image to show
    
    need to update like Books.jsx to have it all done automatically
    currently, if a picture name is deleted from db, it is still stored in images folder
    */


import React, { useEffect, useState } from 'react'
import axios from 'axios';

function FileUpload(){
    const [file, setFile] = useState(); // whats a hook?
    const [data, setData] = useState([]); // used to display image?

    const handleFile = (e) => {
        console.log(e.target.files[0]);
        setFile(e.target.files[0])  // store first file in array in file const var
        console.log("file is:");
        console.log(file);
    }

//////used to show image after upload
    useEffect(() =>{
        axios.get("http://10.0.0.181:8800/piss")// calls /piss GET which returns json of cover column 
        .then(res => {
            setData(res.data[1]) //this is an array of cover names in the books table, gives error if out of bounds
            // index picks which image to show
            console.log( res.data) // res.data is a list of cover column in table
            /* this caused issues. using "console.log(res.data)" to troubleshoot
            i saw that this would print "welcome Home!" meaning that "res.data[0]" returned 
            'w' meaning " <img src={`http://10.0.0.181:8800/images/` + data.image} alt=""/>"
            would search for an image named 'w' in images folder causing "data.image" to be undefined
            this is because the address that axios.get used ending in 8800/, 
            already has a GET route set for it
            in the code:
                app.get("/", (req,res)=>{
                res.json("welcome Home!")
                }) 
            in the index.js file*/
        })
        .catch(err => console.log(err));
    },[])
////

    const handleUpload = () =>{
        const formData = new FormData();
        formData.append('image',file);
        console.log("file data is:")
        console.log(file);
        axios.post("http://10.0.0.181:8800/upload", formData)
        .then(res => {
            console.log(res)
            if(res.data.Status === "added with image successfully"){
                console.log("uploaded to db successfully")
               //console.log("form data is:")
                //console.log(formData);
            } else{
                console.log("failed to upload to db :<")
            }
        })
        .catch(err => console.log(err));
    }



    return(
        <div className='container'>
            <input type='file' onChange={handleFile}/>
            <button onClick={handleUpload}>upload</button>
            <br/>

            {/*conditional rendering to check if data is defined*/}
            {console.log(data)}
            {data && <img src={`http://10.0.0.181:8800/images/` + data.cover} alt=""/>}
            {console.log("picture is: " + data.cover)}
            {/*data.image dont work cause my table column is 'cover'
            why does no one use meaningful variable names with js jfc
            this currently only prints the first img in the table */}
            
        </div>
    )
}

export default FileUpload