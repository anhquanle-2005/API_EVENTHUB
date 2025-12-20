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
            const getSK = await sk.getSKSapToi();
            res.json({getSK})
        } catch (err) {
             console.error(err);
            res.status(500).json({error: 'Lỗi server'});
        }
    }
    async dangKySuKien(req, res){
        try {
            const data = req.body;
            await sk.dangKySuKien(data);
            res.status(200).json({message: 'Luuw thành công'});
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Lỗi server'});
        }
    }
    async timSuKien(req, res){
        try {
            const data = req.body;
            const sukiencantim = await sk.timSuKien(data);
            res.json({sukiencantim});
        } catch (error) {
            console.error('Lỗi server: ',error);
            res.status(500).json({error: 'Lỗi server'});
        }
    }
}
module.exports = new suKienController();