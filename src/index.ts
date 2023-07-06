import { Product } from "./Entities/Product";
import { PromotionService } from "./Services/PromotionService";
import { DiscountService } from "./Services/DiscountService";
import { Promotion } from "./Entities/Promotion";

export type ServiceYear = 2020 | 2021 | 2022;
export type ServiceType = "Photography" | "VideoRecording" | "BlurayPackage" | "TwoDayEvent" | "WeddingSession";

interface Price {
    [key: number]: {
      [key in ServiceType]: number;
    };
  }

  const prices: Price = {
      2020: {
        Photography: 1700,
        VideoRecording: 1700,
        BlurayPackage: 300,
        TwoDayEvent: 400,
        WeddingSession: 600,
      },
      2021: {
        Photography: 1800,
        VideoRecording: 1800,
        BlurayPackage: 300,
        TwoDayEvent: 400,
        WeddingSession: 600,
      },
      2022: {
        Photography: 1900,
        VideoRecording: 1900,
        BlurayPackage: 300,
        TwoDayEvent: 400,
        WeddingSession: 600,
      },
    };

  const availablePromotions: Promotion[] = [
    // Package of photography + videography costs less 
    {
        id: 1,
        title: "Photography + videography package",
        productName: "Photography",
        compatibleProductsNames: ["VideoRecording"],
        type: "DateDependent",
        dependentOnDatePriceDiscount: new Map([
          // Looks ugly... Should be placed in db, but we hardcode this way for now.
            [2020, prices[2020]["Photography"] + prices[2020]["VideoRecording"] - 2200],
            [2021, prices[2021]["Photography"] + prices[2021]["VideoRecording"] - 2300],
            [2022, prices[2022]["Photography"] + prices[2022]["VideoRecording"] - 2500],
          ]),
        yearsAvailable: [2020, 2021, 2022]
    },
    // Wedding session costs regularly $600, but in a package with photography or with a video recording it costs $300
    { 
        id: 2, 
        title: "Wedding session + photography or videography package", 
        productName: "WeddingSession", 
        compatibleProductsNames: ["Photography", "VideoRecording"], 
        type: "Fixed",
        fixedPriceDiscount: 300,
        yearsAvailable: [2020, 2021, 2022] 
    },
    // Wedding session is free if the client chooses Photography during the wedding in 2022
    { 
        id: 3, 
        title: "Free wedding session with photography in 2022", 
        productName: "WeddingSession", 
        compatibleProductsNames: ["Photography"], 
        type: "Percentage",
        percentagePriceDiscount: 100,
        yearsAvailable: [2022]
    },
]

export const updateSelectedServices = (
  previouslySelectedServices: ServiceType[],
  action: { type: "Select" | "Deselect"; service: ServiceType }
): ServiceType[] => {
  const { type, service } = action;

  switch (type)
  {
    case "Select":
    {
      if (service === "BlurayPackage" && !previouslySelectedServices.includes("BlurayPackage")) {
        if (previouslySelectedServices.includes("VideoRecording")) {
          return [...previouslySelectedServices, service];
        } else {
          // VideoRecording is required for BlurayPackage
          return previouslySelectedServices; 
        }
      }
  
      if (service === "TwoDayEvent" && !previouslySelectedServices.includes("TwoDayEvent")) {
        if (previouslySelectedServices.includes("VideoRecording") || previouslySelectedServices.includes("Photography")) {
          return [...previouslySelectedServices, service];
        } else {
          // VideoRecording or Photography is required for TwoDayEvent
          return previouslySelectedServices; 
        }
      }
  
      if (!previouslySelectedServices.includes(service)) {
        return [...previouslySelectedServices, service];
      }

      return previouslySelectedServices;
    }
    case "Deselect":
    {
      if (!previouslySelectedServices.includes(service)) {
        // Service not selected, no change needed
        return previouslySelectedServices; 
      }
  
      // Remove selected service instantly
      const remainingServices = previouslySelectedServices.filter(s => s !== service);
  
      // Check if after removal of deselected service BlurayPackage has required VideoRecording service
      if (service === "BlurayPackage" && previouslySelectedServices.includes("VideoRecording")) {
        // if not, remove BluRayPackage aswell
        return remainingServices.filter(s => s !== "BlurayPackage");
      }
  
      if (service === "Photography" || service === "VideoRecording" && previouslySelectedServices.includes("TwoDayEvent")) {
        // If you deselect Photography or VideoRecording, check if one of these still remains selected
        if(remainingServices.includes("Photography") || remainingServices.includes("VideoRecording"))
        {
          // If it is, TwoDayEvent should remain selected
          return remainingServices;
        }
        
        // If no required services for TwoDayEvent (Photography or VideoRecording) are present after changes, deselect TwoDayEvent too.
        return remainingServices.filter(s => s !== "TwoDayEvent");
      }
  
      return remainingServices;
    }
    default:
      return previouslySelectedServices;
  }


};

export const calculatePrice = (selectedServices: ServiceType[], selectedYear: ServiceYear) => {

    const products: Product[] = [];

    // Pack services into product class for usability
    selectedServices.forEach((service, index) => {
        const product: Product = { id: index, name: service.toString(), price: prices[selectedYear][service] };
        products.push(product)
    });

    const promotionService: PromotionService = new PromotionService();

    const discountService: DiscountService = new DiscountService(promotionService);

    const result = discountService.calculate(products, availablePromotions, selectedYear);

    return ({ basePrice: result.basePrice, finalPrice: result.finalPrice })
}
