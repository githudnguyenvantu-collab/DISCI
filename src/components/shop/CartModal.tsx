import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Truck, CreditCard, QrCode, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAppStore } from '../../core/store/appStore';
import { APP_CONFIG, calculateShipping } from '../../data/products';
import { Order } from '../../types';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, onOrderSuccess }) => {
  const { cart, updateCartQuantity, removeFromCart, createOrder, profile } = useAppStore();

  const [customerName, setCustomerName] = useState(profile.name);
  const [phone, setPhone] = useState('0987654321');
  const [address, setAddress] = useState('Ký túc xá Khu B ĐHQG, TP. Thủ Đức, TP. Hồ Chí Minh');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'vietqr' | 'momo'>('cod');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.estimatedPriceVnd * item.quantity, 0);
  const shippingFee = calculateShipping(subtotal);
  const total = subtotal + shippingFee;

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const order = createOrder({
      items: [...cart],
      subtotalVnd: subtotal,
      shippingFeeVnd: shippingFee,
      totalVnd: total,
      customerName,
      phone,
      address,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'success', // Trong môi trường thực nghiệm, QR/Momo xác nhận qua cổng
      orderStatus: 'pending_confirmation'
    });

    onOrderSuccess(order);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#4A9DFF] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#18324B] text-base">Giỏ Hàng Dụng Cụ ({cart.length})</h3>
              <p className="text-[11px] text-slate-500 font-medium">Tiết kiệm chi phí • Giao hàng tận nhà/Ký túc xá</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            aria-label="Đóng giỏ hàng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-[#18324B]">Giỏ hàng của bạn đang trống</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Hãy chọn những dụng cụ thiết yếu như dây kháng lực hoặc thảm tập để rèn luyện tại nhà hiệu quả hơn!
            </p>
            <button
              onClick={onClose}
              className="py-2.5 px-6 bg-[#4A9DFF] text-white font-bold rounded-xl text-xs hover:bg-[#3b8beb] shadow-sm"
            >
              Xem danh mục sản phẩm
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Free Shipping Progress */}
            <div className="bg-blue-50/70 p-3 rounded-2xl border border-blue-100 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-blue-900 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#4A9DFF]" />
                  {subtotal >= APP_CONFIG.freeShippingThresholdVnd
                    ? '🎉 Chúc mừng! Bạn đã được Miễn Phí Vận Chuyển'
                    : `Mua thêm ${(APP_CONFIG.freeShippingThresholdVnd - subtotal).toLocaleString('vi-VN')}đ để được Freeship`}
                </span>
                <span className="text-[10px] font-bold text-slate-500">
                  Mức freeship: {APP_CONFIG.freeShippingThresholdVnd.toLocaleString('vi-VN')}đ
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#4A9DFF] h-1.5 rounded-full transition-all"
                  style={{ width: `${Math.min((subtotal / APP_CONFIG.freeShippingThresholdVnd) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="space-y-3">
              {cart.map(item => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200"
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-14 h-14 object-cover rounded-xl flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#18324B] truncate">{item.product.name}</h4>
                    <span className="text-xs font-extrabold text-[#4A9DFF] block mt-0.5">
                      {item.product.estimatedPriceVnd.toLocaleString('vi-VN')} đ
                    </span>

                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-slate-600 hover:bg-slate-100"
                          aria-label="Giảm"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-[#18324B]">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-slate-600 hover:bg-slate-100"
                          aria-label="Tăng"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-slate-400 hover:text-red-500 p-1"
                        aria-label="Xóa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-[#18324B]">
                      {(item.product.estimatedPriceVnd * item.quantity).toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Checkout Form & Address */}
            <form onSubmit={handleCreateOrder} className="pt-2 border-t border-slate-200 space-y-3 text-xs">
              <span className="font-bold text-[#18324B] block">Thông tin giao hàng:</span>

              <div>
                <label className="text-[11px] text-slate-600 block mb-0.5">Họ tên người nhận:</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-600 block mb-0.5">Số điện thoại nhận hàng:</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-600 block mb-0.5">Địa chỉ nhận hàng (Phòng/Tầng KTX hoặc số nhà):</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                />
              </div>

              {/* Payment methods */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[11px] text-slate-600 block">Phương thức thanh toán:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`py-2 px-1 rounded-xl border text-center font-bold text-[11px] transition-all ${
                      paymentMethod === 'cod' ? 'bg-[#4A9DFF] text-white border-[#4A9DFF]' : 'border-slate-200 text-slate-700 bg-slate-50'
                    }`}
                  >
                    💵 Khi nhận (COD)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('vietqr')}
                    className={`py-2 px-1 rounded-xl border text-center font-bold text-[11px] transition-all ${
                      paymentMethod === 'vietqr' ? 'bg-[#4A9DFF] text-white border-[#4A9DFF]' : 'border-slate-200 text-slate-700 bg-slate-50'
                    }`}
                  >
                    📱 Chuyển QR
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('momo')}
                    className={`py-2 px-1 rounded-xl border text-center font-bold text-[11px] transition-all ${
                      paymentMethod === 'momo' ? 'bg-[#4A9DFF] text-white border-[#4A9DFF]' : 'border-slate-200 text-slate-700 bg-slate-50'
                    }`}
                  >
                    💳 Ví MoMo
                  </button>
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5 pt-2">
                <div className="flex justify-between text-slate-600">
                  <span>Tiền hàng:</span>
                  <span className="font-semibold">{subtotal.toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Phí vận chuyển:</span>
                  <span className="font-semibold">
                    {shippingFee === 0 ? <strong className="text-emerald-600">Miễn phí</strong> : `${shippingFee.toLocaleString('vi-VN')} đ`}
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-1.5 flex justify-between text-[#18324B] font-extrabold text-sm">
                  <span>Tổng thanh toán:</span>
                  <span className="text-[#4A9DFF]">{total.toLocaleString('vi-VN')} đ</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#4A9DFF] hover:bg-[#3b8beb] active:scale-98 text-white font-extrabold rounded-2xl text-xs transition-colors shadow-md flex items-center justify-center gap-1.5"
              >
                <span>Xác Nhận Đặt Mua ({total.toLocaleString('vi-VN')} đ)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
