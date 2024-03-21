/*backend code*/
//TODO: delete files from public images during delete route

import express from "express";
import mysql   from "mysql";
import cors   from "cors";

/*temp imports for file upload test*/
import multer from 'multer'
import path from 'path'


const app = express()

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"sTzxpg9ly!",  // must be set to sql root@localhost password 
    database:"test"
})

/*testing file upload functionality*/
app.use(cors());
app.use(express.static('public')); // alows server to access imgages with GET
// now we can view image directly from browser as such:
// 'http://localhost:8800/images/image_1710895797975.png'
// using the image name given in the images folder

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{ //callback stores images in images folder
        cb(null, './public/images') //firs arg is header? second is route?
    },            // where file is stored. tutor has index and public folers in front-end?
    filename: (req, file, cb) =>{
        cb(null, file.fieldname + "_"+ Date.now() + path.extname(file.originalname));  // handleUpload function file var from FileUpload?
                                                    // file extension
    }
})

const upload = multer ({
    storage: storage // const storage from above
})

//upload to sql db (seems to only add image name and not actual image data)
app.post('/upload', upload.single('image'),(req, res) =>{
    console.log("THE REQUEST!!!!");
    console.log(req);
    console.log(req.file);
    const image = req.file.filename; // file invocation on req is a multer function

    const testUpdate = "INSERT INTO books (`title`,`desc`,`price`,`cover`) VALUES (?)"   //question mark adds end security??
    const values = [    // now instead hardcoded strings, we take values from a json object in the http post body of the user requests
        "req.body.title",
        "req.body.desc",
        0,
        image
    ]

    const sql = "UPDATE books SET cover = ?";


    db.query(testUpdate, [values], (err, result) => {
        if(err) return req.json({Message: "Error"});
        return res.json({Status: "added with image successfully"});
    })
})

app.get("/piss", (req,res)=>{
    const sql = "SELECT cover FROM books";
    db.query(sql, (err,result) =>{
        if(err) return res.json("errrroorrr");
        return res.json(result);    // returns a json object/list? of cover column in table
    })

})
/*testing file upload functionality*/






app.get("/", (req,res)=>{
    res.json("welcome Home!")
})




//express server middleware to handle data being sent to express server from http body
app.use(express.json()) // this allows us to send any json file "using a client"? from then client?

app.use(cors()) // this allows the backend server to let the app use the backend API?

/*
if authetication error, password doesn't match sql root pass
recall: $ ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';

NOTE: how does app know where to access sql database? I didn't save in workbench, so
      does it just use the mysql instance running on this machine?

*/
app.get("/books", (req,res)=>{  // request to /books route
    const q = "SELECT * FROM books" // selecting all from books table (SQL syntax)
    db.query(q,(err,data)=>{        // query q, process what it returns
        if(err) return res.json("error message: "+ err) // if error is returned, return err msg
        return res.json(data)   // if no error, return data in json format
    })
})


// //UPLOAD BOOK
// app.post("/books", (req,res)=>{ // user posts, query variable, q, inserts post data using sql
//     const q = "INSERT INTO books (`title`,`desc`,`price`,`cover`) VALUES (?)"   //question mark adds end security??
//     //const values = ["title from backend", "desc from backend", "cover pic from backend"]    // these values will be retrieved from user input
//     const values = [    // now instead hardcoded strings, we take values from a json object in the http post body of the user requests
//         req.body.title,
//         req.body.desc,
//         req.body.price,
//         req.body.cover
//     ]


//     db.query(q,[values],(err,data)=>{   // process q return and values, then return based on hit/miss?
//         if(err) return res.json("error message: "+ err) // if error is returned, return err msg
//         console.log(data)
//         return res.json("book has been created successfully!")   // if no error, return data in json format
//         // without frontend/forms, get method can be tested with workbench
//     })
// })

//UPLOAD BOOK
app.post("/books", upload.single('image'),(req, res) =>{ // user posts, query variable, q, inserts post data using sql
    // these 2 are crucial since upload.single('image') expects the uploaded file
    // to be in a field named 'image'
    
    //const poop = req[0];
    //console.log('poop');
    //console.log(poop);
    console.log("this is: ");
    console.log(req);
    const uploadedFile = req.file;  // access the uploaded file
    const book = JSON.parse(req.body.document);//"document" is the key i chose to match and access data 

    //FILE UPLOAD vars
    console.log(req.file);
    const image = uploadedFile.filename;

    const q = "INSERT INTO books (`title`,`desc`,`price`,`cover`) VALUES (?)"   //question mark adds end security??
    //const values = ["title from backend", "desc from backend", "cover pic from backend"]    // these values will be retrieved from user input
    const values = [    // now instead hardcoded strings, we take values from a json object in the http post body of the user requests
        book.title,
        book.desc,
        book.price,
        image
    ]


    db.query(q,[values],(err,data)=>{   // process q return and values, then return based on hit/miss?
        if(err) return res.json("error message: "+ err) // if error is returned, return err msg
        console.log(data)
        return res.json("book and image created successfully!")   // if no error, return data in json format
        // without frontend/forms, get method can be tested with workbench
    })
})


app.delete("/books/:id", (req,res)=>{   // to know what to delete, we need to know the id of the object, hence the anon method retrieves that info
    const bookId = req.params.id;    // params represents route in first arg
    const query = "DELETE FROM books WHERE id = ?"  // the question mark is a placeholder for what db.query returns?
    // or maybe not since Books.jsx delete button anon function calls handleDelete to obtain id?
    db.query(query, [bookId], (err, data)=>{
        if(err) return res.json("error message: "+ err) // if error is returned, return err msg
        //console.log(data)
        return res.json("book has been deleted successfully!")   // if no error, return data in json format
    })

})


// //UPDATE BOOK
// app.put("/books/:id", (req,res)=>{   // same as above but updates with put method instead
//     const bookId = req.params.id;   
//     const query = "UPDATE books SET `title`=?, `desc`=?, `price`=?, `cover`=? WHERE id =?"; // fields to update
    
//     const values = [    // now instead hardcoded strings, we take values from a json object in the http post body of the user requests
//         req.body.title,
//         req.body.desc,
//         req.body.price,
//         req.body.cover
//     ]
    

//     db.query(query, [...values, bookId], (err, data)=>{ // call all the values in addition to bookId
//         if(err) return res.json("error message: "+ err) 
//         //console.log(data)
//         return res.json("book has been updated successfully!")   
//     })

// })


//UPDATE BOOK
app.put("/books/:id" , upload.single('image'), (req,res)=>{   // same as above but updates with put method instead
    // gives bad response error code 500 if no image is selected
    const uploadedFile = req.file;  // access the uploaded file
    
    console.log(JSON.parse(req.body.document));

    const book = JSON.parse(req.body.document);     
    

    console.log(book);
    console.log(book.params);

    const bookId = JSON.parse(req.body.id); 
    // dont know why I cant access bookId from params anymore
    // print statement shows it isnt there, only fix was stringifying   
    console.log(bookId);
    const image = uploadedFile.filename;
    const query = "UPDATE books SET `title`=?, `desc`=?, `price`=?, `cover`=? WHERE id =?"; // fields to update
    // if (input fields empty) -> keep the same
    const values = [    // now instead hardcoded strings, we take values from a json object in the http post body of the user requests
        book.title,
        book.desc,
        book.price,
        image
    ]
    

    db.query(query, [...values, bookId], (err, data)=>{ // call all the values in addition to bookId
        if(err) return res.json("error message: "+ err) 
        //console.log(data)
        return res.json("book has been updated successfully!")   
    })

})



app.listen(8800, ()=>{
    console.log("Connected to backend!")
})