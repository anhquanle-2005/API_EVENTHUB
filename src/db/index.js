const sql = require('mssql');
const config = {
    user: 'bap_SQLLogin_1',
    password: 'eventhub123456',
    database: 'EVENHUB',
    server: 'EVENHUB.mssql.somee.com',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};
async function connectDB() {
    try {
        let pool = await sql.connect(config);
        console.log('Kết nối với SQL Server thành công');
        return pool;
    } catch (err) {
        console.error('Lỗi kết nối',err);
    }}
module.exports = {sql,connectDB};