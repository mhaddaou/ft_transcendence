import fs from 'fs'

fs.readFile('users.json', 'utf8',(err, data)=>{
    if (err){
        console.error(err)
    }
    const jsonData = JSON.parse(data);
})