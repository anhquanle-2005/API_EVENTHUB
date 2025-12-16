const sql = require('mssql');

const config = {
    user: 'sa',                // Từ User ID=sa
    password: 'Abc123456@',    // Từ Password=Abc123456@
    database: 'EVENTHUB',      // Tên Database (giữ nguyên từ code cũ vì chuỗi kết nối của bạn thiếu phần này)
    server: 'localhost',       // Từ Data Source=localhost
    port: 14333,               // Quan trọng: Lấy từ số sau dấu phẩy của localhost,14333
    options: {
        encrypt: true,              // Từ Encrypt=True
        trustServerCertificate: true // Từ TrustServerCertificate=True
    }
};

async function connectDB() {
    try {
        let pool = await sql.connect(config);
        console.log('Kết nối với SQL Server thành công');
        return pool;
    } catch (err) {
        console.error('Lỗi kết nối', err);
    }
}

module.exports = { sql, connectDB };