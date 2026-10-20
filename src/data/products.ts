import { Product } from '../types';

export const STORE_PRODUCTS: Product[] = [
  {
    id: 'prod-miniband',
    name: 'Bộ 5 dây kháng lực Miniband DISCI (5 mức độ lực)',
    category: 'essential',
    estimatedPriceVnd: 65000,
    gymCompareCostVnd: 500000,
    purpose: 'Kích hoạt cơ mông, đùi, vai và tay; tập luyện không tiếng ồn tại phòng ngủ hay ký túc xá.',
    isNecessaryForBeginner: true,
    budgetPriority: 1,
    reasonRecommended: 'Chi phí cực thấp (chỉ bằng 2 cốc trà sữa), nhỏ gọn bỏ túi, hiệu quả kích hoạt cơ cao.',
    supplierInfo: 'Đối tác dụng cụ thể thao Hà Nội',
    inStock: true,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-mat',
    name: 'Thảm tập thể dục TPE 6mm êm ái cách âm chống ồn',
    category: 'essential',
    estimatedPriceVnd: 95000,
    gymCompareCostVnd: 450000,
    purpose: 'Bảo vệ khuỷu tay và khớp gối khi plank, chống đẩy; triệt tiêu tiếng động xuống tầng dưới trong ký túc xá.',
    isNecessaryForBeginner: true,
    budgetPriority: 1,
    reasonRecommended: 'Vật dụng nền tảng giúp bảo vệ khớp cột sống và cách âm khi tập tại nhà.',
    supplierInfo: 'Xưởng sản xuất TPE Eco',
    inStock: true,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-powerband',
    name: 'Dây kháng lực Powerband dài 208cm đa năng',
    category: 'essential',
    estimatedPriceVnd: 110000,
    gymCompareCostVnd: 600000,
    purpose: 'Thay thế các máy kéo cáp phòng gym; tập cơ ngực, cơ xô lưng và tay sau.',
    isNecessaryForBeginner: false,
    budgetPriority: 2,
    reasonRecommended: 'Tạo lực cản liên tục dọc đường chuyển động, an toàn cho khớp vai.',
    supplierInfo: 'Thể thao năng động VN',
    inStock: true,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-dumbbells',
    name: 'Cặp tạ tay bọc cao su chống trượt 2kg x 2',
    category: 'secondary',
    estimatedPriceVnd: 145000,
    gymCompareCostVnd: 800000,
    purpose: 'Tăng tải trọng lượng cho Squat, Lunge và tập cơ tay trước, vai.',
    isNecessaryForBeginner: false,
    budgetPriority: 2,
    reasonRecommended: 'Bọc cao su giúp đặt tạ êm không trầy sàn gỗ, trọng lượng vừa sức cho người mới.',
    supplierInfo: 'Xưởng đúc tạ thể thao Thủ Đức',
    inStock: true,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1586401100295-7a8096fd231a?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-pullup-bar',
    name: 'Xà đơn gắn cửa thông minh không cần khoan đục',
    category: 'gym_replacement',
    estimatedPriceVnd: 185000,
    gymCompareCostVnd: 1200000,
    purpose: 'Phát triển toàn diện cơ lưng, vai, xô và bắp tay; kéo giãn cột sống giải tỏa đau mỏi.',
    isNecessaryForBeginner: false,
    budgetPriority: 3,
    reasonRecommended: 'Giải pháp tập cơ lưng xô số 1 tại nhà, lắp đặt trong 2 phút vào khung cửa phòng trọ.',
    supplierInfo: 'Cơ khí thể thao Việt',
    inStock: true,
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1597076537064-16a297eef833?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'prod-ab-roller',
    name: 'Con lăn tập bụng bánh kép siêu chịu lực kèm đệm gối',
    category: 'secondary',
    estimatedPriceVnd: 85000,
    gymCompareCostVnd: 350000,
    purpose: 'Xây dựng cơ bụng 6 múi và sức mạnh cơ lõi vững chắc.',
    isNecessaryForBeginner: false,
    budgetPriority: 2,
    reasonRecommended: 'Hiệu quả kích hoạt cơ bụng cao gấp nhiều lần gập bụng truyền thống.',
    supplierInfo: 'Phụ kiện thể thao Pro',
    inStock: true,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80'
  }
];

export const APP_CONFIG = {
  freeShippingThresholdVnd: 500000,
  defaultShippingFeeVnd: 30000,
  gymMonthlyEstimateVnd: 500000, // Chi phí thẻ tập gym trung bình tại TP.HCM & Hà Nội
  contactPhone: '0901234567',
  supportEmail: 'hotro@disci.vn'
};

export function calculateShipping(subtotalVnd: number): number {
  if (subtotalVnd >= APP_CONFIG.freeShippingThresholdVnd || subtotalVnd === 0) {
    return 0;
  }
  return APP_CONFIG.defaultShippingFeeVnd;
}
