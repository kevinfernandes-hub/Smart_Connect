import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";

interface SoilData {
  pH: number;
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  organicCarbon: string;
  lastTested: string;
}

interface JeevamrutRecord {
  date: string;
  quantity: string;
  application: string;
}

interface GreenManureRecord {
  crop: string;
  sowingDate: string;
  incorporationDate: string;
  area: string;
}

export default function SoilHealthTrackerCard() {
  const [soilData, setSoilData] = useState<SoilData>(() => {
    const saved = localStorage.getItem("soilHealthData");
    return saved ? JSON.parse(saved) : {
      pH: 7.0,
      nitrogen: "Medium",
      phosphorus: "Medium",
      potassium: "Medium",
      organicCarbon: "0.5%",
      lastTested: new Date().toISOString().split('T')[0]
    };
  });

  const [jeevamrutRecords, setJeevamrutRecords] = useState<JeevamrutRecord[]>(() => {
    const saved = localStorage.getItem("jeevamrutRecords");
    return saved ? JSON.parse(saved) : [];
  });

  const [greenManureRecords, setGreenManureRecords] = useState<GreenManureRecord[]>(() => {
    const saved = localStorage.getItem("greenManureRecords");
    return saved ? JSON.parse(saved) : [];
  });

  const [newJeevamrut, setNewJeevamrut] = useState({ date: "", quantity: "", application: "" });
  const [newGreenManure, setNewGreenManure] = useState({ crop: "", sowingDate: "", incorporationDate: "", area: "" });

  useEffect(() => {
    localStorage.setItem("soilHealthData", JSON.stringify(soilData));
  }, [soilData]);

  useEffect(() => {
    localStorage.setItem("jeevamrutRecords", JSON.stringify(jeevamrutRecords));
  }, [jeevamrutRecords]);

  useEffect(() => {
    localStorage.setItem("greenManureRecords", JSON.stringify(greenManureRecords));
  }, [greenManureRecords]);

  const getHealthScore = () => {
    let score = 0;
    // pH score (ideal 6.5-7.5)
    if (soilData.pH >= 6.5 && soilData.pH <= 7.5) score += 25;
    else if (soilData.pH >= 6.0 && soilData.pH <= 8.0) score += 15;
    else score += 5;

    // NPK scores
    if (soilData.nitrogen === "High") score += 25;
    else if (soilData.nitrogen === "Medium") score += 15;
    else score += 5;

    if (soilData.phosphorus === "High") score += 25;
    else if (soilData.phosphorus === "Medium") score += 15;
    else score += 5;

    if (soilData.potassium === "High") score += 25;
    else if (soilData.potassium === "Medium") score += 15;
    else score += 5;

    return score;
  };

  const healthScore = getHealthScore();

  const addJeevamrut = () => {
    if (newJeevamrut.date && newJeevamrut.quantity) {
      setJeevamrutRecords([...jeevamrutRecords, newJeevamrut]);
      setNewJeevamrut({ date: "", quantity: "", application: "" });
    }
  };

  const addGreenManure = () => {
    if (newGreenManure.crop && newGreenManure.sowingDate) {
      setGreenManureRecords([...greenManureRecords, newGreenManure]);
      setNewGreenManure({ crop: "", sowingDate: "", incorporationDate: "", area: "" });
    }
  };

  return (
    <Card className="soil-health-tracker-card">
      <CardHeader>
        <CardTitle>🌱 Soil Health Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Soil Health Score</span>
            <span className="text-2xl font-bold">{healthScore}/100</span>
          </div>
          <Progress value={healthScore} className="h-3" />
          <p className="text-xs text-gray-500 mt-1">
            {healthScore >= 75 ? "Excellent soil health!" : 
             healthScore >= 50 ? "Good soil health" : 
             "Needs improvement"}
          </p>
        </div>

        <Tabs defaultValue="soilTest">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="soilTest">Soil Test</TabsTrigger>
            <TabsTrigger value="jeevamrut">Jeevamrut</TabsTrigger>
            <TabsTrigger value="greenManure">Green Manure</TabsTrigger>
          </TabsList>

          <TabsContent value="soilTest" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">pH Level</label>
                <Input
                  type="number"
                  step="0.1"
                  value={soilData.pH}
                  onChange={(e) => setSoilData({...soilData, pH: Number(e.target.value)})}
                />
                <p className="text-xs text-gray-500 mt-1">Ideal: 6.5 - 7.5</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Organic Carbon</label>
                <Input
                  value={soilData.organicCarbon}
                  onChange={(e) => setSoilData({...soilData, organicCarbon: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium mb-2">Nitrogen</label>
                <select 
                  className="w-full p-2 border rounded"
                  value={soilData.nitrogen}
                  onChange={(e) => setSoilData({...soilData, nitrogen: e.target.value})}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phosphorus</label>
                <select 
                  className="w-full p-2 border rounded"
                  value={soilData.phosphorus}
                  onChange={(e) => setSoilData({...soilData, phosphorus: e.target.value})}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Potassium</label>
                <select 
                  className="w-full p-2 border rounded"
                  value={soilData.potassium}
                  onChange={(e) => setSoilData({...soilData, potassium: e.target.value})}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Last Tested</label>
              <Input
                type="date"
                value={soilData.lastTested}
                onChange={(e) => setSoilData({...soilData, lastTested: e.target.value})}
              />
            </div>

            <Card className="bg-blue-50">
              <CardContent className="pt-3 text-sm">
                <h4 className="font-semibold mb-2">Recommendations</h4>
                {soilData.pH < 6.5 && <p className="mb-1">• Apply lime to increase pH</p>}
                {soilData.pH > 7.5 && <p className="mb-1">• Apply gypsum to decrease pH</p>}
                {soilData.nitrogen === "Low" && <p className="mb-1">• Increase organic matter and nitrogen fertilizers</p>}
                {soilData.phosphorus === "Low" && <p className="mb-1">• Apply rock phosphate or SSP</p>}
                {soilData.potassium === "Low" && <p className="mb-1">• Apply muriate of potash</p>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jeevamrut" className="space-y-4">
            <div className="space-y-3 mb-4">
              <h4 className="font-semibold">Add Jeevamrut Application</h4>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="date"
                  placeholder="Date"
                  value={newJeevamrut.date}
                  onChange={(e) => setNewJeevamrut({...newJeevamrut, date: e.target.value})}
                />
                <Input
                  placeholder="Quantity (liters)"
                  value={newJeevamrut.quantity}
                  onChange={(e) => setNewJeevamrut({...newJeevamrut, quantity: e.target.value})}
                />
              </div>
              <Input
                placeholder="Application method (e.g., drip, spray, soil)"
                value={newJeevamrut.application}
                onChange={(e) => setNewJeevamrut({...newJeevamrut, application: e.target.value})}
              />
              <Button onClick={addJeevamrut}>Add Record</Button>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Application History</h4>
              {jeevamrutRecords.length === 0 ? (
                <p className="text-sm text-gray-500">No records yet</p>
              ) : (
                <div className="space-y-2">
                  {jeevamrutRecords.map((record, idx) => (
                    <Card key={idx} className="bg-green-50">
                      <CardContent className="pt-3 text-sm">
                        <p><strong>Date:</strong> {record.date}</p>
                        <p><strong>Quantity:</strong> {record.quantity} liters</p>
                        <p><strong>Method:</strong> {record.application}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <Card className="bg-yellow-50">
              <CardContent className="pt-3 text-sm">
                <h4 className="font-semibold mb-2">Jeevamrut Recipe</h4>
                <p>For 200 liters:</p>
                <ul className="list-disc list-inside mt-1">
                  <li>10 kg cow dung</li>
                  <li>10 liters cow urine</li>
                  <li>2 kg jaggery</li>
                  <li>2 kg pulse flour</li>
                  <li>Handful of soil from farm</li>
                </ul>
                <p className="mt-2">Ferment for 48 hours in shade, stir twice daily</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="greenManure" className="space-y-4">
            <div className="space-y-3 mb-4">
              <h4 className="font-semibold">Add Green Manure Crop</h4>
              <Input
                placeholder="Crop name (e.g., Sunhemp, Dhaincha)"
                value={newGreenManure.crop}
                onChange={(e) => setNewGreenManure({...newGreenManure, crop: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-600">Sowing Date</label>
                  <Input
                    type="date"
                    value={newGreenManure.sowingDate}
                    onChange={(e) => setNewGreenManure({...newGreenManure, sowingDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Incorporation Date</label>
                  <Input
                    type="date"
                    value={newGreenManure.incorporationDate}
                    onChange={(e) => setNewGreenManure({...newGreenManure, incorporationDate: e.target.value})}
                  />
                </div>
              </div>
              <Input
                placeholder="Area (acres)"
                value={newGreenManure.area}
                onChange={(e) => setNewGreenManure({...newGreenManure, area: e.target.value})}
              />
              <Button onClick={addGreenManure}>Add Record</Button>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Green Manure History</h4>
              {greenManureRecords.length === 0 ? (
                <p className="text-sm text-gray-500">No records yet</p>
              ) : (
                <div className="space-y-2">
                  {greenManureRecords.map((record, idx) => (
                    <Card key={idx} className="bg-green-50">
                      <CardContent className="pt-3 text-sm">
                        <p><strong>Crop:</strong> {record.crop}</p>
                        <p><strong>Sowing:</strong> {record.sowingDate}</p>
                        <p><strong>Incorporation:</strong> {record.incorporationDate}</p>
                        <p><strong>Area:</strong> {record.area} acres</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <Card className="bg-green-50">
              <CardContent className="pt-3 text-sm">
                <h4 className="font-semibold mb-2">Recommended Green Manure Crops</h4>
                <ul className="list-disc list-inside">
                  <li><strong>Sunhemp (Crotalaria):</strong> 60 days, 20-25 kg/acre</li>
                  <li><strong>Dhaincha:</strong> 45-60 days, 25-30 kg/acre</li>
                  <li><strong>Cowpea:</strong> 45-50 days, 20 kg/acre</li>
                  <li><strong>Sesbania:</strong> 45-60 days, 25 kg/acre</li>
                </ul>
                <p className="mt-2">Incorporate at flowering stage for maximum benefit</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
