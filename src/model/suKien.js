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

async function searchSK(keyword, tags, time) {
    try {
        let pool = await connectDB();
        let request = pool.request();
        let query = `
            SELECT SK.MaSK,
                   SK.TenSK,
                   SK.Poster,
                   SK.DiaDiem,
                   SK.CoSo,
                   SK.SoLuongGioiHan,
                   SK.SoLuongDaDangKy,
                   SK.DiemCong,
                   SK.MoTa,
                   SK.TrangThai,
                   FORMAT(SK.ThoiGianBatDau, 'yyyy-MM-dd HH:mm:ss') AS ThoiGianBatDau,
                   FORMAT(SK.ThoiGianKetThuc, 'yyyy-MM-dd HH:mm:ss') AS ThoiGianKetThuc
            FROM SuKien SK
            WHERE 1=1
        `;

        if (keyword) {
            request.input('keyword', sql.NVarChar, `%${keyword}%`);
            query += `
                AND (SK.TenSK LIKE @keyword
                     OR SK.MoTa LIKE @keyword
                     OR SK.DiaDiem LIKE @keyword
                     OR SK.CoSo LIKE @keyword)
            `;
        }

        if (tags && tags.length > 0) {
            let tagConditions = [];
            tags.forEach((tag, index) => {
                const paramName = `tag${index}`;
                request.input(paramName, sql.NVarChar, `%${tag}%`);
                tagConditions.push(`(SK.TenSK LIKE @${paramName} OR SK.MoTa LIKE @${paramName})`);
            });
            query += ` AND (${tagConditions.join(' OR ')})`;
        }

        if (time === 'today') {
            query += `
                AND CAST(SK.ThoiGianBatDau AS date) = CAST(GETDATE() AS date)
            `;
        } else if (time === 'tomorrow') {
            query += `
                AND CAST(SK.ThoiGianBatDau AS date) = DATEADD(day, 1, CAST(GETDATE() AS date))
            `;
        } else if (time === 'week') {
            query += `
                AND DATEDIFF(day, CAST(GETDATE() AS date), CAST(SK.ThoiGianBatDau AS date)) BETWEEN 0 AND 6
            `;
        }

        query += ` ORDER BY SK.ThoiGianBatDau`;

        let result = await request.query(query);
        return result.recordset;
    } catch (err) {
        console.error('Loi query:', err);
    }
}

module.exports ={getSK, getSKSapToi, searchSK};
