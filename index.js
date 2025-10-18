const express = require('express');
const router = require('./src/route/index')
const DB = require('./src/db/index');
const app = express();
DB.connectDB();
router(app);
const port=5000;
app.listen(port,()=>{
    console.log(`Ứng dụng đang lắng nghe trên cổng ${port}`);
})