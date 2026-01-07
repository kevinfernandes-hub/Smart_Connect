import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";

interface PriceItem {
  commodity: string;
  market: string;
  price: number; // Rs/qtl
}

const DEFAULT_PRICES: PriceItem[] = [
  { commodity: "Cotton", market: "Nagpur", price: 7200 },
  { commodity: "Tur", market: "Amravati", price: 8500 },
  { commodity: "Soybean", market: "Wardha", price: 4650 },
  { commodity: "Wheat", market: "Akola", price: 2400 },
];

export function PriceTicker() {
  const [prices, setPrices] = useState<PriceItem[]>(() => {
    const saved = localStorage.getItem("price_ticker");
    return saved ? JSON.parse(saved) : DEFAULT_PRICES;
  });

  useEffect(() => {
    localStorage.setItem("price_ticker", JSON.stringify(prices));
  }, [prices]);

  return (
    <Card className="overflow-hidden border-green-200">
      <CardContent className="p-0 bg-green-50">
        <div className="w-full whitespace-nowrap overflow-hidden">
          <div
            className="animate-[ticker_25s_linear_infinite] flex gap-8 py-2 px-4"
            style={{
              // Fallback keyframes if not globally defined
              // Add in CSS if needed: @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
            }}
          >
            {[...prices, ...prices].map((p, idx) => (
              <div key={idx} className="text-sm flex items-center gap-2">
                <span className="font-semibold text-green-700">{p.commodity}</span>
                <span className="text-gray-500">({p.market})</span>
                <span className="font-medium">₹{p.price.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
