import { PriceResult } from "../Entities/PriceResult";
import { Product } from "../Entities/Product";
import { Promotion } from "../Entities/Promotion";
import { PromotionCalculationResult } from "../Entities/PromotionCalculationResult";
import { PromotionService } from "./PromotionService";
import { IDiscountService } from "../Interfaces/IDiscountService";
import { ServiceYear } from "..";

export class DiscountService implements IDiscountService {
    constructor(private promotionService: PromotionService) {}
    
    calculate(products: Product[], promotions: Promotion[], selectedYear: ServiceYear): PriceResult {
        
        const basePrice = products
          .map(a => a.price)
          .reduce((a,b) => a + b, 0);          
        let finalPrice = 0;

        if(products.length === 0)
        {
            return { basePrice, finalPrice }
        }

        // Take all promotions that are defined for one product, and have at least one of their associated compatible promotion product as well.
        // Take year the promotion is valid for into account aswell.
        const eligiblePromotions = promotions.filter(promotion => products.some(product => product.name === promotion.productName) &&
            promotion.compatibleProductsNames.some(name => products.some(product => product.name === name)) &&
            promotion.yearsAvailable.includes(selectedYear));

        if(eligiblePromotions.length === 0)
        {
            // No promos, count single items
            finalPrice = products
              .map(p => p.price)
              .reduce((a,b) => a + b, 0);

            return { basePrice, finalPrice }
        }

        const promotionsResults: PromotionCalculationResult[] = [];

        for (const promotion of eligiblePromotions) {
          const calculationResult = this.promotionService.calculatePromotion(products, promotion, selectedYear);
                  
          // Check if there already is a promo for this product
          const existingPromo = promotionsResults.find(d => d.promotionProduct === promotion.productName);

          // If it's a better promo, replace it
          if(existingPromo && existingPromo.promotionDiscount < calculationResult.promotionDiscount)
          {
              // Delete old promo
              const index = promotionsResults.findIndex(dr => dr === existingPromo);
              promotionsResults.splice(index, 1);
          }

          promotionsResults.push(calculationResult);
        }      

        // Amount of money free products should have cost
        const freeProductsDiscountAmount = promotionsResults
          .filter(d => d.isFree)
          .map(d => d.promotionDiscount)
          .reduce((a,b) => a + b, 0)
        
        // Sum up rest of the non-free discounts
        const discountSum = promotionsResults
          .filter(d => !d.isFree)
          .map(d => d.promotionDiscount)
          .reduce((a,b) => a + b, 0);

        // Base price, minus all free products price, minus all discounts
        finalPrice = basePrice - freeProductsDiscountAmount - discountSum;
        
        return { basePrice, finalPrice }
    }
  }