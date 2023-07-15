import fs from 'fs'

fs.readFile('users.json', 'utf8',(err, data)=>{
    const jsonData = JSON.parse(data);
})