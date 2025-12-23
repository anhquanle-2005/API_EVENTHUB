const {sql, connectDB}= require('../db/index');
async function getSK() {
    try {
        let pool = await connectDB();
        let result = await pool.request().query(`
                                                WITH TopAVT AS (
                                                SELECT 
                                                    CT.MaSK, 
                                                    TK.AVT, 
                                                    ROW_NUMBER() OVER (PARTITION BY CT.MaSK ORDER BY TK.MaTK) AS rn
                                                FROM ThamGiaSuKien CT
                                                JOIN TaiKhoan TK ON TK.MaTK = CT.MaTK
                                            ),
                                            GroupedAVT AS (
                                                SELECT 
                                                    MaSK,
                                                    MAX(CASE WHEN rn = 1 THEN AVT END) AS AVT1,
                                                    MAX(CASE WHEN rn = 2 THEN AVT END) AS AVT2,
                                                    MAX(CASE WHEN rn = 3 THEN AVT END) AS AVT3,
                                                    MAX(CASE WHEN rn = 4 THEN AVT END) AS AVT4
                                                FROM TopAVT
                                                WHERE rn <= 4
                                                GROUP BY MaSK
                                            )
                                            -- PHẦN SELECT CHÍNH ĐÃ ĐƯỢC CHỈNH SỬA:
                                            SELECT 
                                                SK.MaSK,
                                                SK.TenSK,
                                                SK.Poster,
                                                SK.DiaDiem,
                                                SK.CoSo,
                                                SK.SoLuongGioiHan,
                                                SK.SoLuongDaDangKy,
                                                SK.DiemCong,
                                                SK.MoTa,
                                                SK.TrangThai,
                                                
                                                -- QUAN TRỌNG: Format ngày giờ ra chuỗi chuẩn (yyyy-MM-dd HH:mm:ss)
                                                -- Để Node.js/Android hiển thị đúng giờ Việt Nam, không bị lệch múi giờ
                                                FORMAT(SK.ThoiGianBatDau, 'yyyy-MM-dd HH:mm:ss') AS ThoiGianBatDau,
                                                FORMAT(SK.ThoiGianKetThuc, 'yyyy-MM-dd HH:mm:ss') AS ThoiGianKetThuc,
                                                
                                                G.AVT1, 
                                                G.AVT2, 
                                                G.AVT3, 
                                                G.AVT4
                                            FROM SuKien SK
                                            LEFT JOIN GroupedAVT G ON SK.MaSK = G.MaSK
                                            WHERE SK.TrangThai = N'Sắp diễn ra' 
                                            -- Lọc sự kiện từ hôm nay đến 4 ngày tới
                                            AND DATEDIFF(day, GETDATE(), SK.ThoiGianBatDau) BETWEEN 0 AND 4
                                            ORDER BY SK.MaSK;
                                            `);

        return result.recordset;
    } catch (err) {
        console.error('Lỗi query:', err)
    }
};
async function getSKSapToi() {
    try {
        let pool = await connectDB();
        let result = await pool.request().query(`Select SK.MaSK,
                                                SK.TenSK,
                                                SK.Poster,
                                                SK.DiaDiem,
                                                SK.CoSo,
                                                SK.SoLuongGioiHan,
                                                SK.SoLuongDaDangKy,
                                                SK.DiemCong,
                                                SK.MoTa,
                                                SK.TrangThai,
                                                
                                                -- QUAN TRỌNG: Format ngày giờ ra chuỗi chuẩn (yyyy-MM-dd HH:mm:ss)
                                                -- Để Node.js/Android hiển thị đúng giờ Việt Nam, không bị lệch múi giờ
                                                FORMAT(SK.ThoiGianBatDau, 'yyyy-MM-dd HH:mm:ss') AS ThoiGianBatDau,
                                                FORMAT(SK.ThoiGianKetThuc, 'yyyy-MM-dd HH:mm:ss') AS ThoiGianKetThuc
                                                from SuKien SK where TrangThai = N'Sắp diễn ra'`);
        return result.recordset;
    } catch (err) {
        console.error('Lỗi query:', err)
    }
}
async function dangKySuKien(data) {
    try {
        const {MaTK, MaSK} = data;
        
        let pool = await connectDB();
        await pool.request()
                    .input('MaTK',sql.Int,MaTK)
                    .input('MaSK',sql.Int,MaSK)
                    .query(`insert into ThamGiaSuKien(MaTK, MaSK) VALUES (@MaTK, @MaSK);`);
    } catch (error) {
        console.error('Lỗi query: ',error);
    }
}
async function timSuKien(data) 
{
    try {
        const {MaTK, MaSK} = data;
        console.log(data);
        let pool = await connectDB();
        let result = await pool.request()
                                .input('MaTK',sql.Int,MaTK)
                                .input('MaSK',sql.Int,MaSK)
                                .query(`Select SK.MaSK,
                                                SK.TenSK,
                                                SK.Poster,
                                                SK.DiaDiem,
                                                SK.CoSo,
                                                SK.SoLuongGioiHan,
                                                SK.SoLuongDaDangKy,
                                                SK.DiemCong,
                                                SK.MoTa,
                                                SK.TrangThai,
                                                -- QUAN TRỌNG: Format ngày giờ ra chuỗi chuẩn (yyyy-MM-dd HH:mm:ss)
                                                -- Để Node.js/Android hiển thị đúng giờ Việt Nam, không bị lệch múi giờ
                                                FORMAT(SK.ThoiGianBatDau, 'yyyy-MM-dd HH:mm:ss') AS ThoiGianBatDau,
                                                FORMAT(SK.ThoiGianKetThuc, 'yyyy-MM-dd HH:mm:ss') AS ThoiGianKetThuc
                                        from SuKien SK, ThamGiaSuKien TG
                                        where SK.MaSk = TG.MaSK and TG.MaSK = @MaSK and TG.MaTK = @MaTK and TrangThaiMinhChung = 0`);
        console.log(result.recordset);       
        return result.recordset;
    } catch (error) {
        console.error('Lỗi query: ',error);
    }    
}
async function uploadMinhChung(id, data) {
    try {
        const {MaSK, AnhMinhChung} = data;
        let pool = await connectDB();
        await pool.request()
                    .input('id',sql.Int,id)
                    .input('mask',sql.Int,MaSK)
                    .input('anh',sql.NVarChar,AnhMinhChung)
                    .query(`update ThamGiaSuKien 
                        set AnhMinhChung = @anh, 
                            ThoiGianCheckIn = CAST(DATEADD(HOUR, 7, GETUTCDATE()) AS DATETIME2(0)),
                            TrangThaiMinhChung = 1
                        where MaTK = @id and MaSK = @mask`);
    } catch (error) {
         console.error('Lỗi query: ',error);
    }
    
}
module.exports ={getSK, getSKSapToi,dangKySuKien,timSuKien,uploadMinhChung};