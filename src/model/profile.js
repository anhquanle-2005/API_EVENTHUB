const {sql,connectDB}= require('../db/index');
class Profile {
    async getUserProfileById(userId){
        try {
            const poolConnection = await connectDB();
            const result = await poolConnection.request()
            .input('UserId',sql.Int,userId)
            .query('SELECT MaTK,MaSV,HoTen AS TenTK,Khoa,AVT,Email,DiemTichLuy FROM TaiKhoan WHERE MaTK = @UserId');
            return result.recordset[0];
        } catch (err) {
            console.error("Lỗi database trong getUserProfileById:", err);
            throw err;            
        }
    }
    async getSuKienSapThamGiaByUserId(userId){
        try {
            const poolConnection = await connectDB();
            const result = await poolConnection.request()
            .input('UserId',sql.Int,userId)
            .query(`
                    SELECT 
                        SK.MaSK, 
                        SK.TenSK, 
                        SK.Poster, 
                        SK.TrangThai,
                        FORMAT(SK.ThoiGianBatDau, 'yyyy-MM-dd HH:mm:ss') AS ThoiGianBatDau, -- Format ngày
                        SK.CoSo, 
                        SK.DiaDiem,
                        0 AS DiemCong 
                    FROM SuKien SK
                    JOIN ThamGiaSuKien TG ON SK.MaSK = TG.MaSK 
                    WHERE 
                        TG.MaTK = @UserID 
                        AND TG.DaCongDiem = 0 
                `);
            return result.recordset;
        } catch (error) {
            console.error("Lỗi database trong getSuKienSapThamGiaByUserId:", error);
            throw error;
        }
    }
    async getSuKienDaThamGiaByUserId(userId){
        try {
            const poolConnection = await connectDB();
            const result = await poolConnection.request()
            .input('UserId',sql.Int,userId)
            .query(`
                    SELECT 
                        SK.MaSK, 
                        SK.TenSK, 
                        SK.Poster, 
                        N'Đã tích lũy' AS TrangThai,
                        FORMAT(SK.ThoiGianBatDau, 'yyyy-MM-dd HH:mm:ss') AS ThoiGianBatDau,
                        SK.CoSo, 
                        SK.DiaDiem,
                        SK.DiemCong 
                    FROM SuKien SK
                    JOIN ThamGiaSuKien TG ON SK.MaSK = TG.MaSK
                    WHERE 
                        TG.MaTK = @UserID 
                        AND TG.DaCongDiem = 1 
                `);
                return result.recordset;
        } catch (error) {
            console.error("Lỗi database trong getSuKienDaThamGiaByUserId:", error);
            throw error;
        }
    }
}
module.exports = new  Profile();