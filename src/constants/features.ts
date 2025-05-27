import { Shield, Truck, Clock } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const features: Feature[] = [
  {
    icon: Shield,
    title: "qualityAssurance",
    description: "qualityAssuranceDescription",
  },
  {
    icon: Truck,
    title: "fastShipping",
    description: "fastShippingDescription",
  },
  {
    icon: Clock,
    title: "expertSupport",
    description: "expertSupportDescription",
  },
]; 