const sk = require('../model/suKien');

class suKienController{
    async index(req, res){
        try {
            const getSK = await sk.getSK();
            res.json({getSK});
        } catch (err) {
            console.error(err);
            res.status(500).json({error: 'L??-i server'});
        }
    }
    async getSKSapToi(req, res){
        try {
            const getSK = await sk.getSKSapToi();
            res.json({getSK})
        } catch (err) {
             console.error(err);
            res.status(500).json({error: 'L??-i server'});
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
            res.status(500).json({error: 'L??-i server'});
        }
    }
    async dangKySuKien(req, res){
        try {
            const data = req.body;
            await sk.dangKySuKien(data);
            res.status(200).json({message: 'L??u thA?nh cA'ng'});
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'L??-i server'});
        }
    }
    async timSuKien(req, res){
        try {
            const data = req.body;
            console.log(data);
            const sukiencantim = await sk.timSuKien(data);
            res.json({sukiencantim : sukiencantim[0]});
        } catch (error) {
            console.error('L??-i server: ',error);
            res.status(500).json({error: 'L??-i server'});
        }
    }
    async uploadMinhChung(req, res){
        try {
            const id = req.params.id;
            const data = req.body;
            await sk.uploadMinhChung(id,data);
            res.status(200).json({message: 'L??u thA?nh cA'ng'});
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'L??-i server'});
        }
    }
}
module.exports = new suKienController();
