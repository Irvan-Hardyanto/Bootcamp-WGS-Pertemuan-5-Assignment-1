//import library express.js dan library lain yg diperlukan
const express=require('express');
const fs=require('fs'); 

//inisialisasi objek express.js
const app= express();
const port = 3000;//port number

//direktori dan nama file kontak.
const dirPath='data';//bisa diimprove lebih lanjut
const dataPath='data/contacts.json';//bisa diimprove lebih lanjut

//periksa apakah folder 'data' sudah dibuat
if(!fs.existsSync(dirPath)){
    //jika belum, maka buat folder data
    fs.mkdirSync(dirPath);
}

//periksa apakah berkas contacts.json sudah dibuat
if(!fs.existsSync(dataPath)){
    //jika belum, maka buat file contacts.json
    fs.writeFileSync(dataPath,'[]');
}

//set view engine menggunakan ejs
app.set('view engine', 'ejs');

//Baca berkas.json secara asinkronus
//method ini mengembalikan sebuah Promise yang akan di resolve menjadi konten dari file yg dibaca
const loadContact=()=>{
    return new Promise((resolve,reject)=>{
        //method readFile bersifat asinkronus
        //sehingga memerlukan sebuah callback
        fs.readFile(dataPath,(err,data)=>{
            if(err){
                reject(err);
            }else{
                resolve(JSON.parse(data));
            }
        })
    })
}
app.get('/',(req,res)=>{

})

app.get('/contact',(req,res)=>{
    loadContact().then(contacts=>{
        res.render(__dirname+'/views/contact.ejs',{contacts});
    });
})

app.listen(port,()=>{
    console.log(`Example app listening on port ${port}`);
})