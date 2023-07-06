import { Product } from "../Entities/Product";
import { Promotion } from "../Entities/Promotion";
import { ServiceYear } from "..";
import { PriceResult } from "../Entities/PriceResult";

export interface IDiscountService {
    calculate: (products: Product[], promotions: Promotion[], selectedYear: ServiceYear) => PriceResult
}