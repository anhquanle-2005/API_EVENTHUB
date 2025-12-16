const express = require('express');

const router = require('./src/route/index')
const DB = require('./src/db/index');
const app = express();
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
DB.connectDB();
router(app);
const port=3000;
app.listen(port,()=>{
    console.log(`Ứng dụng đang lắng nghe trên cổng ${port}`);
})