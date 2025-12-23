const sk = require('../model/suKien');

class suKienController {
    async index(req, res) {
        try {
            const getSK = await sk.getSK();
            res.json({ getSK });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Loi server' });
        }
    }

    async getSKSapToi(req, res) {
        try {
            const getSK = await sk.getSKSapToi();
            res.json({ getSK });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Loi server' });
        }
    }

    async dangKySuKien(req, res) {
        try {
            const data = req.body;
            await sk.dangKySuKien(data);
            res.status(200).json({ message: 'Luu thanh cong' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Loi server' });
        }
    }

    async timSuKien(req, res) {
        try {
            const data = req.body;
            const sukiencantim = await sk.timSuKien(data);
            res.json({ sukiencantim: sukiencantim[0] });
        } catch (error) {
            console.error('Loi server: ', error);
            res.status(500).json({ error: 'Loi server' });
        }
    }

    async uploadMinhChung(req, res) {
        try {
            const id = req.params.id;
            const data = req.body;
            await sk.uploadMinhChung(id, data);
            res.status(200).json({ message: 'Luu thanh cong' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Loi server' });
        }
    }

    async adminList(req, res) {
        try {
            const data = await sk.getAllForAdmin();
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Loi server' });
        }
    }

    async participants(req, res) {
        try {
            const maSK = req.params.maSK;
            const data = await sk.getParticipants(maSK);
            res.json({ participants: data });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Loi server' });
        }
    }

    async updateParticipantStatus(req, res) {
        try {
            const maSK = parseInt(req.params.maSK, 10);
            const maTK = parseInt(req.params.maTK, 10);
            const { trangThai, lyDo } = req.body;
            const ok = await sk.updateParticipantStatus(maSK, maTK, trangThai, lyDo);
            if (ok) {
                res.json({ success: true });
            } else {
                res.status(500).json({ error: 'Cap nhat that bai' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Loi server' });
        }
    }
    async updateSuKien(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            if (!id) {
                return res.status(400).json({ error: 'Invalid id' });
            }
            const data = req.body;
            if (req.file) {
                data.Poster = req.file.path;
            }
            const ok = await sk.updateSuKien(id, data);
            if (ok) {
                res.json({ success: true });
            } else {
                res.status(404).json({ error: 'Khong tim thay su kien' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Loi server' });
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
