// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// CONTROLLER ĐIỀU PHỐI BẾP KDS (FIGMA K01, K02, K03, K05)
// ============================================================================

const dieuPhoiBepService = require('./dieuPhoiBep.service');
const { phanHoiThanhCong, phanHoiLoi } = require('../../tienIch/dinhDangPhanHoi');

const dieuPhoiBepController = {
    async layHangDoi(req, res) {
        try {
            const { cheDo } = req.query; // 'theo_ban' hoặc 'gom_mon'
            const ketQua = await dieuPhoiBepService.layHangDoi(cheDo);
            return phanHoiThanhCong(res, ketQua, 'Lấy danh sách hàng đợi bếp thành công');
        } catch (loi) {
            return phanHoiLoi(res, loi.message, 500);
        }
    },

    async layMonDaHoanThanh(req, res) {
        try {
            const ketQua = await dieuPhoiBepService.layMonDaHoanThanh();
            return phanHoiThanhCong(res, ketQua, 'Lấy danh sách món đã hoàn thành gần đây');
        } catch (loi) {
            return phanHoiLoi(res, loi.message, 500);
        }
    },

    async chuyenTrangThai(req, res) {
        try {
            const chiTietId = parseInt(req.params.id, 10);
            const { trangThaiMoi, dauBepId } = req.body;

            if (!trangThaiMoi) {
                return phanHoiLoi(res, 'Vui lòng cung cấp trạng thái mới', 400);
            }

            const ketQua = await dieuPhoiBepService.chuyenTrangThai(
                chiTietId,
                trangThaiMoi,
                dauBepId || (req.nguoiDung ? req.nguoiDung.nhan_vien_id : null),
                req.nguoiDung
            );
            return phanHoiThanhCong(res, ketQua, 'Cập nhật tiến độ món ăn thành công');
        } catch (loi) {
            return phanHoiLoi(res, loi.message, 400);
        }
    },

    async datLenhUuTien(req, res) {
        try {
            const chiTietId = parseInt(req.params.id, 10);
            const { laUuTien } = req.body;

            const ketQua = await dieuPhoiBepService.datLenhUuTien(
                chiTietId,
                laUuTien !== undefined ? laUuTien : 1,
                req.nguoiDung
            );
            return phanHoiThanhCong(res, ketQua, 'Cập nhật độ ưu tiên thành công');
        } catch (loi) {
            return phanHoiLoi(res, loi.message, 400);
        }
    }
};

module.exports = dieuPhoiBepController;
