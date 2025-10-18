const sk = require('../model/suKien');

class suKienController{
    async index(req, res){
        try {
            const getSK = await sk.getSK();
            res.json({getSK});
        } catch (err) {
            console.error(err);
            res.status(500).json({error: 'Lỗi server'});
        }
    }
    async getSKSapToi(req, res){
        try {
            const getsksaptoi = await sk.getSKSapToi();
            res.json({getsksaptoi})
        } catch (err) {
             console.error(err);
            res.status(500).json({error: 'Lỗi server'});
        }
    }
}
module.exports = new suKienController();