// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// SCRIPT SAO LƯU CƠ SỞ DỮ LIỆU ĐỊNH KỲ CHO PRODUCTION (DATABASE BACKUP)
// ============================================================================

const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const DUONG_DAN_CSDL_GOC = path.join(__dirname, 'coSoDuLieu.sqlite');
const THU_MUC_SAO_LUU = path.join(__dirname, 'saoLuu');

function thucHienSaoLuu() {
  if (!fs.existsSync(DUONG_DAN_CSDL_GOC)) {
    console.error('❌ Không tìm thấy tệp CSDL nguồn tại:', DUONG_DAN_CSDL_GOC);
    return false;
  }

  if (!fs.existsSync(THU_MUC_SAO_LUU)) {
    fs.mkdirSync(THU_MUC_SAO_LUU, { recursive: true });
  }

  const thoiGian = new Date();
  const chuoiThoiGian = thoiGian.toISOString().replace(/[:.]/g, '-');
  const tenTepSaoLuu = `coSoDuLieu_${chuoiThoiGian}.sqlite`;
  const duongDanDich = path.join(THU_MUC_SAO_LUU, tenTepSaoLuu);

  // Mở CSDL ở chế độ WAL an toàn và dùng checkpoint trước khi sao chép
  const db = new DatabaseSync(DUONG_DAN_CSDL_GOC);
  try {
    db.exec('PRAGMA wal_checkpoint(TRUNCATE);');
  } catch (err) {
    console.warn('⚠️ Cảnh báo checkpoint WAL:', err.message);
  }

  // Sao chép tệp nhị phân
  fs.copyFileSync(DUONG_DAN_CSDL_GOC, duongDanDich);

  const kichThuocKb = (fs.statSync(duongDanDich).size / 1024).toFixed(2);
  console.log(`✅ Đã sao lưu CSDL thành công: ${tenTepSaoLuu} (${kichThuocKb} KB)`);

  // Xóa các bản sao lưu cũ hơn 30 ngày để tối ưu dung lượng ổ cứng
  const danhSachTep = fs.readdirSync(THU_MUC_SAO_LUU);
  const bayGio = Date.now();
  const han30Ngay = 30 * 24 * 60 * 60 * 1000;

  danhSachTep.forEach(tep => {
    const duongDan = path.join(THU_MUC_SAO_LUU, tep);
    const stat = fs.statSync(duongDan);
    if (bayGio - stat.mtimeMs > han30Ngay) {
      fs.unlinkSync(duongDan);
      console.log(`🗑️ Đã dọn dẹp bản sao lưu cũ: ${tep}`);
    }
  });

  return {
    ok: true,
    tenTep: tenTepSaoLuu,
    duongDan: duongDanDich,
    kichThuocKb
  };
}

if (require.main === module) {
  thucHienSaoLuu();
}

module.exports = { thucHienSaoLuu };
