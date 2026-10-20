import React, { useState } from 'react';
import {
  ShoppingBag,
  Filter,
  DollarSign,
  TrendingDown,
  Star,
  CheckCircle2,
  PackageCheck,
  Plus,
  Info,
  Truck
} from 'lucide-react';
import { useAppStore } from '../../core/store/appStore';
import { STORE_PRODUCTS, APP_CONFIG } from '../../data/products';
import { CartModal } from './CartModal';
import { OrderSuccessModal } from './OrderSuccessModal';
import { Order, Product } from '../../types';

export const ShopTab: React.FC = () => {
  const { cart, addToCart, orders } = useAppStore();

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'essential' | 'secondary' | 'gym_replacement'>('all');
  const [maxBudget, setMaxBudget] = useState<number>(300000);
  const [gymMonthlyCostInput, setGymMonthlyCostInput] = useState<number>(500000);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [successOrder, setSuccessOrder] = useState<Order | null>(null);
  const [addedFeedbackId, setAddedFeedbackId] = useState<string | null>(null);

  // Filter products by category and budget
  const filteredProducts = STORE_PRODUCTS.filter(p => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (maxBudget > 0 && p.estimatedPriceVnd > maxBudget) return false;
    return true;
  });

  // Calculate annual gym saving
  const essentialProductsCost = STORE_PRODUCTS.filter(p => p.category === 'essential')
    .reduce((sum, p) => sum + p.estimatedPriceVnd, 0); // e.g. 65k + 95k + 110k = 270k
  const annualGymCost = gymMonthlyCostInput * 12; // e.g. 6.000.000 đ
  const annualSavings = Math.max(annualGymCost - essentialProductsCost, 0);

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (product: Product) => {
    addToCart(product.id, 1);
    setAddedFeedbackId(product.id);
    setTimeout(() => setAddedFeedbackId(null), 1500);
  };

  return (
    <div className="pb-24 pt-2 px-4 max-w-md mx-auto space-y-4">
      {/* Header with Cart Button */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl font-extrabold text-[#18324B] tracking-tight">Dụng Cụ Tiết Kiệm</h1>
          <p className="text-xs text-slate-500 font-medium">Chi phí tối thiểu • Tối ưu không gian phòng trọ/nhà</p>
        </div>

        <button
          onClick={() => setIsCartOpen(true)}
          className="relative bg-[#4A9DFF] text-white p-2.5 rounded-2xl shadow-sm hover:bg-[#3b8beb] transition-colors"
          aria-label="Giỏ hàng"
        >
          <ShoppingBag className="w-4 h-4" />
          {cartTotalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
              {cartTotalItems}
            </span>
          )}
        </button>
      </div>

      {/* Gym Cost vs DISCI Home Workout Comparison Tool */}
      <div className="bg-gradient-to-br from-[#18324B] to-[#254563] text-white rounded-3xl p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" /> Tiết kiệm tới {(annualSavings / 1000000).toFixed(1)} triệu / năm
          </span>
          <span className="text-[10px] text-slate-300">Công cụ so sánh ngân sách</span>
        </div>

        <h3 className="text-base font-extrabold leading-snug">
          Đầu tư trọn bộ DISCI chỉ bằng <span className="text-[#8ECAFF]">1/2 tháng thẻ gym</span>
        </h3>

        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
          <div className="bg-white/10 p-2.5 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-300 block">Thẻ phòng gym bình dân:</span>
            <span className="font-extrabold text-base text-red-300">
              {gymMonthlyCostInput.toLocaleString('vi-VN')} đ
            </span>
            <span className="text-[9px] text-slate-400 block mt-0.5">mỗi tháng (~6 triệu/năm)</span>
          </div>

          <div className="bg-white/15 p-2.5 rounded-2xl border border-[#8ECAFF]/40">
            <span className="text-[10px] text-[#8ECAFF] block font-bold">Trọn bộ dây & thảm DISCI:</span>
            <span className="font-extrabold text-base text-emerald-300">
              {essentialProductsCost.toLocaleString('vi-VN')} đ
            </span>
            <span className="text-[9px] text-emerald-200 block mt-0.5">mua 1 lần dùng cả năm</span>
          </div>
        </div>

        <p className="text-[10px] text-slate-300 leading-relaxed italic">
          * Không tốn tiền xăng xe, không lo ngại giờ cao điểm đông đúc, rèn luyện linh hoạt mọi lúc mọi nơi.
        </p>
      </div>

      {/* Budget and Category Filters */}
      <div className="bg-white rounded-3xl p-4 border border-[#8ECAFF]/40 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#18324B] flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[#4A9DFF]" />
            <span>Lọc theo ngân sách:</span>
          </span>
          <span className="text-xs font-extrabold text-[#4A9DFF]">
            {maxBudget >= 500000 ? 'Tất cả mức giá' : `Dưới ${maxBudget.toLocaleString('vi-VN')} đ`}
          </span>
        </div>

        <input
          type="range"
          min="50000"
          max="500000"
          step="50000"
          value={maxBudget}
          onChange={(e) => setMaxBudget(Number(e.target.value))}
          className="w-full accent-[#4A9DFF]"
        />

        <div className="flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'essential', label: 'Thiết yếu giá rẻ' },
            { id: 'secondary', label: 'Mở rộng' },
            { id: 'gym_replacement', label: 'Thay máy gym' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`py-1.5 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#4A9DFF] text-white shadow-2xs font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products List */}
      <div className="space-y-3">
        {filteredProducts.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 bg-white rounded-3xl p-6 border border-slate-200">
            Không có sản phẩm nào trong mức ngân sách này. Hãy thử kéo tăng ngân sách.
          </div>
        ) : (
          filteredProducts.map(product => {
            const isAdded = addedFeedbackId === product.id;
            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl p-4 border border-[#8ECAFF]/40 shadow-xs hover:border-[#4A9DFF] transition-all flex flex-col sm:flex-row gap-3"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full sm:w-28 h-28 object-cover rounded-2xl flex-shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        {product.isNecessaryForBeginner && (
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full inline-block mb-1">
                            Cần thiết nhất cho người mới
                          </span>
                        )}
                        <h3 className="text-xs font-extrabold text-[#18324B] leading-snug">{product.name}</h3>
                      </div>
                      <span className="text-xs font-black text-[#4A9DFF] whitespace-nowrap">
                        {product.estimatedPriceVnd.toLocaleString('vi-VN')} đ
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      {product.purpose}
                    </p>

                    <div className="bg-[#F4F9FF] p-2 rounded-xl mt-2 text-[10px] text-slate-600 border border-blue-50">
                      <span className="font-bold text-[#18324B]">Lý do đề xuất:</span> {product.reasonRecommended}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-1 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400">
                      Nguồn: {product.supplierInfo || 'Xưởng thể thao VN'}
                    </span>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`py-1.5 px-3.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#4A9DFF] hover:bg-[#3b8beb] text-white shadow-2xs'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Đã thêm</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Thêm vào giỏ</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Orders history preview if any */}
      {orders.length > 0 && (
        <div className="bg-white rounded-3xl p-4 border border-[#8ECAFF]/40 shadow-xs space-y-2">
          <span className="text-xs font-bold text-[#18324B] block">Đơn hàng gần đây ({orders.length}):</span>
          <div className="space-y-2">
            {orders.map(o => (
              <div key={o.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex justify-between items-center">
                <div>
                  <span className="font-bold text-[#18324B]">Đơn {o.id}</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">{o.items.length} món • {o.totalVnd.toLocaleString('vi-VN')} đ</p>
                </div>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                  Chờ xác nhận
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cart Modal */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOrderSuccess={(order) => {
          setIsCartOpen(false);
          setSuccessOrder(order);
        }}
      />

      {/* Order Success Modal */}
      <OrderSuccessModal
        order={successOrder}
        onClose={() => setSuccessOrder(null)}
      />
    </div>
  );
};
