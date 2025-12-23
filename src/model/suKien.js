const { sql, connectDB } = require('../db/index');

// Lấy sự kiện sắp diễn ra (trong 4 ngày tới) kèm 4 avatar đầu tiên
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
            SELECT 
                SK.MaSK,
                SK.TenSK,
                SK.Poster,
                SK.DiaDiem,
                SK.LoaiSuKien,
                SK.CoSo,
                SK.SoLuongGioiHan,
                SK.SoLuongDaDangKy,
                SK.DiemCong,
                SK.MoTa,
                SK.TrangThai,
                FORMAT(SK.ThoiGianBatDau, 'yyyy-MM-dd HH:mm:ss') AS ThoiGianBatDau,
                FORMAT(SK.ThoiGianKetThuc, 'yyyy-MM-dd HH:mm:ss') AS ThoiGianKetThuc,
                G.AVT1, 
                G.AVT2, 
                G.AVT3, 
                G.AVT4
            FROM SuKien SK
            LEFT JOIN GroupedAVT G ON SK.MaSK = G.MaSK
            WHERE SK.TrangThai COLLATE Latin1_General_CI_AI = N'Sap dien ra'
              AND DATEDIFF(day, GETDATE(), SK.ThoiGianBatDau) BETWEEN 0 AND 4
            ORDER BY SK.MaSK;
        `);

        return result.recordset;
    } catch (err) {
        console.error('Lỗi query getSK:', err);
        return [];
    }
}

// Lấy tất cả sự kiện sắp diễn ra
async function getSKSapToi() {
    try {
        let pool = await connectDB();
        let result = await pool.request().query(`
            SELECT 
                SK.MaSK,
                SK.TenSK,
                SK.Poster,
                SK.DiaDiem,
                SK.LoaiSuKien,
                SK.CoSo,
                SK.SoLuongGioiHan,
                SK.SoLuongDaDangKy,
                SK.DiemCong,
                SK.MoTa,
                SK.TrangThai,
                FORMAT(SK.ThoiGianBatDau, 'yyyy-MM-dd HH:mm:ss') AS ThoiGianBatDau,
                FORMAT(SK.ThoiGianKetThuc, 'yyyy-MM-dd HH:mm:ss') AS ThoiGianKetThuc
            FROM SuKien SK 
            WHERE TrangThai COLLATE Latin1_General_CI_AI = N'Sap dien ra';
        `);
        return result.recordset;
    } catch (err) {
        console.error('Lỗi query getSKSapToi:', err);
        return [];
    }
}

// Đăng ký sự kiện
async function dangKySuKien(data) {
    try {
        const { MaTK, MaSK } = data;
        let pool = await connectDB();
        await pool.request()
            .input('MaTK', sql.Int, MaTK)
            .input('MaSK', sql.Int, MaSK)
            .query(`INSERT INTO ThamGiaSuKien(MaTK, MaSK) VALUES (@MaTK, @MaSK);`);
    } catch (error) {
        console.error('Lỗi query dangKySuKien: ', error);
    }
}

// Tìm sự kiện đã đăng ký nhưng chưa nộp minh chứng
async function timSuKien(data) {
    try {
        const { MaTK, MaSK } = data;
        let pool = await connectDB();
        let result = await pool.request()
            .input('MaTK', sql.Int, MaTK)
            .input('MaSK', sql.Int, MaSK)
            .query(`
                SELECT 
                    SK.MaSK,
                    SK.TenSK,
                    SK.Poster,
                    SK.DiaDiem,
                    SK.LoaiSuKien,
                    SK.CoSo,
                    SK.SoLuongGioiHan,
                    SK.SoLuongDaDangKy,
                    SK.DiemCong,
                    SK.MoTa,
                    SK.TrangThai,
                    FORMAT(SK.ThoiGianBatDau, 'yyyy-MM-dd HH:mm:ss') AS ThoiGianBatDau,
                    FORMAT(SK.ThoiGianKetThuc, 'yyyy-MM-dd HH:mm:ss') AS ThoiGianKetThuc
                FROM SuKien SK
                JOIN ThamGiaSuKien TG ON SK.MaSK = TG.MaSK
                WHERE TG.MaSK = @MaSK 
                  AND TG.MaTK = @MaTK 
                  AND TG.TrangThaiMinhChung = 0
            `);
        return result.recordset;
    } catch (error) {
        console.error('Lỗi query timSuKien: ', error);
        return [];
    }
}

// Upload minh chứng
async function uploadMinhChung(id, data) {
    try {
        const { MaSK, AnhMinhChung } = data;
        let pool = await connectDB();
        await pool.request()
            .input('id', sql.Int, id)
            .input('mask', sql.Int, MaSK)
            .input('anh', sql.NVarChar, AnhMinhChung)
            .query(`
                UPDATE ThamGiaSuKien 
                SET AnhMinhChung = @anh, 
                    ThoiGianCheckIn = CAST(DATEADD(HOUR, 7, GETUTCDATE()) AS DATETIME2(0))
                WHERE MaTK = @id AND MaSK = @mask
            `);
    } catch (error) {
        console.error('Lỗi query uploadMinhChung: ', error);
    }
}

// Lấy danh sách sự kiện cho admin, nhóm theo trạng thái (dựa vào trường TrangThai)
async function getAllForAdmin() {
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
                    MAX(CASE WHEN rn = 3 THEN AVT END) AS AVT3
                FROM TopAVT
                WHERE rn <= 3
                GROUP BY MaSK
            )
            SELECT 
                SK.MaSK,
                SK.TenSK,
                SK.Poster,
                SK.DiaDiem,
                SK.LoaiSuKien,
                SK.CoSo,
                SK.SoLuongGioiHan,
                SK.SoLuongDaDangKy,
                SK.DiemCong,
                SK.MoTa,
                SK.TrangThai,
                FORMAT(SK.ThoiGianBatDau, 'yyyy-MM-dd HH:mm:ss') AS ThoiGianBatDau,
                FORMAT(SK.ThoiGianKetThuc, 'yyyy-MM-dd HH:mm:ss') AS ThoiGianKetThuc,
                G.AVT1, G.AVT2, G.AVT3,
                CASE 
                    WHEN SK.TrangThai COLLATE Latin1_General_CI_AI = N'Sap dien ra' THEN 'upcoming'
                    WHEN SK.TrangThai COLLATE Latin1_General_CI_AI = N'Dang dien ra' THEN 'ongoing'
                    WHEN SK.TrangThai COLLATE Latin1_General_CI_AI = N'Da dien ra' THEN 'done'
                    ELSE 'ongoing'
                END AS CalcStatus
            FROM SuKien SK
            LEFT JOIN GroupedAVT G ON SK.MaSK = G.MaSK
            ORDER BY SK.ThoiGianBatDau ASC;
        `);

        const grouped = { upcoming: [], ongoing: [], done: [] };
        result.recordset.forEach(ev => {
            if (ev.CalcStatus === 'upcoming') grouped.upcoming.push(ev);
            else if (ev.CalcStatus === 'done') grouped.done.push(ev);
            else grouped.ongoing.push(ev);
        });
        return grouped;
    } catch (error) {
        console.error('Lỗi query getAllForAdmin:', error);
        return { upcoming: [], ongoing: [], done: [] };
    }
}

// Danh sách sinh viên tham gia theo sự kiện
async function getParticipants(maSK) {
    try {
        let pool = await connectDB();
        let result = await pool.request()
            .input('maSK', sql.Int, maSK)
            .query(`
                SELECT 
                    TG.MaTK,
                    TK.MaSV,
                    TK.HoTen,
                    TK.Khoa,
                    TK.Lop,
                    TK.AVT,
                    TG.TrangThaiMinhChung,
                    TG.AnhMinhChung,
                    TG.ThoiGianCheckIn,
                    TG.DiaDiemMinhChung,
                    ISNULL(TG.LyDoTuChoi, '') AS LyDoTuChoi,
                    SK.SoLuongGioiHan,
                    SK.SoLuongDaDangKy,
                    SK.TenSK,
                    SK.TrangThai,
                    SK.LoaiSuKien,
                    SK.DiaDiem AS DiaDiemSK,
                    FORMAT(SK.ThoiGianBatDau, 'yyyy-MM-dd HH:mm:ss') AS ThoiGianBatDau,
                    FORMAT(SK.ThoiGianKetThuc, 'yyyy-MM-dd HH:mm:ss') AS ThoiGianKetThuc
                FROM ThamGiaSuKien TG
                JOIN TaiKhoan TK ON TG.MaTK = TK.MaTK
                JOIN SuKien SK ON TG.MaSK = SK.MaSK
                WHERE TG.MaSK = @maSK
                ORDER BY TK.HoTen;
            `);
        return result.recordset;
    } catch (error) {
        console.error('Lỗi query getParticipants:', error);
        return [];
    }
}

// Lấy tất cả sự kiện (mọi trạng thái) kèm avatar
async function getAll() {
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
            SELECT 
                SK.MaSK,
                SK.TenSK,
                SK.Poster,
                SK.DiaDiem,
                SK.LoaiSuKien,
                SK.CoSo,
                SK.SoLuongGioiHan,
                SK.SoLuongDaDangKy,
                SK.DiemCong,
                SK.MoTa,
                SK.TrangThai,
                FORMAT(SK.ThoiGianBatDau, 'yyyy-MM-dd HH:mm:ss') AS ThoiGianBatDau,
                FORMAT(SK.ThoiGianKetThuc, 'yyyy-MM-dd HH:mm:ss') AS ThoiGianKetThuc,
                G.AVT1, 
                G.AVT2, 
                G.AVT3, 
                G.AVT4
            FROM SuKien SK
            LEFT JOIN GroupedAVT G ON SK.MaSK = G.MaSK
            ORDER BY SK.ThoiGianBatDau ASC;
        `);
        return result.recordset;
    } catch (err) {
        console.error('Lỗi query getAll:', err);
        return [];
    }
}

module.exports = {
    getSK,
    getSKSapToi,
    dangKySuKien,
    timSuKien,
    uploadMinhChung,
    getAllForAdmin,
    getParticipants,
    updateParticipantStatus,
    getAll,
    huyDangKySuKien,
    updateEvent
};

// Function declaration is hoisted; placed here to avoid patch conflicts.
async function updateParticipantStatus(maSK, maTK, trangThai, lyDo) {
    try {
        const pool = await connectDB();
        const info = await pool.request()
            .input('maSK', sql.Int, maSK)
            .input('maTK', sql.Int, maTK)
            .query(`
                SELECT TOP 1 TG.DaCongDiem, TG.TrangThaiMinhChung
                FROM ThamGiaSuKien TG
                WHERE TG.MaSK = @maSK AND TG.MaTK = @maTK;
            `);

        if (!info.recordset || info.recordset.length === 0) return false;

        const current = info.recordset[0];
        const currentDaCong = Number(current.DaCongDiem) === 1 ? 1 : 0;
        const status = Number(trangThai);
        if (!Number.isFinite(status)) return false;

        let newDaCong = currentDaCong;
        if (status === 2) {
            newDaCong = 1;
        } else if (status === 3 || status === 1 || status === 0) {
            newDaCong = 0;
        }

        await pool.request()
            .input('maSK', sql.Int, maSK)
            .input('maTK', sql.Int, maTK)
            .input('trangThai', sql.Int, status)
            .input('lyDo', sql.NVarChar, lyDo || null)
            .input('daCong', sql.Bit, newDaCong)
            .query(`
                UPDATE ThamGiaSuKien
                SET TrangThaiMinhChung = @trangThai,
                    DaCongDiem = @daCong,
                    LyDoTuChoi = CASE WHEN @trangThai = 3 THEN @lyDo ELSE NULL END
                WHERE MaSK = @maSK AND MaTK = @maTK;
            `);
        return true;
    } catch (error) {
        console.error('Loi query updateParticipantStatus:', error);
        return false;
    }
}
async function huyDangKySuKien(maTK, maSK) {
    try {
        let pool = await connectDB();
        let result = await pool.request()
            .input('MaTK', sql.Int, maTK)
            .input('MaSK', sql.Int, maSK)
            .query(`
                DELETE TG
                FROM ThamGiaSuKien TG
                JOIN SuKien SK ON TG.MaSK = SK.MaSK
                WHERE TG.MaTK = @MaTK 
                  AND TG.MaSK = @MaSK
                  AND SK.TrangThai COLLATE Latin1_General_CI_AI = N'Sap dien ra';
            `);
        return result.rowsAffected && result.rowsAffected[0] > 0;
    } catch (error) {
        console.error('Loi query huyDangKySuKien:', error);
        return false;
    }
}

async function updateEvent(id, data) {
    try {
        const {
            TenSK,
            MoTa,
            LoaiSuKien,
            SoLuongGioiHan,
            DiemCong,
            CoSo,
            DiaDiem,
            ThoiGianBatDau,
            ThoiGianKetThuc,
            TrangThai,
            Poster
        } = data;
        let pool = await connectDB();
        let result = await pool.request()
            .input('id', sql.Int, id)
            .input('TenSK', sql.NVarChar, TenSK || null)
            .input('MoTa', sql.NVarChar, MoTa || null)
            .input('LoaiSuKien', sql.NVarChar, LoaiSuKien || null)
            .input('SoLuongGioiHan', sql.Int, SoLuongGioiHan || null)
            .input('DiemCong', sql.Int, DiemCong || null)
            .input('CoSo', sql.NVarChar, CoSo || null)
            .input('DiaDiem', sql.NVarChar, DiaDiem || null)
            .input('ThoiGianBatDau', sql.NVarChar, ThoiGianBatDau || null)
            .input('ThoiGianKetThuc', sql.NVarChar, ThoiGianKetThuc || null)
            .input('TrangThai', sql.NVarChar, TrangThai || null)
            .input('Poster', sql.NVarChar, Poster || null)
            .query(`
                UPDATE SuKien
                SET TenSK = COALESCE(@TenSK, TenSK),
                    Poster = COALESCE(@Poster, Poster),
                    MoTa = COALESCE(@MoTa, MoTa),
                    LoaiSuKien = COALESCE(@LoaiSuKien, LoaiSuKien),
                    SoLuongGioiHan = COALESCE(@SoLuongGioiHan, SoLuongGioiHan),
                    DiemCong = COALESCE(@DiemCong, DiemCong),
                    CoSo = COALESCE(@CoSo, CoSo),
                    DiaDiem = COALESCE(@DiaDiem, DiaDiem),
                    ThoiGianBatDau = COALESCE(@ThoiGianBatDau, ThoiGianBatDau),
                    ThoiGianKetThuc = COALESCE(@ThoiGianKetThuc, ThoiGianKetThuc),
                    TrangThai = COALESCE(@TrangThai, TrangThai)
                WHERE MaSK = @id;
            `);
        return result.rowsAffected && result.rowsAffected[0] > 0;
    } catch (error) {
        console.error('Loi query updateEvent:', error);
        return false;
    }
}






