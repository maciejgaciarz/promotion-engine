import { ServiceYear } from "..";
import { DiscountType } from "./Types/DiscountType";

export class Promotion {
    id: number;
    title: string;
    // to which one promotion will be applied
    productName: string;
    // to which ones promotion will work with
    compatibleProductsNames: string[];
    type: DiscountType;
    yearsAvailable: ServiceYear[];
    fixedPriceDiscount?: number;
    percentagePriceDiscount?: number;
    dependentOnDatePriceDiscount?: Map<number, number>
  }
