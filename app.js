//import library express.js dan library lain yg diperlukan
const express=require('express');
const fs=require('fs'); 
const validator = require('validator');

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

//referensi: http://expressjs.com/en/4x/api.html#req.body
//middleware untuk body-parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Baca berkas.json secara asinkronus
//method ini mengembalikan sebuah Promise yang akan di resolve menjadi konten dari file yg dibaca
const loadContact=()=>{
    const file=fs.readFileSync(dataPath,'utf8');
    return JSON.parse(file);
}

const loadContactAsync=()=>{
    return new Promise((resolve,reject)=>{
        fs.readFile(dataPath,'utf8',(err,data)=>{
            if(err){
                reject(err);
            }else{
                resolve(JSON.parse(data));
            }
        });
    });
}

const saveContact=(contacts)=>{
    fs.writeFileSync(dataPath,JSON.stringify(contacts));//tulis data yang baru ke dalam berkas .json
    console.log('Terimakasih sudah memasukkan data!');
}

const addContact=(newContact)=>{
    //chalenge: kalo email sama mobile nya salah, tampilkan kedua pesan error nya.
    //Selama ini kan salah satu doang.
    if(!validator.isMobilePhone(newContact.mobile,'id-ID')){//validasi nomor telepon
        console.log("wrong phone number format!");
        //rl.close();
        return;// di return supaya ketika nomor telfon nya salah, tidak dimasukkan ke contacts
    }
    if(newContact.email){//email tidak wajib diisi, jadi harus diperiksa dulu udah diisi atau belum
        if(!validator.isEmail(newContact.email)){//validasi email
            console.log("wrong email format!");
            //rl.close();
            return;// di return supaya ketika email nya salah, tidak dimasukkan ke contacts
        }
    }
    const contacts = loadContact();
    let duplicate = contacts.find(contact=>{return contact.name===newContact.name});
        if(duplicate){
            console.log('Contact already recorded!');
            return false;
        }
        contacts.push(newContact);//tambahkan nama,nomor telepon, dan email yang baru saja dibaca dari cmd
        saveContact(contacts);
}

//fungsi untuk mencari kontak dengan nama tertentu
const getContact=(contacts,name)=>{
    //periksa apakah kontaknya masih kosong atau udah isi
    if(contacts.length===0){
        console.log("No contacts!");//kedepannya ini mungkin diganti jadi throw
        return false;
    }

    //cari kontak dengan nama === name
    const found = contacts.find(contact=>{//reference ke objek contact dengan [name] tertentu
        return contact.name.toLowerCase()===name.toLowerCase();
    })
    return found;
}

const updateContact=(oldName,newName,newMobile,newEmail)=>{
    
}

const deleteContact=(name)=>{
    let contacts = loadContact();//baca seluruh kontak yang tersimpan di file contacts.json
    const found = getContact(contacts,name);//cari kontak yang ingin dihapus
    
    if(!found){//jika kontak yang akan dihapus tidak ditemukan
        console.log("Contact not found!");//bisa ganti jadi throw.
        return false;
    }else{//sebaliknya...
        contacts=contacts.filter(contact=>{//delete dari daftar kontak
            return contact.name.toLowerCase() !=name.toLowerCase();
        });
        fs.writeFileSync(dataPath,'[]');//kosongkan file contacts.json dengan cara menimpa isinya dengan array kosong
    }

    fs.writeFileSync(dataPath,JSON.stringify(contacts));//tulis data kontak yang baru ke dalam berkas .json
    console.log(`Contact ${name} has been deleted!`);//kirimkan pesan konfirmasi ke pengguna
}

//route ke halaman contact
app.get('/contact',(req,res)=>{
    const contacts = loadContact();
    // console.log(contacts);
    // loadContactAsync().then(contacts=>console.log(contacts));
    res.render(__dirname+'/views/contact.ejs',{contacts});
})

//route yang dipanggil ketika menambahkan kontak baru
//POST tidak mengirimkan parameter melalui URL!!
app.post('/updateContact',(req,res)=>{
    addContact(req.body);
    const contacts = loadContact();
    res.render(__dirname+'/views/contact.ejs',{contacts});
})

//jika akses selain route selain yang disediakan diatas, tampilkan error 404
app.use('/',(req,res)=>{//todo: cari cara buat nampilin html 404 not found.
    res.writeHead(404);//buat status code
    res.write('Error: page not found');
    res.end();
})

app.listen(port,()=>{
    console.log(`Example app listening on port ${port}`);
})