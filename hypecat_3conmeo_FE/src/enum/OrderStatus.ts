export const OrderStatus = {
  PENDING: "Pending",
  FINISH: "Finish",
  CANCELED: "Canceled",
  PREPARED: "Prepared",
};

export type OrderStatusType = (typeof OrderStatus)[keyof typeof OrderStatus];

export const OrderStatusLabelMap: Record<OrderStatusType, string> = {
  [OrderStatus.PENDING]: "Chờ xử lý",
  [OrderStatus.PREPARED]: "Đang chuẩn bị",
  [OrderStatus.FINISH]: "Hoàn thành",
  [OrderStatus.CANCELED]: "Đã hủy",
};