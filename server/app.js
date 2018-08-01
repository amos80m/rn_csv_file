const express = require('express');
const PORT = process.env.PORT || 3000;
const fs = require('fs');
const csv = require("fast-csv");
const app = express();
app.use(express.static('./files/'))
const bodyParser = require('body-parser')
app.use(bodyParser.json());

let dataIn = []

//set initial data
let initDataInArray = (() => {
    const rs = fs.createReadStream(__dirname + '/files/data.csv')
    rs.pipe(csv())
    .on('data',(data,index)=>{
       dataIn.push(data)
    })
    .on('end',(data)=>{
        console.log('done...',dataIn)
    })
})()

app.post('/update',(req,res)=>{
    let {value, row, column} = req.body;
    // if(value && row && column){}res.send({sucsess:false,data:{message:'values missing?',values:req.body}})
    const ws = fs.createWriteStream(__dirname + '/files/data.csv')
    dataIn[row][column] = value
    csv.write(dataIn,{headers: true})
    .pipe(ws)
    res.send({sucsess:true,data:dataIn})
})

app.get('/read', (req, res) => {
    res.send({data:dataIn})
});

app.get('/download', function(req, res){
    var file = __dirname + '/files/data.csv';
    res.download(file); // Set disposition and send it.
  });

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))