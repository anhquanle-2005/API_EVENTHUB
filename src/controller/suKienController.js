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
            res.json({getSK});
        } catch (err) {
            console.error(err);
            res.status(500).json({error: 'Lỗi server'});
        }
    }
    async dangKySuKien(req, res){
        try {
            const data = req.body;
            await sk.dangKySuKien(data);
            res.status(200).json({message: 'Lưu thành công'});
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Lỗi server'});
        }
    }
    async timSuKien(req, res){
        try {
            const data = req.body;
            const sukiencantim = await sk.timSuKien(data);
            res.json({sukiencantim : sukiencantim[0]});
        } catch (error) {
            console.error('Lỗi server: ',error);
            res.status(500).json({error: 'Lỗi server'});
        }
    }
    async uploadMinhChung(req, res){
        try {
            const id = req.params.id;
            const data = req.body;
            await sk.uploadMinhChung(id,data);
            res.status(200).json({message: 'Lưu thành công'});
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Lỗi server'});
        }
    }
    async adminList(req, res){
        try {
            const data = await sk.getAllForAdmin();
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Lỗi server'});
        }
    }
    async participants(req, res){
        try {
            const maSK = req.params.maSK;
            const data = await sk.getParticipants(maSK);
            res.json({participants: data});
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Lỗi server'});
        }
    }
}
module.exports = new suKienController();
