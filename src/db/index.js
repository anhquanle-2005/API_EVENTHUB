const sql = require('mssql');
// const config = {
//     user: 'sa',
//     password: '12345',
//     database: 'EVENTHUB',
//     server: 'DESKTOP-OAMTM76',
//     options: {
//         // instanceName: 'SQL2022',
//         encrypt: false,
//         trustServerCertificate: true
//     }
// };
const config = {
    user: 'bap_SQLLogin_1',  // Tên đăng nhập lấy từ ảnh Somee
    password: 'eventhub123456', // Mật khẩu bạn đã copy ở bước trước
    database: 'EVENHUB',
    server: 'EVENHUB.mssql.somee.com', // Địa chỉ server của Somee
    port: 1433, // Cổng mặc định của SQL Server (nên thêm vào cho chắc)
    options: {
        encrypt: false,              
        trustServerCertificate: true // Bắt buộc để true với các host free như Somee
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