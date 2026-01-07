import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";

interface BaharSchedule {
  name: string;
  pruning: string;
  flowering: string;
  harvest: string;
  yield: string;
  tips: string[];
}

const baharData: BaharSchedule[] = [
  {
    name: "Ambe Bahar (Jan-Feb Flowering)",
    pruning: "September-October",
    flowering: "January-February",
    harvest: "June-July",
    yield: "60-70% of annual production",
    tips: [
      "Prune 45-60 days before expected flowering",
      "Apply 10 kg FYM + 500g SSP per tree during pruning",
      "Give stress irrigation 30 days before flowering",
      "Control sucking pests during flowering stage"
    ]
  },
  {
    name: "Mrig Bahar (June-July Flowering)",
    pruning: "March-April",
    flowering: "June-July",
    harvest: "November-December",
    yield: "30-40% of annual production",
    tips: [
      "Suitable for areas with assured irrigation",
      "Give pre-monsoon irrigation before pruning",
      "Apply N:P:K (300:150:150g per tree) in split doses",
      "Monitor for fruit fly and citrus psylla"
    ]
  },
  {
    name: "Hasta Bahar (Sep-Oct Flowering)",
    pruning: "June-July",
    flowering: "September-October",
    harvest: "March-April",
    tips: [
      "Best for quality fruit production",
      "Requires good water management during monsoon",
      "Apply Bordeaux paste on pruning cuts",
      "High market prices during harvest season"
    ]
  }
];

export default function CitrusAdvisorCard() {
  const [selectedBahar, setSelectedBahar] = useState(0);

  return (
    <Card className="citrus-advisor-card">
      <CardHeader>
        <CardTitle>🍊 Citrus/Orange Advisor - Vidarbha Bahar System</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <AlertDescription>
            The Bahar treatment system allows year-round citrus production in Vidarbha region.
            Choose the right Bahar based on your irrigation facility and market demand.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="0" onValueChange={(val) => setSelectedBahar(Number(val))}>
          <TabsList className="grid w-full grid-cols-3">
            {baharData.map((bahar, idx) => (
              <TabsTrigger key={idx} value={idx.toString()}>
                {bahar.name.split(" ")[0]}
              </TabsTrigger>
            ))}
          </TabsList>

          {baharData.map((bahar, idx) => (
            <TabsContent key={idx} value={idx.toString()}>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{bahar.name}</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-gray-600">Pruning Period</p>
                      <p className="font-semibold">{bahar.pruning}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <p className="text-gray-600">Flowering Period</p>
                      <p className="font-semibold">{bahar.flowering}</p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded">
                      <p className="text-gray-600">Harvest Period</p>
                      <p className="font-semibold">{bahar.harvest}</p>
                    </div>
                    {bahar.yield && (
                      <div className="bg-purple-50 p-3 rounded">
                        <p className="text-gray-600">Expected Yield</p>
                        <p className="font-semibold">{bahar.yield}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Key Management Tips</h4>
                  <ul className="space-y-2">
                    {bahar.tips.map((tip, tipIdx) => (
                      <li key={tipIdx} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-orange-50 p-3 rounded text-sm">
                  <h4 className="font-semibold mb-1">Fertilizer Schedule</h4>
                  <p>Apply in 3 split doses: After pruning, At flowering, At fruit development</p>
                  <p className="mt-1">Recommended: 300g N + 150g P + 150g K per tree per year</p>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
