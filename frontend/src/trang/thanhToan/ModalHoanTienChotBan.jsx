import React, { useState } from 'react';
import { dinhDangTien } from '../../dungChung/dinhDang';

export default function ModalHoanTienChotBan({ hoaDon, loi, chan, dangLuu, onDong, onXacNhan }) {
  const [phuongThuc, setPhuongThuc] = useState('');
  const [maChuyenKhoan, setMaChuyenKhoan] = useState('');
  const [daHoan, setDaHoan] = useState(false);
  const chuyenKhoan = phuongThuc === 'vietqr';
  const doiPhuongThuc = event => {
    setPhuongThuc(event.target.value);
    setDaHoan(false);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <section role="dialog" aria-modal="true" aria-label="Hoàn tiền và đóng bàn"
        className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6">
        <h2 className="text-lg font-bold">Hoàn tiền và đóng bàn</h2>
        <dl className="space-y-2 rounded-xl bg-stone-100 p-3 text-sm">
          <div className="flex justify-between"><dt>Tổng bill sau điều chỉnh</dt><dd>{dinhDangTien(hoaDon.tong_tien_thanh_toan)}</dd></div>
          <div className="flex justify-between"><dt>Đã thu</dt><dd>{dinhDangTien(hoaDon.daThu)}</dd></div>
          <div className="flex justify-between font-bold text-rose-800"><dt>Cần hoàn</dt><dd>{dinhDangTien(hoaDon.canHoan)}</dd></div>
        </dl>
        <label className="block text-sm font-semibold">
          Phương thức hoàn
          <select value={phuongThuc} onChange={doiPhuongThuc} disabled={dangLuu} className="mt-1 w-full rounded border p-2">
            <option value="">Chọn phương thức</option>
            <option value="tien_mat">Tiền mặt</option>
            <option value="vietqr">Chuyển khoản thủ công</option>
          </select>
        </label>
        {chuyenKhoan && <label className="block text-sm font-semibold">
          Mã giao dịch hoàn tiền
          <input value={maChuyenKhoan} maxLength={120} disabled={dangLuu}
            onChange={event => { setMaChuyenKhoan(event.target.value); setDaHoan(false); }}
            className="mt-1 w-full rounded border p-2" />
        </label>}
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={daHoan} disabled={dangLuu || !phuongThuc || (chuyenKhoan && !maChuyenKhoan.trim())}
            onChange={event => setDaHoan(event.target.checked)} />
          Tôi đã hoàn {dinhDangTien(hoaDon.canHoan)} cho khách
        </label>
        {(loi || chan) && <p role="alert" className="text-sm text-rose-800">{loi || chan}</p>}
        <div className="flex justify-end gap-2">
          <button disabled={dangLuu} onClick={onDong} className="rounded border px-3 py-2">Quay lại</button>
          <button disabled={dangLuu || Boolean(chan) || !daHoan}
            className="rounded bg-emerald-900 px-3 py-2 font-bold text-white disabled:opacity-50"
            onClick={() => onXacNhan({ soTien: hoaDon.canHoan, phuongThuc, maChuyenKhoan })}>
            Ghi hoàn tiền, đóng bàn &amp; in bill
          </button>
        </div>
      </section>
    </div>
  );
}
