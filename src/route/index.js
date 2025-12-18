const suKien = require('./sukien');
const taiKhoan = require('./taiKhoan');
function router(app){
    app.use('/sukien',suKien);
    app.use('/taikhoan',taiKhoan);
}
module.exports = router;