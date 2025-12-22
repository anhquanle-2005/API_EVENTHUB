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
    async search(req, res){
        try {
            const keyword = String(req.query.q || '').trim();
            const time = String(req.query.time || '').trim().toLowerCase();
            let tags = [];

            if (req.query.tag) {
                if (Array.isArray(req.query.tag)) {
                    tags = req.query.tag.map(tag => String(tag).trim()).filter(Boolean);
                } else {
                    tags = String(req.query.tag).split(',').map(tag => tag.trim()).filter(Boolean);
                }
            } else if (req.query.tags) {
                tags = String(req.query.tags).split(',').map(tag => tag.trim()).filter(Boolean);
            }

            if (time && !['today', 'tomorrow', 'week'].includes(time)) {
                return res.status(400).json({error: 'time khong hop le'});
            }

            const getSK = await sk.searchSK(keyword, tags, time);
            res.json({getSK});
        } catch (err) {
            console.error(err);
            res.status(500).json({error: 'L Ż-i server'});
        }
    }
}
module.exports = new suKienController();
