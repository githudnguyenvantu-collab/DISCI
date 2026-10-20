import React from 'react';
import { X, CheckCircle2, Package, Truck, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Order } from '../../types';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-slate-100 p-5 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-[#18324B] text-lg">Đặt Hàng Thành Công!</h3>
          <p className="text-xs text-slate-500">Mã đơn hàng: <strong className="text-[#4A9DFF]">{order.id}</strong></p>
        </div>

        {/* Tracking Timeline */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2 text-xs">
          <span className="font-bold text-[#18324B] block mb-1">Trạng thái vận chuyển:</span>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
            <span className="font-semibold text-emerald-700">Đang chờ đối tác xác nhận & đóng gói</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Dự kiến giao trong 1-3 ngày làm việc tới địa chỉ:
          </p>
          <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-[11px] space-y-1">
            <p className="flex items-center gap-1 text-slate-700">
              <Phone className="w-3 h-3 text-slate-400" />
              <span>{order.customerName} - {order.phone}</span>
            </p>
            <p className="flex items-start gap-1 text-slate-600">
              <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0 mt-0.5" />
              <span>{order.address}</span>
            </p>
          </div>
        </div>

        {/* Ordered Items summary */}
        <div className="space-y-1.5 text-xs">
          <span className="font-bold text-[#18324B] block">Sản phẩm đã đặt ({order.items.length}):</span>
          {order.items.map(item => (
            <div key={item.product.id} className="flex justify-between border-b border-slate-100 pb-1 text-slate-700">
              <span className="truncate pr-2">{item.product.name} (x{item.quantity})</span>
              <span className="font-semibold flex-shrink-0">
                {(item.product.estimatedPriceVnd * item.quantity).toLocaleString('vi-VN')} đ
              </span>
            </div>
          ))}
          <div className="flex justify-between pt-1 font-bold text-[#18324B]">
            <span>Tổng thanh toán:</span>
            <span className="text-[#4A9DFF] font-extrabold">{order.totalVnd.toLocaleString('vi-VN')} đ</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-[#4A9DFF] hover:bg-[#3b8beb] text-white font-extrabold rounded-2xl text-xs transition-colors shadow-sm"
        >
          Hoàn Tất & Tiếp Tục Tập
        </button>
      </div>
    </div>
  );
};
