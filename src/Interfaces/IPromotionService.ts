import { Product } from "../Entities/Product";
import { Promotion } from "../Entities/Promotion";
import { PromotionCalculationResult } from "../Entities/PromotionCalculationResult";

export interface IPromotionService {
    calculatePromotion :(products: Product[], promotion: Promotion, selectedYear: number) =>PromotionCalculationResult 
}