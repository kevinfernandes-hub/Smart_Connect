import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface IntercroppingPattern {
  pattern: string;
  cottonRows: number;
  turRows: number;
  rowSpacing: string;
  benefits: string[];
  expectedYield: {
    cotton: string;
    tur: string;
  };
}

const patterns: IntercroppingPattern[] = [
  {
    pattern: "2:1 (Cotton:Tur)",
    cottonRows: 2,
    turRows: 1,
    rowSpacing: "90cm Cotton / 45cm Tur",
    benefits: [
      "Efficient land use with 25-30% additional income from Tur",
      "Tur acts as windbreak for cotton",
      "Improves soil nitrogen through legume fixation",
      "Reduces pest incidence in cotton"
    ],
    expectedYield: {
      cotton: "10-12 qtl/acre",
      tur: "3-4 qtl/acre"
    }
  },
  {
    pattern: "3:1 (Cotton:Tur)",
    cottonRows: 3,
    turRows: 1,
    rowSpacing: "90cm Cotton / 60cm Tur",
    benefits: [
      "Higher cotton yield with supplementary Tur income",
      "Minimal competition between crops",
      "Better mechanization possible",
      "Suitable for medium soil fertility"
    ],
    expectedYield: {
      cotton: "11-13 qtl/acre",
      tur: "2-3 qtl/acre"
    }
  },
  {
    pattern: "4:2 (Cotton:Tur)",
    cottonRows: 4,
    turRows: 2,
    rowSpacing: "75cm Cotton / 60cm Tur",
    benefits: [
      "Balanced intercropping system",
      "Good for assured irrigation areas",
      "Maximum soil health benefits",
      "Better weed suppression"
    ],
    expectedYield: {
      cotton: "10-11 qtl/acre",
      tur: "4-5 qtl/acre"
    }
  }
];

export default function TurIntercroppingCard() {
  const [selectedPattern, setSelectedPattern] = useState(0);
  const [acreage, setAcreage] = useState(1);
  const [cottonPrice, setCottonPrice] = useState(6500);
  const [turPrice, setTurPrice] = useState(7000);

  const pattern = patterns[selectedPattern];

  const calculateRevenue = () => {
    const cottonYield = parseFloat(pattern.expectedYield.cotton.split("-")[0]) * acreage;
    const turYield = parseFloat(pattern.expectedYield.tur.split("-")[0]) * acreage;
    const cottonRevenue = cottonYield * cottonPrice;
    const turRevenue = turYield * turPrice;
    const totalRevenue = cottonRevenue + turRevenue;
    return { cottonRevenue, turRevenue, totalRevenue };
  };

  const { cottonRevenue, turRevenue, totalRevenue } = calculateRevenue();

  return (
    <Card className="tur-intercropping-card">
      <CardHeader>
        <CardTitle>🌾 Tur-Cotton Intercropping Planner</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Acreage</label>
              <Input
                type="number"
                value={acreage}
                onChange={(e) => setAcreage(Number(e.target.value))}
                min={1}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Cotton Price (₹/qtl)</label>
              <Input
                type="number"
                value={cottonPrice}
                onChange={(e) => setCottonPrice(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tur Price (₹/qtl)</label>
              <Input
                type="number"
                value={turPrice}
                onChange={(e) => setTurPrice(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Select Intercropping Pattern</label>
            <Select value={selectedPattern.toString()} onValueChange={(val) => setSelectedPattern(Number(val))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {patterns.map((p, idx) => (
                  <SelectItem key={idx} value={idx.toString()}>
                    {p.pattern}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card className="bg-gradient-to-r from-green-50 to-blue-50">
            <CardContent className="pt-4">
              <h3 className="font-semibold text-lg mb-3">{pattern.pattern}</h3>
              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div>
                  <p className="text-gray-600">Cotton Rows</p>
                  <p className="font-semibold text-xl">{pattern.cottonRows}</p>
                </div>
                <div>
                  <p className="text-gray-600">Tur Rows</p>
                  <p className="font-semibold text-xl">{pattern.turRows}</p>
                </div>
              </div>
              <p className="text-sm"><strong>Row Spacing:</strong> {pattern.rowSpacing}</p>
            </CardContent>
          </Card>

          <div>
            <h4 className="font-semibold mb-2">Expected Yields & Revenue</h4>
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-yellow-50">
                <CardContent className="pt-3">
                  <p className="text-xs text-gray-600">Cotton</p>
                  <p className="font-semibold">{pattern.expectedYield.cotton}</p>
                  <p className="text-sm text-green-600 mt-1">₹{cottonRevenue.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card className="bg-purple-50">
                <CardContent className="pt-3">
                  <p className="text-xs text-gray-600">Tur</p>
                  <p className="font-semibold">{pattern.expectedYield.tur}</p>
                  <p className="text-sm text-green-600 mt-1">₹{turRevenue.toLocaleString()}</p>
                </CardContent>
              </Card>
            </div>
            <Card className="mt-3 bg-green-100 border-green-300">
              <CardContent className="pt-3">
                <p className="text-sm text-gray-700">Total Expected Revenue</p>
                <p className="text-2xl font-bold text-green-700">₹{totalRevenue.toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Key Benefits</h4>
            <ul className="space-y-2">
              {pattern.benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start text-sm">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <Card className="bg-blue-50">
            <CardContent className="pt-3 text-sm">
              <h4 className="font-semibold mb-2">Management Tips</h4>
              <ul className="space-y-1 text-xs">
                <li>• Sow Tur 2-3 weeks before cotton for better establishment</li>
                <li>• Use medium duration Tur varieties (140-160 days)</li>
                <li>• Apply phosphorus at sowing for both crops</li>
                <li>• Tur provides natural mulch after cotton harvest</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
