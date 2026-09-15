import { MessageNotice, AdminMessageNotice } from "./message";
import { managerRoutes, adminRoutes, authRoutes, staffRoutes, customerRoutes } from "./routes";

const config = {
  authRoutes,
  managerRoutes,
  adminRoutes,
  staffRoutes,
  customerRoutes,
  MessageNotice,
  AdminMessageNotice,
};

export default config;
