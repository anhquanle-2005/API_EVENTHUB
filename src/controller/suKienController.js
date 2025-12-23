const sk = require('../model/suKien');

class SuKienController {
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

    async all(req, res) {
        try {
            const data = await sk.getAll();
            res.json({ getSK: data });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Loi server' });
        }
    }

    async cancelRegistration(req, res) {
        try {
            const maSK = parseInt(req.params.maSK, 10);
            const maTK = parseInt(req.params.maTK, 10);
            const ok = await sk.huyDangKySuKien(maTK, maSK);
            if (ok) res.json({ success: true });
            else res.status(400).json({ error: 'Huy that bai' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Loi server' });
        }
    }

    async updateEvent(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const data = req.body;
            const ok = await sk.updateEvent(id, data);
            if (ok) res.json({ success: true });
            else res.status(400).json({ error: 'Cap nhat that bai' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Loi server' });
        }
    }
}

module.exports = new SuKienController();
