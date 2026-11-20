// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// HÀM VÀ SCRIPT LÀM SẠCH DỮ LIỆU CƠ SỞ DỮ LIỆU (RESET / CLEAN DATABASE)
// ============================================================================

const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const DUONG_DAN_CSDL = path.join(__dirname, 'coSoDuLieu.sqlite');

/**
 * Làm sạch dữ liệu trong cơ sở dữ liệu SQLite
 * @param {Object} tuyChon Tùy chọn làm sạch
 * @param {boolean} tuyChon.toanBo Nếu true: xóa trắng mọi bảng; Nếu false: chỉ xóa dữ liệu giao dịch
 * @returns {{ ok: boolean, msg: string, bangDaXoa: string[] }}
 */
function lamSachDuLieu(tuyChon = { toanBo: false }) {
  const db = new DatabaseSync(DUONG_DAN_CSDL);
  db.exec('PRAGMA foreign_keys = OFF;'); // Tắt tạm thời để truncate nhanh và sạch

  // Danh sách các bảng giao dịch cần dọn sạch khi reset nghiệp vụ
  const bangGiaoDich = [
    'danh_gia',
    'chia_tien_nhom',
    'giao_dich_thanh_toan',
    'chi_tiet_hoa_don',
    'hoa_don',
    'yeu_cau_huy_mon',
    'yeu_cau_ho_tro',
    'chi_tiet_don_mon',
    'don_goi_mon',
    'phien_ban',
    'yeu_cau_doi_ca',
    'ca_lam_viec',
    'phan_cong_ban',
    'nhat_ky_kiem_toan',
    'phieu_thu_chi_noi_bo'
  ];

  // Danh sách các bảng danh mục & cấu hình tĩnh
  const bangDanhMucVaCauHinh = [
    'combo_chi_tiet',
    'mon_an',
    'danh_muc_mon',
    'ban_an',
    'khu_vuc',
    'cau_hinh_nha_hang',
    'nhan_vien',
    'tai_khoan',
    'vai_tro'
  ];

  const danhSachXoa = tuyChon.toanBo ? [...bangGiaoDich, ...bangDanhMucVaCauHinh] : bangGiaoDich;

  try {
    for (const tenBang of danhSachXoa) {
      try {
        db.exec(`DELETE FROM ${tenBang};`);
      } catch (e) {
        // Bỏ qua nếu bảng không tồn tại
      }
    }

    // Reset tự tăng ID trong SQLite
    if (tuyChon.toanBo) {
      try { db.exec("DELETE FROM sqlite_sequence;"); } catch (e) {}
    } else {
      for (const tenBang of bangGiaoDich) {
        try { db.exec(`DELETE FROM sqlite_sequence WHERE name = '${tenBang}';`); } catch (e) {}
      }
    }

    db.exec('PRAGMA foreign_keys = ON;');
    try { db.exec('VACUUM;'); } catch (e) {}

    return {
      ok: true,
      msg: tuyChon.toanBo ? 'Đã làm sạch toàn bộ dữ liệu CSDL' : 'Đã làm sạch toàn bộ dữ liệu giao dịch & đơn món',
      bangDaXoa: danhSachXoa
    };
  } catch (err) {
    db.exec('PRAGMA foreign_keys = ON;');
    throw err;
  }
}

// Nếu thực thi trực tiếp từ dòng lệnh: node database/lamSachDuLieu.js
if (require.main === module) {
  const toanBo = process.argv.includes('--toan-bo') || process.argv.includes('-all');
  console.log(`\n🧹 Bắt đầu làm sạch dữ liệu CSDL (${toanBo ? 'TOÀN BỘ BẢNG' : 'DỮ LIỆU GIAO DỊCH'})...`);
  const ketQua = lamSachDuLieu({ toanBo });
  console.log(`✅ ${ketQua.msg}`);
  console.log(`📋 Các bảng đã được làm sạch (${ketQua.bangDaXoa.length}):`, ketQua.bangDaXoa.join(', '));
  console.log('');
}

module.exports = { lamSachDuLieu };
