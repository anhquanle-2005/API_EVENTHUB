const {sql, connectDB}= require('../db/index');
async function getSK() {
    try {
        let pool = await connectDB();
        let result = await pool.request().query(`WITH TopAVT AS (`+
                                                    ` SELECT`+
                                                        ` SK.MaSK,`+
                                                        ` TK.AVT,`+
                                                       ` ROW_NUMBER() OVER (PARTITION BY SK.MaSK ORDER BY TK.MaTK) AS rn`+
                                                    ` FROM SuKien SK`+
                                                    ` JOIN ChiTietTaiKhoan CT ON SK.MaSK = CT.MaSK`+
                                                    ` JOIN TaiKhoan TK ON TK.MaTK = CT.MaTK`+
                                                    ` )`+
                                                    ` SELECT`+
                                                        ` SK.MaSK,`+
                                                        ` SK.TenSK,`+
                                                        ` SK.Poster,`+
                                                        ` SK.TrangThai,`+
                                                        ` SK.ThoiGian,`+
                                                        ` MAX(CASE WHEN rn = 1 THEN AVT END) AS AVT1,`+
                                                        ` MAX(CASE WHEN rn = 2 THEN AVT END) AS AVT2,`+
                                                        ` MAX(CASE WHEN rn = 3 THEN AVT END) AS AVT3,`+
                                                        ` MAX(CASE WHEN rn = 4 THEN AVT END) AS AVT4`+
                                                    ` FROM SuKien SK`+
                                                    ` LEFT JOIN TopAVT T ON SK.MaSK = T.MaSK`+
                                                    ` WHERE SK.TrangThai = N'Sắp diễn ra'`+
                                                    ` GROUP BY SK.MaSK, SK.TenSK, SK.Poster,SK.TrangThai ,SK.ThoiGian`+
                                                    ` ORDER BY SK.MaSK;`)
        return result.recordset;
    } catch (err) {
        console.error('Lỗi query:', err)
    }
};
async function getSKSapToi() {
    try {
        let pool = await connectDB();
        let result = await pool.request().query(`Select * from SuKien where TrangThai = N'Sắp diễn ra'`);
        return result.recordset;
    } catch (err) {
        console.error('Lỗi query:', err)
    }
}

module.exports ={getSK, getSKSapToi};