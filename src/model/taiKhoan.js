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
async function findByEmail(email) {
    try {
        const pool = await connectDB();
        const result = await pool.request()
            .input('email', sql.NVarChar, email)
            .query('select MaTK, Email from TaiKhoan where Email = @email');
        return result.recordset;
    } catch (error) {
        console.log('Loi query', error);
    }
}

async function updatePasswordByEmail(email, newPassword) {
    try {
        const pool = await connectDB();
        const result = await pool.request()
            .input('email', sql.NVarChar, email)
            .input('mk', sql.NVarChar, newPassword)
            .query('update TaiKhoan set Pass = @mk where Email = @email');
        return result.rowsAffected && result.rowsAffected[0] ? result.rowsAffected[0] : 0;
    } catch (error) {
        console.log('Loi query', error);
    }
}
async function diemtichluy(ma){
    try {
       let pool = await connectDB();
       let result = await pool.request()
                                .input('ma',sql.Int,ma)
                                .query(`select DiemTichLuy from TaiKhoan where MaTK = @ma`);
        return result.recordset;
    } catch (error) {
        console.error('Lỗi query: ',error);
    }
}
module.exports = {Login, findByEmail, updatePasswordByEmail,diemtichluy}
