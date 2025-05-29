import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";

interface SizeSelectionProps {
  sizes: string[];
  selectedSizes: string[];
  onSizeChange: (sizes: string[]) => void;
}

const SizeSelection: React.FC<SizeSelectionProps> = ({
  sizes,
  selectedSizes,
  onSizeChange,
}) => {
  const { t } = useLanguage();

  if (!sizes || sizes.length === 0) return null;

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-muted-foreground">
        {t("selectSizes")}
      </h4>
      <div className="card-section p-3 bg-muted/50">
        <div className="flex flex-wrap gap-3">
          {sizes.map((size) => (
            <div key={size} className="flex items-center space-x-2">
              <Checkbox
                id={`size-${size}`}
                checked={selectedSizes.includes(size)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onSizeChange([...selectedSizes, size]);
                  } else {
                    onSizeChange(selectedSizes.filter((s) => s !== size));
                  }
                }}
              />
              <Label
                htmlFor={`size-${size}`}
                className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
              >
                {size}
              </Label>
            </div>
          ))}
        </div>
      </div>
      {selectedSizes.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {t("selectedSizes")}: {selectedSizes.join(", ")}
        </p>
      )}
    </div>
  );
};

export default SizeSelection;
