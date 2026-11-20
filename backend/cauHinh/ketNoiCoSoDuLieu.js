// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// MODULE KẾT NỐI VÀ QUẢN LÝ TRUY VẤN CƠ SỞ DỮ LIỆU SQLITE3
// ============================================================================

const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');
const cauHinh = require('./cauHinhChung');

// Đảm bảo tệp CSDL tồn tại trước khi kết nối
if (!fs.existsSync(cauHinh.duongDanCsdl)) {
    console.warn(`⚠️ CẢNH BÁO: Không tìm thấy tệp CSDL tại ${cauHinh.duongDanCsdl}.`);
}

const db = new DatabaseSync(cauHinh.duongDanCsdl);

// Kích hoạt các chế độ an toàn dữ liệu
db.exec('PRAGMA foreign_keys = ON;');
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA busy_timeout = 5000;');

/**
 * Thực thi câu truy vấn lấy danh sách nhiều dòng bản ghi
 * @param {string} sql Câu lệnh SQL có tham số (?)
 * @param {Array} thamSo Mảng giá trị tham số
 * @returns {Array} Danh sách các dòng kết quả
 */
function truyVanNhieu(sql, thamSo = []) {
    const stmt = db.prepare(sql);
    return stmt.all(...thamSo);
}

/**
 * Thực thi câu truy vấn lấy duy nhất 1 bản ghi
 * @param {string} sql Câu lệnh SQL có tham số (?)
 * @param {Array} thamSo Mảng giá trị tham số
 * @returns {Object|null} Bản ghi đầu tiên hoặc null nếu không tìm thấy
 */
function truyVanMot(sql, thamSo = []) {
    const stmt = db.prepare(sql);
    const ketQua = stmt.get(...thamSo);
    return ketQua !== undefined ? ketQua : null;
}

/**
 * Thực thi câu lệnh ghi/sửa/xóa dữ liệu (INSERT, UPDATE, DELETE)
 * @param {string} sql Câu lệnh SQL có tham số (?)
 * @param {Array} thamSo Mảng giá trị tham số
 * @returns {{ changes: number, lastInsertRowid: number|bigint }} Kết quả thực thi
 */
function thucThi(sql, thamSo = []) {
    const stmt = db.prepare(sql);
    return stmt.run(...thamSo);
}

/**
 * Thực thi một chuỗi các thao tác trong Giao dịch an toàn (Transaction)
 * Tự động COMMIT nếu thành công, ROLLBACK nếu phát sinh bất kỳ ngoại lệ nào
 * @param {Function} hamXuLy Hàm callback chứa các câu lệnh db
 * @returns {*} Giá trị trả về từ hamXuLy
 */
function chayGiaoDich(hamXuLy) {
    db.exec('BEGIN IMMEDIATE TRANSACTION;');
    try {
        const ketQua = hamXuLy(db);
        db.exec('COMMIT TRANSACTION;');
        return ketQua;
    } catch (loi) {
        db.exec('ROLLBACK TRANSACTION;');
        throw loi;
    }
}

module.exports = {
    db,
    truyVanNhieu,
    truyVanMot,
    thucThi,
    chayGiaoDich
};
