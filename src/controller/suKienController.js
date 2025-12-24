const sk = require('../model/suKien');

class SuKienController {

    /* ===================== USER ===================== */

    async index(req, res) {
        try {
            const getSK = await sk.getSK();
            res.json({ getSK });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Lỗi server' });
        }
    }

    async getSKSapToi(req, res) {
        try {
            const getSK = await sk.getSKSapToi();
            res.json({ getSK });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Lỗi server' });
        }
    }

    // ✅ GIỮ LOGIC SEARCH CŨ (keyword + tags + time)
    async search(req, res) {
        try {
            const keyword = String(req.query.q || '').trim();
            const time = String(req.query.time || '').trim().toLowerCase();
            let tags = [];

            if (req.query.tag) {
                if (Array.isArray(req.query.tag)) {
                    tags = req.query.tag.map(t => String(t).trim()).filter(Boolean);
                } else {
                    tags = String(req.query.tag).split(',').map(t => t.trim()).filter(Boolean);
                }
            } else if (req.query.tags) {
                tags = String(req.query.tags).split(',').map(t => t.trim()).filter(Boolean);
            }

            if (time && !['today', 'tomorrow', 'week'].includes(time)) {
                return res.status(400).json({ error: 'time không hợp lệ' });
            }

            const getSK = await sk.searchSK(keyword, tags, time);
            res.json({ getSK });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Lỗi server' });
        }
    }

    async dangKySuKien(req, res) {
        try {
            const data = req.body;
            await sk.dangKySuKien(data);
            res.status(200).json({ message: 'Lưu thành công' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    }

    async timSuKien(req, res) {
        try {
            const data = req.body;
            const sukiencantim = await sk.timSuKien(data);
            res.json({ sukiencantim: sukiencantim[0] });
        } catch (error) {
            console.error('Lỗi server:', error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    }

    async uploadMinhChung(req, res) {
        try {
            const id = req.params.id;
            const data = req.body;
            await sk.uploadMinhChung(id, data);
            res.status(200).json({ message: 'Lưu thành công' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    }

    /* ===================== ADMIN ===================== */

    async adminList(req, res) {
        try {
            const data = await sk.getAllForAdmin();
            res.json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    }

    async participants(req, res) {
        try {
            const maSK = parseInt(req.params.maSK, 10);
            const data = await sk.getParticipants(maSK);
            res.json({ participants: data });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    }

    async updateParticipantStatus(req, res) {
        try {
            const maSK = parseInt(req.params.maSK, 10);
            const maTK = parseInt(req.params.maTK, 10);
            const { trangThai, lyDo } = req.body;

            const ok = await sk.updateParticipantStatus(maSK, maTK, trangThai, lyDo);
            if (ok) res.json({ success: true });
            else res.status(400).json({ error: 'Cập nhật thất bại' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    }

    async all(req, res) {
        try {
            const data = await sk.getAll();
            res.json({ getSK: data });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    }

    async cancelRegistration(req, res) {
        try {
            const maSK = parseInt(req.params.maSK, 10);
            const maTK = parseInt(req.params.maTK, 10);

            const ok = await sk.huyDangKySuKien(maTK, maSK);
            if (ok) res.json({ success: true });
            else res.status(400).json({ error: 'Hủy thất bại' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    }

    async updateEvent(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const data = req.body;

            const ok = await sk.updateEvent(id, data);
            if (ok) res.json({ success: true });
            else res.status(400).json({ error: 'Cập nhật thất bại' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Lỗi server' });
        }
    }
    async suKienDaThamGia(req, res) {
        try {
            const data = req.body;
            const trangThai = await sk.suKienDaThamGia(data);
            console.log(trangThai[0]);
            res.json({trangThai:trangThai[0]});
        } catch (error) {
            console.error("Lỗi server: ",error);
            res.status(500).json({error: 'Lỗi server' })
        }
    }
}

module.exports = new SuKienController();
