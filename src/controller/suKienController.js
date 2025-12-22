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
            res.status(200).json({message: 'Lưu thành công'});
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Lỗi server'});
        }
    }
    async timSuKien(req, res){
        try {
            const data = req.body;
            console.log(data);
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
    async createSuKien(req, res) {
    try {
        const data = req.body;
        
        // Kiểm tra file ảnh poster (tương tự logic updateAvatar bạn đã xem)
        if (!req.file) {
            return res.status(400).json({ error: 'Vui lòng upload ảnh poster' });
        }
        
        // Lấy URL ảnh từ Cloudinary
        data.Poster = req.file.path;

        // Gọi hàm từ model để lưu vào Database
        await sk.createSuKien(data);
        
        res.status(201).json({ message: 'Tạo sự kiện thành công!' });
    } catch (error) {
        console.error('Lỗi trong controller createSuKien:', error);
        res.status(500).json({ error: 'Lỗi server khi tạo sự kiện' });
    }
}
}

module.exports = new suKienController();