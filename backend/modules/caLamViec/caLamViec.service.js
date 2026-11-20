// ============================================================================
// DỰ ÁN: HỆ THỐNG QUẢN LÝ NHÀ HÀNG & GỌI MÓN QR TẠI BÀN (QUÁN MỘC POS & E-MENU)
// SERVICE CA LÀM VIỆC & ĐỔI CA / NGHỈ PHÉP (FIGMA W11, A07)
// ============================================================================

const caLamViecModel = require('./caLamViec.model');
const { socketPhat } = require('../../cauHinh/cauHinhSocket');
const { ghiAuditLog } = require('../../tienIch/ghiNhatKy');

const caLamViecService = {
    /**
     * Lấy lịch làm việc của nhân viên (W11)
     */
    async layLichNhanVien(nhanVienId, tuNgay, denNgay) {
        if (!nhanVienId) {
            throw new Error('Vui lòng chỉ định nhân viên');
        }
        return caLamViecModel.layLichTheoNhanVien(nhanVienId, tuNgay, denNgay);
    },

    /**
     * Quản lý xem toàn bộ lịch làm việc
     */
    async layToanBoLich(tuNgay, denNgay) {
        return caLamViecModel.layToanBoLich(tuNgay, denNgay);
    },

    /**
     * Tạo mới ca làm việc (Xếp lịch)
     */
    async taoCaLamViec({ nhanVienId, ngayLam, tenCa, gioBatDau, gioKetThuc, ghiChu }, taiKhoanHienTai = null) {
        if (!nhanVienId || !ngayLam || !tenCa || !gioBatDau || !gioKetThuc) {
            throw new Error('Thiếu thông tin ca làm việc bắt buộc');
        }

        const caId = caLamViecModel.taoCa({
            nhanVienId,
            ngayLam,
            tenCa,
            gioBatDau,
            gioKetThuc,
            ghiChu
        });

        if (taiKhoanHienTai) {
            ghiAuditLog({
                taiKhoanId: taiKhoanHienTai.id,
                hanhDong: 'TAO_CA_LAM_VIEC',
                doiTuong: 'ca_lam_viec',
                doiTuongId: caId,
                duLieuMoi: { nhanVienId, ngayLam, tenCa }
            });
        }

        return caLamViecModel.timCaTheoId(caId);
    },

    /**
     * Nhân viên điểm danh vào ca (Check-in)
     */
    async checkinCa(caId, nhanVienId) {
        const ca = caLamViecModel.timCaTheoId(caId);
        if (!ca) {
            throw new Error('Không tìm thấy ca làm việc');
        }
        if (ca.nhan_vien_id !== nhanVienId) {
            throw new Error('Ca làm việc này không được phân công cho bạn');
        }
        if (ca.trang_thai !== 'ke_hoach') {
            throw new Error(`Không thể điểm danh ca đang ở trạng thái "${ca.trang_thai}"`);
        }

        caLamViecModel.capNhatTrangThaiCa(caId, 'da_checkin');
        return caLamViecModel.timCaTheoId(caId);
    },

    /**
     * Nhân viên kết thúc ca (Check-out)
     */
    async checkoutCa(caId, nhanVienId) {
        const ca = caLamViecModel.timCaTheoId(caId);
        if (!ca) {
            throw new Error('Không tìm thấy ca làm việc');
        }
        if (ca.nhan_vien_id !== nhanVienId) {
            throw new Error('Ca làm việc này không được phân công cho bạn');
        }
        if (ca.trang_thai !== 'da_checkin') {
            throw new Error('Ca làm việc chưa được check-in');
        }

        caLamViecModel.capNhatTrangThaiCa(caId, 'da_hoan_thanh');
        return caLamViecModel.timCaTheoId(caId);
    },

    /**
     * Lấy danh sách yêu cầu đổi ca / xin nghỉ
     */
    async layDanhSachYeuCauDoiCa({ trangThai, nhanVienId } = {}) {
        return caLamViecModel.layDanhSachYeuCau({ trangThai, nhanVienId });
    },

    /**
     * Nhân viên gửi yêu cầu xin nghỉ / đổi ca (Figma W11 & US-W09)
     */
    async taoYeuCauDoiCa({ nhanVienYeuCauId, caLamViecId, loaiYeuCau, nhanVienNhanCaId = null, lyDo }) {
        if (!nhanVienYeuCauId || !caLamViecId || !loaiYeuCau || !lyDo) {
            throw new Error('Vui lòng điền đầy đủ thông tin: ca làm, loại yêu cầu và lý do');
        }

        const ca = caLamViecModel.timCaTheoId(caLamViecId);
        if (!ca) {
            throw new Error('Không tìm thấy ca làm việc chỉ định');
        }

        if (ca.nhan_vien_id !== nhanVienYeuCauId) {
            throw new Error('Bạn không thể tạo yêu cầu cho ca làm việc của người khác');
        }

        if (loaiYeuCau === 'doi_ca' && !nhanVienNhanCaId) {
            throw new Error('Đổi ca bắt buộc phải chọn nhân viên nhận ca');
        }

        if (loaiYeuCau === 'doi_ca' && nhanVienNhanCaId === nhanVienYeuCauId) {
            throw new Error('Không thể đổi ca cho chính mình');
        }

        const yeuCauId = caLamViecModel.taoYeuCauDoiCa({
            nhanVienYeuCauId,
            caLamViecId,
            loaiYeuCau,
            nhanVienNhanCaId,
            lyDo
        });

        const chiTietYc = caLamViecModel.timYeuCauTheoId(yeuCauId);

        // Bắn Socket thông báo Quản lý có yêu cầu đổi ca mới (US-W09)
        socketPhat.yeuCauDoiCaMoi({
            yeuCauId,
            loaiYeuCau,
            nhanVienYeuCau: chiTietYc.ten_nhan_vien_yeu_cau,
            nhanVienNhanCa: chiTietYc.ten_nhan_vien_nhan_ca,
            ngayLam: chiTietYc.ngay_lam,
            tenCa: chiTietYc.ten_ca,
            lyDo
        });

        return chiTietYc;
    },

    /**
     * Quản lý phê duyệt hoặc từ chối yêu cầu đổi ca (Figma A07)
     */
    async pheDuyetYeuCau(id, { trangThai, quanLyId, ghiChuDuyet }, taiKhoanHienTai = null) {
        if (!['da_duyet', 'tu_choi'].includes(trangThai)) {
            throw new Error('Trạng thái phê duyệt không hợp lệ (chỉ chấp nhận da_duyet hoặc tu_choi)');
        }

        const yeuCau = caLamViecModel.timYeuCauTheoId(id);
        if (!yeuCau) {
            throw new Error('Không tìm thấy yêu cầu đổi ca');
        }

        if (yeuCau.trang_thai !== 'cho_duyet') {
            throw new Error(`Yêu cầu này đã được xử lý trước đó với trạng thái: ${yeuCau.trang_thai}`);
        }

        caLamViecModel.pheDuyetYeuCau(id, {
            trangThai,
            quanLyDuyetId: quanLyId,
            ghiChuDuyet
        });

        // Bắn Socket thông báo cho Nhân viên biết kết quả duyệt
        socketPhat.ketQuaDuyetCa({
            yeuCauId: id,
            trangThai,
            loaiYeuCau: yeuCau.loai_yeu_cau,
            nhanVienYeuCauId: yeuCau.nhan_vien_yeu_cau_id,
            nhanVienNhanCaId: yeuCau.nhan_vien_nhan_ca_id,
            ghiChuDuyet
        });

        if (taiKhoanHienTai) {
            ghiAuditLog({
                taiKhoanId: taiKhoanHienTai.id,
                hanhDong: 'PHE_DUYET_DOI_CA',
                doiTuong: 'yeu_cau_doi_ca',
                doiTuongId: id,
                duLieuMoi: { trangThai, ghiChuDuyet }
            });
        }

        return caLamViecModel.timYeuCauTheoId(id);
    }
};

module.exports = caLamViecService;
