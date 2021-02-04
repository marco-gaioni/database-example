const express = require("express")
const app = new express()
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./clients.db3')
const port = 8080

app.use(express.json())


db.serialize( () => {
    db.run("CREATE TABLE IF NOT EXISTS clients (name TEXT, pwd TEXT)")

    for(let i=0; i<10; i++){
        db.run("INSERT INTO clients (name, pwd) VALUES (?,?)", `tizio ${i+1}`,`caio ${i+1}`)
    }
})

app.post("/login" , (req,res) => {
    const { name, pwd } = req.body
    db.get("SELECT * FROM clients WHERE name = ? AND pwd = ?", name, pwd, (err,row) => {
        if (row){
            res.status(200).json({ ok : true})
        }else{
            res.status(401).json({ ok : false})
        }
    })
})

app.listen(port , () => console.log(`app listening on port ${port}`))