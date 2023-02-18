import type { Database } from "./schema.types";

export type RestaurantDb = Database["public"]["Tables"]["Restaurant"]["Row"];
export type DetailDb = Database["public"]["Tables"]["Detail"]["Row"];

export type RestaurantDetail = {
  id: number;
  name: string;
  Detail: DetailDb[];
};
