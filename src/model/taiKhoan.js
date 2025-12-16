const {sql,connectDB} =require('../db/index');
async function Login(Data) {
    try {
        const msv = Data.MaSV;
        const mk = Data.Pass;
        let pool = await connectDB();
        let result = await pool.request()
        .input(`msv`,sql.NVarChar,msv)
        .input(`mk`,sql.NVarChar,mk)
        .query(`select * from TaiKhoan where MaSV = @msv and Pass = @mk`);
        return result.recordset;
    } catch (error) {
        console.log('Lỗi query',error);
    }
}
module.exports = {Login}
