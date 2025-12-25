const pf = require('../model/profile');
class profileController{
    async getUserProfile(req,res){
        try {
            const {userId} = req.params;
            if(!userId){
                return res.status(400).json({error: 'Thiếu userId'});
            }
            const profile = await pf.getUserProfileById(userId);
            if(!profile){
                return res.status(404).json({error: 'Không tìm thấy hồ sơ người dùng'});
            }
            res.status(200).json({profile});
        } catch (error) {
            console.error('Lỗi trong controller getUserProfile:', error);
            res.status(500).json({error: 'Lỗi server' });
        }
    }
    async getSuKienSapThamGiaByUserId(req,res){
        try {
            const {userId} = req.params;
            if(!userId){
                return res.status(400).json({error: 'Thiếu userId'});
            }
            const suKien = await pf.getSuKienSapThamGiaByUserId(userId);
            res.status(200).json({suKien});
        } catch (error) {
            console.error('Lỗi trong controller getSuKienSapThamGiaByUserId:', error);
            res.status(500).json({error: 'Lỗi server' });
        }

    }
    async getSuKienDaThamGiaByUserId(req,res){
        try {
            const {userId} = req.params;
            if(!userId){
                return res.status(400).json({error: 'Thiếu userId'});
            }
            const suKien = await pf.getSuKienDaThamGiaByUserId(userId);
            res.status(200).json({suKien});
        } catch (error) {
            console.error('Lỗi trong controller getSuKienSapThamGiaByUserId:', error);
            res.status(500).json({error: 'Lỗi server' });
        }
    }
    async updateAvatar(req,res){
        try {
            const {userId} = req.params;
            if(!req.file){
            return res.status(400).json({ error: 'Vui lòng chọn file ảnh' });         
            }   
            const newAvatarUrl = req.file.path; // Lấy URL ảnh từ Cloudinary
            const updatedUser = await pf.updateUserAvatar(userId, newAvatarUrl);
            if(!updatedUser){
                return res.status(404).json({ error: 'Không tìm thấy người dùng' });
            }
            res.status(200).json({ 
                message: 'Cập nhật thành công',
                taikhoan: updatedUser 
            });
        } catch (error) {
            console.error('Lỗi trong controller updateAvatar:', error);
            res.status(500).json({ error: 'Lỗi server khi upload ảnh' });
        }

    }
}
module.exports = new profileController();