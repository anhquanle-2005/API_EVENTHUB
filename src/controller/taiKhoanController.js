const tk = require('../model/taiKhoan');
class taiKhoanController{
    async index(req, res){
        try {
            const data = req.body;
            const taikhoan = await tk.Login(data);
            if (taikhoan && taikhoan.length > 0) {
                res.json({ taikhoan: taikhoan[0] }); // <--- Lấy phần tử đầu tiên ra khỏi mảng
            } else {
                res.status(401).json({ message: "Sai tài khoản" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({error:'Lỗi server'});
        }
    }
}
module.exports = new taiKhoanController();