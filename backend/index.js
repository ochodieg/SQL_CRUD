import express from "express";
import mysql   from "mysql";
import cors   from "cors";

const app = express()

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"sTzxpg9ly!",  // must be set to sql root@localhost password 
    database:"test"
})

app.use(cors());

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



app.post("/books", (req,res)=>{ // user posts, query variable, q, inserts post data using sql
    const q = "INSERT INTO books (`title`,`desc`,`price`,`cover`) VALUES (?)"   //question mark adds end security??
    //const values = ["title from backend", "desc from backend", "cover pic from backend"]    // these values will be retrieved from user input
    const values = [    // now instead hardcoded strings, we take values from a json object in the http post body of the user requests
        req.body.title,
        req.body.desc,
        req.body.price,
        req.body.cover
    ]


    db.query(q,[values],(err,data)=>{   // process q return and values, then return based on hit/miss?
        if(err) return res.json("error message: "+ err) // if error is returned, return err msg
        console.log(data)
        return res.json("book has been created successfully!")   // if no error, return data in json format
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

app.put("/books/:id", (req,res)=>{   // same as above but updates with put method instead
    const bookId = req.params.id;   
    const query = "UPDATE books SET `title`=?, `desc`=?, `price`=?, `cover`=? WHERE id =?"; // fields to update
    
    const values = [    // now instead hardcoded strings, we take values from a json object in the http post body of the user requests
        req.body.title,
        req.body.desc,
        req.body.price,
        req.body.cover
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