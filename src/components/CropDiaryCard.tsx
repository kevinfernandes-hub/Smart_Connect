import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Calendar } from "./ui/calendar";

interface CropEntry {
  id: string;
  cropName: string;
  variety: string;
  sowingDate: string;
  expectedHarvest: string;
  area: string;
}

interface IrrigationLog {
  id: string;
  cropId: string;
  date: string;
  duration: string;
  method: string;
  notes: string;
}

interface FarmImage {
  id: string;
  cropId: string;
  date: string;
  url: string;
  description: string;
}

interface ActivityLog {
  id: string;
  cropId: string;
  date: string;
  activity: string;
  details: string;
}

export default function CropDiaryCard() {
  const [crops, setCrops] = useState<CropEntry[]>(() => {
    const saved = localStorage.getItem("cropDiaryCrops");
    return saved ? JSON.parse(saved) : [];
  });

  const [irrigationLogs, setIrrigationLogs] = useState<IrrigationLog[]>(() => {
    const saved = localStorage.getItem("irrigationLogs");
    return saved ? JSON.parse(saved) : [];
  });

  const [images, setImages] = useState<FarmImage[]>(() => {
    const saved = localStorage.getItem("farmImages");
    return saved ? JSON.parse(saved) : [];
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem("activityLogs");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedCrop, setSelectedCrop] = useState<string>("");
  const [newCrop, setNewCrop] = useState({ cropName: "", variety: "", sowingDate: "", expectedHarvest: "", area: "" });
  const [newIrrigation, setNewIrrigation] = useState({ date: "", duration: "", method: "Drip", notes: "" });
  const [newActivity, setNewActivity] = useState({ date: "", activity: "", details: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageDesc, setImageDesc] = useState("");

  useEffect(() => {
    localStorage.setItem("cropDiaryCrops", JSON.stringify(crops));
  }, [crops]);

  useEffect(() => {
    localStorage.setItem("irrigationLogs", JSON.stringify(irrigationLogs));
  }, [irrigationLogs]);

  useEffect(() => {
    localStorage.setItem("farmImages", JSON.stringify(images));
  }, [images]);

  useEffect(() => {
    localStorage.setItem("activityLogs", JSON.stringify(activityLogs));
  }, [activityLogs]);

  const addCrop = () => {
    if (newCrop.cropName && newCrop.sowingDate) {
      const crop: CropEntry = {
        id: Date.now().toString(),
        ...newCrop
      };
      setCrops([...crops, crop]);
      setNewCrop({ cropName: "", variety: "", sowingDate: "", expectedHarvest: "", area: "" });
      setSelectedCrop(crop.id);
    }
  };

  const addIrrigation = () => {
    if (selectedCrop && newIrrigation.date) {
      const log: IrrigationLog = {
        id: Date.now().toString(),
        cropId: selectedCrop,
        ...newIrrigation
      };
      setIrrigationLogs([...irrigationLogs, log]);
      setNewIrrigation({ date: "", duration: "", method: "Drip", notes: "" });
    }
  };

  const addActivity = () => {
    if (selectedCrop && newActivity.date && newActivity.activity) {
      const log: ActivityLog = {
        id: Date.now().toString(),
        cropId: selectedCrop,
        ...newActivity
      };
      setActivityLogs([...activityLogs, log]);
      setNewActivity({ date: "", activity: "", details: "" });
    }
  };

  const handleImageUpload = () => {
    if (selectedCrop && imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img: FarmImage = {
          id: Date.now().toString(),
          cropId: selectedCrop,
          date: new Date().toISOString().split('T')[0],
          url: reader.result as string,
          description: imageDesc
        };
        setImages([...images, img]);
        setImageFile(null);
        setImageDesc("");
      };
      reader.readAsDataURL(imageFile);
    }
  };

  const selectedCropData = crops.find(c => c.id === selectedCrop);
  const cropIrrigationLogs = irrigationLogs.filter(l => l.cropId === selectedCrop);
  const cropActivityLogs = activityLogs.filter(l => l.cropId === selectedCrop);
  const cropImages = images.filter(i => i.cropId === selectedCrop);

  return (
    <Card className="crop-diary-card">
      <CardHeader>
        <CardTitle>📔 Crop Diary</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="crops">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="crops">Crops</TabsTrigger>
            <TabsTrigger value="irrigation">Irrigation</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>

          <TabsContent value="crops" className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Add New Crop</h4>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Crop Name"
                  value={newCrop.cropName}
                  onChange={(e) => setNewCrop({...newCrop, cropName: e.target.value})}
                />
                <Input
                  placeholder="Variety"
                  value={newCrop.variety}
                  onChange={(e) => setNewCrop({...newCrop, variety: e.target.value})}
                />
                <div>
                  <label className="text-xs text-gray-600">Sowing Date</label>
                  <Input
                    type="date"
                    value={newCrop.sowingDate}
                    onChange={(e) => setNewCrop({...newCrop, sowingDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Expected Harvest</label>
                  <Input
                    type="date"
                    value={newCrop.expectedHarvest}
                    onChange={(e) => setNewCrop({...newCrop, expectedHarvest: e.target.value})}
                  />
                </div>
                <Input
                  placeholder="Area (acres)"
                  value={newCrop.area}
                  onChange={(e) => setNewCrop({...newCrop, area: e.target.value})}
                />
              </div>
              <Button onClick={addCrop}>Add Crop</Button>
            </div>

            <div>
              <h4 className="font-semibold mb-2">My Crops</h4>
              {crops.length === 0 ? (
                <p className="text-sm text-gray-500">No crops added yet</p>
              ) : (
                <div className="space-y-2">
                  {crops.map(crop => (
                    <Card 
                      key={crop.id} 
                      className={`cursor-pointer ${selectedCrop === crop.id ? 'border-green-500 border-2' : ''}`}
                      onClick={() => setSelectedCrop(crop.id)}
                    >
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-semibold">{crop.cropName}</h5>
                            <p className="text-sm text-gray-600">{crop.variety}</p>
                          </div>
                          {selectedCrop === crop.id && (
                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Selected</span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                          <div>
                            <p className="text-gray-600">Sowing:</p>
                            <p className="font-semibold">{crop.sowingDate}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Harvest:</p>
                            <p className="font-semibold">{crop.expectedHarvest}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Area:</p>
                            <p className="font-semibold">{crop.area} acres</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="irrigation" className="space-y-4">
            {!selectedCrop ? (
              <p className="text-sm text-gray-500">Please select a crop first</p>
            ) : (
              <>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm font-semibold">Selected Crop: {selectedCropData?.cropName}</p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Add Irrigation Log</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="date"
                      value={newIrrigation.date}
                      onChange={(e) => setNewIrrigation({...newIrrigation, date: e.target.value})}
                    />
                    <Input
                      placeholder="Duration (hours)"
                      value={newIrrigation.duration}
                      onChange={(e) => setNewIrrigation({...newIrrigation, duration: e.target.value})}
                    />
                    <select
                      className="p-2 border rounded"
                      value={newIrrigation.method}
                      onChange={(e) => setNewIrrigation({...newIrrigation, method: e.target.value})}
                    >
                      <option value="Drip">Drip</option>
                      <option value="Sprinkler">Sprinkler</option>
                      <option value="Flood">Flood</option>
                      <option value="Furrow">Furrow</option>
                    </select>
                  </div>
                  <Input
                    placeholder="Notes"
                    value={newIrrigation.notes}
                    onChange={(e) => setNewIrrigation({...newIrrigation, notes: e.target.value})}
                  />
                  <Button onClick={addIrrigation}>Add Log</Button>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Irrigation History</h4>
                  {cropIrrigationLogs.length === 0 ? (
                    <p className="text-sm text-gray-500">No irrigation logs yet</p>
                  ) : (
                    <div className="space-y-2">
                      {cropIrrigationLogs.map(log => (
                        <Card key={log.id} className="bg-blue-50">
                          <CardContent className="pt-3 text-sm">
                            <p><strong>Date:</strong> {log.date}</p>
                            <p><strong>Duration:</strong> {log.duration} hours</p>
                            <p><strong>Method:</strong> {log.method}</p>
                            {log.notes && <p><strong>Notes:</strong> {log.notes}</p>}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="activities" className="space-y-4">
            {!selectedCrop ? (
              <p className="text-sm text-gray-500">Please select a crop first</p>
            ) : (
              <>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm font-semibold">Selected Crop: {selectedCropData?.cropName}</p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Add Activity</h4>
                  <Input
                    type="date"
                    value={newActivity.date}
                    onChange={(e) => setNewActivity({...newActivity, date: e.target.value})}
                  />
                  <select
                    className="w-full p-2 border rounded"
                    value={newActivity.activity}
                    onChange={(e) => setNewActivity({...newActivity, activity: e.target.value})}
                  >
                    <option value="">Select Activity</option>
                    <option value="Fertilization">Fertilization</option>
                    <option value="Pesticide Spray">Pesticide Spray</option>
                    <option value="Weeding">Weeding</option>
                    <option value="Pruning">Pruning</option>
                    <option value="Mulching">Mulching</option>
                    <option value="Other">Other</option>
                  </select>
                  <Textarea
                    placeholder="Details"
                    value={newActivity.details}
                    onChange={(e) => setNewActivity({...newActivity, details: e.target.value})}
                  />
                  <Button onClick={addActivity}>Add Activity</Button>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Activity History</h4>
                  {cropActivityLogs.length === 0 ? (
                    <p className="text-sm text-gray-500">No activities logged yet</p>
                  ) : (
                    <div className="space-y-2">
                      {cropActivityLogs.map(log => (
                        <Card key={log.id} className="bg-green-50">
                          <CardContent className="pt-3 text-sm">
                            <p><strong>Date:</strong> {log.date}</p>
                            <p><strong>Activity:</strong> {log.activity}</p>
                            <p><strong>Details:</strong> {log.details}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="images" className="space-y-4">
            {!selectedCrop ? (
              <p className="text-sm text-gray-500">Please select a crop first</p>
            ) : (
              <>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm font-semibold">Selected Crop: {selectedCropData?.cropName}</p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Add Image</h4>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  />
                  <Input
                    placeholder="Description"
                    value={imageDesc}
                    onChange={(e) => setImageDesc(e.target.value)}
                  />
                  <Button onClick={handleImageUpload} disabled={!imageFile}>Upload Image</Button>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Image Gallery</h4>
                  {cropImages.length === 0 ? (
                    <p className="text-sm text-gray-500">No images uploaded yet</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {cropImages.map(img => (
                        <Card key={img.id}>
                          <CardContent className="pt-3">
                            <img src={img.url} alt={img.description} className="w-full h-32 object-cover rounded mb-2" />
                            <p className="text-xs text-gray-600">{img.date}</p>
                            <p className="text-sm">{img.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
