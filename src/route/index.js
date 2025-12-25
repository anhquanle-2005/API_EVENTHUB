const suKien = require('./sukien');
const taiKhoan = require('./taiKhoan');
const profile = require('./profile');

function router(app){
    app.use('/sukien',suKien);
    app.use('/taikhoan',taiKhoan);
    app.use('/profile', profile);

}
module.exports = router;