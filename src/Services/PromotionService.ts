import { Product } from "../Entities/Product";
import { Promotion } from "../Entities/Promotion";
import { PromotionCalculationResult } from "../Entities/PromotionCalculationResult";
import { IPromotionService } from "../Interfaces/IPromotionService";

export class PromotionService implements IPromotionService {
    
    calculatePromotion(products: Product[], promotion: Promotion, selectedYear: number): PromotionCalculationResult {
        
        const affectedProduct = products.find(p => p.name === promotion.productName);

        if(promotion.type === "DateDependent")
        {
            const discountForYear = promotion.dependentOnDatePriceDiscount.get(selectedYear);
            const result = { 
                promotionTitle: promotion.title, 
                promotionDiscount: discountForYear,
                promotionProduct: promotion.productName,
                isFree: false, 
             }

             if(discountForYear === affectedProduct.price)
             {
                 // This is free, should be always taken into the account
                 return {...result, isFree : true }
             }

             return result;
        }

        if(promotion.type === "Fixed")
        {
            const result = { 
                promotionTitle: promotion.title, 
                promotionDiscount: promotion.fixedPriceDiscount,
                promotionProduct: promotion.productName,
                isFree: false, 
             }

            if(promotion.fixedPriceDiscount === affectedProduct.price)
            {
                return {...result, isFree : true }
            }
    
             return result;
        }

        if(promotion.type === "Percentage")
        {
            const discountAmount = affectedProduct.price * promotion.percentagePriceDiscount / 100;
            const result = { 
                promotionTitle: promotion.title, 
                promotionDiscount: discountAmount,
                promotionProduct: promotion.productName,
                isFree: false, 
             }
            
            if(discountAmount === affectedProduct.price)
            {
                return {...result, isFree : true }
            }
            
            return result;
        }
    }
  }

