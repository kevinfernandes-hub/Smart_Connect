import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";

interface FarmerData {
  landSize: number;
  hasKisanCard: boolean;
  annualIncome: number;
  cropInsured: boolean;
  hasKCC: boolean;
  state: string;
}

interface SchemeEligibility {
  name: string;
  eligible: boolean;
  reason: string;
  benefits: string[];
  howToApply: string;
}

export default function GovernmentSchemeCard() {
  const [farmerData, setFarmerData] = useState<FarmerData>({
    landSize: 0,
    hasKisanCard: false,
    annualIncome: 0,
    cropInsured: false,
    hasKCC: false,
    state: "Maharashtra"
  });

  const checkEligibility = (): SchemeEligibility[] => {
    const schemes: SchemeEligibility[] = [
      {
        name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
        eligible: farmerData.landSize > 0,
        reason: farmerData.landSize > 0 
          ? "You are eligible! All landholding farmers qualify." 
          : "You need to have cultivable land.",
        benefits: [
          "₹6,000 per year in 3 equal installments",
          "Direct transfer to bank account",
          "No land size limit",
          "Both small and marginal farmers covered"
        ],
        howToApply: "Visit pmkisan.gov.in or nearest Common Service Centre (CSC)"
      },
      {
        name: "PMFBY (Pradhan Mantri Fasal Bima Yojana)",
        eligible: farmerData.landSize > 0 && !farmerData.cropInsured,
        reason: farmerData.cropInsured 
          ? "You already have crop insurance" 
          : farmerData.landSize > 0 
            ? "You are eligible for crop insurance!" 
            : "You need to have cultivable land.",
        benefits: [
          "Premium: 2% for Kharif, 1.5% for Rabi",
          "Coverage against natural calamities",
          "Coverage from sowing to post-harvest",
          "Prevented sowing claims available"
        ],
        howToApply: "Apply through bank, CSC, or agriculture department during crop season"
      },
      {
        name: "KCC (Kisan Credit Card)",
        eligible: farmerData.landSize > 0 && !farmerData.hasKCC,
        reason: farmerData.hasKCC 
          ? "You already have a Kisan Credit Card" 
          : farmerData.landSize > 0 
            ? "You qualify for Kisan Credit Card!" 
            : "You need to have cultivable land.",
        benefits: [
          "Credit limit based on land size and crop",
          "4% interest rate (with prompt repayment)",
          "Covers agriculture and allied activities",
          "Includes personal accident insurance"
        ],
        howToApply: "Visit any cooperative bank, regional rural bank, or commercial bank"
      },
      {
        name: "Soil Health Card Scheme",
        eligible: farmerData.landSize > 0,
        reason: "All farmers are eligible for free soil testing",
        benefits: [
          "Free soil testing every 2 years",
          "Crop-wise fertilizer recommendations",
          "Reduces input costs",
          "Improves soil health and productivity"
        ],
        howToApply: "Contact your local agriculture department or soil testing laboratory"
      },
      {
        name: "Maharashtra Baliraja Krishi Pump Scheme",
        eligible: farmerData.state === "Maharashtra" && farmerData.landSize > 0,
        reason: farmerData.state === "Maharashtra" 
          ? "Available for Maharashtra farmers!" 
          : "This scheme is for Maharashtra farmers only",
        benefits: [
          "10 HP agricultural pump connection",
          "Subsidy on electricity charges",
          "₹10,000 per HP subsidy",
          "Priority to small and marginal farmers"
        ],
        howToApply: "Apply through MSEDCL portal or agriculture department"
      }
    ];

    return schemes;
  };

  const eligibility = checkEligibility();
  const eligibleCount = eligibility.filter(s => s.eligible).length;

  return (
    <Card className="government-scheme-card">
      <CardHeader>
        <CardTitle>🏛️ Government Scheme Eligibility Checker</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="checker">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="checker">Check Eligibility</TabsTrigger>
            <TabsTrigger value="results">Results ({eligibleCount})</TabsTrigger>
          </TabsList>

          <TabsContent value="checker" className="space-y-4">
            <Alert>
              <AlertDescription>
                Enter your details to check eligibility for various government schemes
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Land Size (in acres)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={farmerData.landSize}
                  onChange={(e) => setFarmerData({...farmerData, landSize: Number(e.target.value)})}
                  placeholder="Enter your land size"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">State</label>
                <select 
                  className="w-full p-2 border rounded"
                  value={farmerData.state}
                  onChange={(e) => setFarmerData({...farmerData, state: e.target.value})}
                >
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Annual Income (₹)</label>
                <Input
                  type="number"
                  value={farmerData.annualIncome}
                  onChange={(e) => setFarmerData({...farmerData, annualIncome: Number(e.target.value)})}
                  placeholder="Approximate annual income"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={farmerData.hasKisanCard}
                    onChange={(e) => setFarmerData({...farmerData, hasKisanCard: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">I have PM-KISAN registration</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={farmerData.cropInsured}
                    onChange={(e) => setFarmerData({...farmerData, cropInsured: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">I have crop insurance</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={farmerData.hasKCC}
                    onChange={(e) => setFarmerData({...farmerData, hasKCC: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">I have Kisan Credit Card</span>
                </label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg mb-4">
              <h3 className="text-lg font-semibold mb-1">
                You are eligible for {eligibleCount} scheme{eligibleCount !== 1 ? 's' : ''}!
              </h3>
              <p className="text-sm text-gray-600">
                Explore the schemes below and apply for benefits
              </p>
            </div>

            {eligibility.map((scheme, idx) => (
              <Card key={idx} className={scheme.eligible ? "border-green-500 border-2" : "opacity-60"}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-lg">{scheme.name}</h4>
                    {scheme.eligible ? (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Eligible</span>
                    ) : (
                      <span className="bg-gray-400 text-white text-xs px-2 py-1 rounded">Not Eligible</span>
                    )}
                  </div>

                  <p className={`text-sm mb-3 ${scheme.eligible ? 'text-green-700' : 'text-gray-600'}`}>
                    {scheme.reason}
                  </p>

                  {scheme.eligible && (
                    <>
                      <div className="mb-3">
                        <h5 className="font-semibold text-sm mb-1">Key Benefits:</h5>
                        <ul className="space-y-1">
                          {scheme.benefits.map((benefit, bIdx) => (
                            <li key={bIdx} className="text-sm flex items-start">
                              <span className="text-green-500 mr-2">•</span>
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-blue-50 p-3 rounded text-sm">
                        <h5 className="font-semibold mb-1">How to Apply:</h5>
                        <p>{scheme.howToApply}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}

            <Card className="bg-yellow-50">
              <CardContent className="pt-4 text-sm">
                <h4 className="font-semibold mb-2">📞 Need Help?</h4>
                <p>Contact your nearest Agriculture Office or Krishi Vigyan Kendra (KVK)</p>
                <p className="mt-2"><strong>PM-KISAN Helpline:</strong> 155261 / 1800-115-526</p>
                <p><strong>PMFBY Helpline:</strong> 1800-266-6868</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
