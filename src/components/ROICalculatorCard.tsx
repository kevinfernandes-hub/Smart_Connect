import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface CropData {
  name: string;
  yieldPerAcre: number; // in quintals
  pricePerQuintal: number; // in rupees
  seedCost: number;
  fertilizerCost: number;
  pesticideCost: number;
  laborCost: number;
  irrigationCost: number;
  otherCosts: number;
}

const defaultCrops: CropData[] = [
  {
    name: "Cotton",
    yieldPerAcre: 12,
    pricePerQuintal: 6500,
    seedCost: 3000,
    fertilizerCost: 8000,
    pesticideCost: 5000,
    laborCost: 12000,
    irrigationCost: 6000,
    otherCosts: 3000
  },
  {
    name: "Soybean",
    yieldPerAcre: 15,
    pricePerQuintal: 4500,
    seedCost: 2000,
    fertilizerCost: 6000,
    pesticideCost: 3000,
    laborCost: 8000,
    irrigationCost: 4000,
    otherCosts: 2000
  },
  {
    name: "Tur (Pigeon Pea)",
    yieldPerAcre: 8,
    pricePerQuintal: 7000,
    seedCost: 2500,
    fertilizerCost: 5000,
    pesticideCost: 3500,
    laborCost: 9000,
    irrigationCost: 3000,
    otherCosts: 2000
  }
];

export default function ROICalculatorCard() {
  const [crops, setCrops] = useState<CropData[]>(defaultCrops);
  const [acreage, setAcreage] = useState(1);

  const calculateROI = (crop: CropData) => {
    const revenue = crop.yieldPerAcre * crop.pricePerQuintal * acreage;
    const totalCost = (crop.seedCost + crop.fertilizerCost + crop.pesticideCost + 
                       crop.laborCost + crop.irrigationCost + crop.otherCosts) * acreage;
    const profit = revenue - totalCost;
    const roi = ((profit / totalCost) * 100).toFixed(2);
    return { revenue, totalCost, profit, roi };
  };

  const sortedCrops = [...crops].sort((a, b) => {
    const roiA = calculateROI(a).profit;
    const roiB = calculateROI(b).profit;
    return roiB - roiA;
  });

  return (
    <Card className="roi-calculator-card">
      <CardHeader>
        <CardTitle>ROI Per Acre Profit Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Enter Acreage:
          </label>
          <Input
            type="number"
            value={acreage}
            onChange={(e) => setAcreage(Number(e.target.value))}
            min={1}
            className="w-32"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Top 3 Crop Comparison</h3>
          {sortedCrops.map((crop, index) => {
            const { revenue, totalCost, profit, roi } = calculateROI(crop);
            return (
              <Card key={crop.name} className={`border-2 ${index === 0 ? 'border-green-500' : ''}`}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-bold">{crop.name}</h4>
                    {index === 0 && <span className="text-sm bg-green-500 text-white px-2 py-1 rounded">Best ROI</span>}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-600">Revenue:</p>
                      <p className="font-semibold">₹{revenue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total Cost:</p>
                      <p className="font-semibold">₹{totalCost.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Profit:</p>
                      <p className={`font-semibold ${profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ₹{profit.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">ROI:</p>
                      <p className={`font-semibold ${Number(roi) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {roi}%
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    <p>Yield: {crop.yieldPerAcre} qtl/acre @ ₹{crop.pricePerQuintal}/qtl</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
