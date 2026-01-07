import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";

interface FPOData {
  name: string;
  registrationNumber: string;
  district: string;
  state: string;
  members: number;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  establishedDate: string;
}

interface Member {
  id: string;
  name: string;
  farmerID: string;
  landSize: string;
  phoneNumber: string;
  crops: string;
  joinedDate: string;
  status: "Active" | "Pending" | "Inactive";
}

interface CollectionCenter {
  id: string;
  name: string;
  location: string;
  capacity: string;
  facilities: string[];
}

export default function FPODashboardCard() {
  const [fpoData, setFpoData] = useState<FPOData>(() => {
    const saved = localStorage.getItem("fpoData");
    return saved ? JSON.parse(saved) : {
      name: "",
      registrationNumber: "",
      district: "",
      state: "Maharashtra",
      members: 0,
      contactPerson: "",
      contactPhone: "",
      contactEmail: "",
      establishedDate: ""
    };
  });

  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem("fpoMembers");
    return saved ? JSON.parse(saved) : [];
  });

  const [collectionCenters, setCollectionCenters] = useState<CollectionCenter[]>(() => {
    const saved = localStorage.getItem("fpoCollectionCenters");
    return saved ? JSON.parse(saved) : [];
  });

  const [newMember, setNewMember] = useState({
    name: "",
    farmerID: "",
    landSize: "",
    phoneNumber: "",
    crops: "",
    joinedDate: new Date().toISOString().split('T')[0],
    status: "Pending" as "Active" | "Pending" | "Inactive"
  });

  const [newCenter, setNewCenter] = useState({
    name: "",
    location: "",
    capacity: "",
    facilities: ""
  });

  const saveFPOData = (data: FPOData) => {
    setFpoData(data);
    localStorage.setItem("fpoData", JSON.stringify(data));
  };

  const addMember = () => {
    if (newMember.name && newMember.farmerID) {
      const member: Member = {
        id: Date.now().toString(),
        ...newMember
      };
      const updatedMembers = [...members, member];
      setMembers(updatedMembers);
      localStorage.setItem("fpoMembers", JSON.stringify(updatedMembers));
      setNewMember({
        name: "",
        farmerID: "",
        landSize: "",
        phoneNumber: "",
        crops: "",
        joinedDate: new Date().toISOString().split('T')[0],
        status: "Pending"
      });
    }
  };

  const updateMemberStatus = (id: string, status: "Active" | "Pending" | "Inactive") => {
    const updatedMembers = members.map(m => m.id === id ? {...m, status} : m);
    setMembers(updatedMembers);
    localStorage.setItem("fpoMembers", JSON.stringify(updatedMembers));
  };

  const addCollectionCenter = () => {
    if (newCenter.name && newCenter.location) {
      const center: CollectionCenter = {
        id: Date.now().toString(),
        ...newCenter,
        facilities: newCenter.facilities.split(',').map(f => f.trim())
      };
      const updatedCenters = [...collectionCenters, center];
      setCollectionCenters(updatedCenters);
      localStorage.setItem("fpoCollectionCenters", JSON.stringify(updatedCenters));
      setNewCenter({ name: "", location: "", capacity: "", facilities: "" });
    }
  };

  const activeMembers = members.filter(m => m.status === "Active").length;
  const pendingMembers = members.filter(m => m.status === "Pending").length;
  const totalLandSize = members.reduce((sum, m) => sum + parseFloat(m.landSize || "0"), 0);

  const onboardingProgress = fpoData.name && fpoData.registrationNumber && members.length > 0 ? 
    (fpoData.name ? 25 : 0) + 
    (fpoData.registrationNumber ? 25 : 0) + 
    (members.length > 0 ? 25 : 0) + 
    (collectionCenters.length > 0 ? 25 : 0) : 0;

  return (
    <Card className="fpo-dashboard-card">
      <CardHeader>
        <CardTitle>🤝 FPO Cooperative Onboarding Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Onboarding Progress */}
        <Card className="mb-4 bg-gradient-to-r from-blue-50 to-green-50">
          <CardContent className="pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Onboarding Progress</span>
              <span className="text-2xl font-bold">{onboardingProgress}%</span>
            </div>
            <Progress value={onboardingProgress} className="h-3 mb-2" />
            <div className="grid grid-cols-4 gap-2 text-xs mt-3">
              <div className={`text-center ${fpoData.name ? 'text-green-600 font-semibold' : 'text-gray-500'}`}>
                ✓ Basic Info
              </div>
              <div className={`text-center ${fpoData.registrationNumber ? 'text-green-600 font-semibold' : 'text-gray-500'}`}>
                ✓ Registration
              </div>
              <div className={`text-center ${members.length > 0 ? 'text-green-600 font-semibold' : 'text-gray-500'}`}>
                ✓ Members
              </div>
              <div className={`text-center ${collectionCenters.length > 0 ? 'text-green-600 font-semibold' : 'text-gray-500'}`}>
                ✓ Centers
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <Card className="bg-blue-50">
            <CardContent className="pt-3 text-center">
              <p className="text-2xl font-bold text-blue-600">{members.length}</p>
              <p className="text-xs text-gray-600">Total Members</p>
            </CardContent>
          </Card>
          <Card className="bg-green-50">
            <CardContent className="pt-3 text-center">
              <p className="text-2xl font-bold text-green-600">{activeMembers}</p>
              <p className="text-xs text-gray-600">Active Members</p>
            </CardContent>
          </Card>
          <Card className="bg-yellow-50">
            <CardContent className="pt-3 text-center">
              <p className="text-2xl font-bold text-yellow-600">{pendingMembers}</p>
              <p className="text-xs text-gray-600">Pending</p>
            </CardContent>
          </Card>
          <Card className="bg-purple-50">
            <CardContent className="pt-3 text-center">
              <p className="text-2xl font-bold text-purple-600">{totalLandSize.toFixed(1)}</p>
              <p className="text-xs text-gray-600">Total Acres</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="fpo">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="fpo">FPO Details</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="centers">Collection Centers</TabsTrigger>
          </TabsList>

          <TabsContent value="fpo" className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold">FPO Information</h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">FPO Name</label>
                  <Input
                    value={fpoData.name}
                    onChange={(e) => saveFPOData({...fpoData, name: e.target.value})}
                    placeholder="Enter FPO name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Registration Number</label>
                  <Input
                    value={fpoData.registrationNumber}
                    onChange={(e) => saveFPOData({...fpoData, registrationNumber: e.target.value})}
                    placeholder="FPO registration number"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">District</label>
                  <Input
                    value={fpoData.district}
                    onChange={(e) => saveFPOData({...fpoData, district: e.target.value})}
                    placeholder="District"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">State</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={fpoData.state}
                    onChange={(e) => saveFPOData({...fpoData, state: e.target.value})}
                  >
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Established Date</label>
                  <Input
                    type="date"
                    value={fpoData.establishedDate}
                    onChange={(e) => saveFPOData({...fpoData, establishedDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t">
                <h5 className="font-semibold text-sm">Contact Person</h5>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Name"
                    value={fpoData.contactPerson}
                    onChange={(e) => saveFPOData({...fpoData, contactPerson: e.target.value})}
                  />
                  <Input
                    placeholder="Phone Number"
                    value={fpoData.contactPhone}
                    onChange={(e) => saveFPOData({...fpoData, contactPhone: e.target.value})}
                  />
                  <Input
                    placeholder="Email"
                    type="email"
                    value={fpoData.contactEmail}
                    onChange={(e) => saveFPOData({...fpoData, contactEmail: e.target.value})}
                    className="col-span-2"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="members" className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Add New Member</h4>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Farmer Name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                />
                <Input
                  placeholder="Farmer ID"
                  value={newMember.farmerID}
                  onChange={(e) => setNewMember({...newMember, farmerID: e.target.value})}
                />
                <Input
                  placeholder="Land Size (acres)"
                  value={newMember.landSize}
                  onChange={(e) => setNewMember({...newMember, landSize: e.target.value})}
                />
                <Input
                  placeholder="Phone Number"
                  value={newMember.phoneNumber}
                  onChange={(e) => setNewMember({...newMember, phoneNumber: e.target.value})}
                />
                <Input
                  placeholder="Crops (comma separated)"
                  value={newMember.crops}
                  onChange={(e) => setNewMember({...newMember, crops: e.target.value})}
                  className="col-span-2"
                />
              </div>
              <Button onClick={addMember}>Add Member</Button>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Member List</h4>
              {members.length === 0 ? (
                <p className="text-sm text-gray-500">No members added yet</p>
              ) : (
                <div className="space-y-2">
                  {members.map(member => (
                    <Card key={member.id}>
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h5 className="font-semibold">{member.name}</h5>
                            <p className="text-xs text-gray-600">ID: {member.farmerID}</p>
                          </div>
                          <select
                            className="text-xs border rounded px-2 py-1"
                            value={member.status}
                            onChange={(e) => updateMemberStatus(member.id, e.target.value as any)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <p className="text-gray-600">Land Size</p>
                            <p className="font-semibold">{member.landSize} acres</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Phone</p>
                            <p className="font-semibold">{member.phoneNumber}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Joined</p>
                            <p className="font-semibold">{member.joinedDate}</p>
                          </div>
                        </div>
                        <div className="mt-2 text-xs">
                          <p className="text-gray-600">Crops:</p>
                          <p>{member.crops}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="centers" className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Add Collection Center</h4>
              <Input
                placeholder="Center Name"
                value={newCenter.name}
                onChange={(e) => setNewCenter({...newCenter, name: e.target.value})}
              />
              <Input
                placeholder="Location"
                value={newCenter.location}
                onChange={(e) => setNewCenter({...newCenter, location: e.target.value})}
              />
              <Input
                placeholder="Storage Capacity (tons)"
                value={newCenter.capacity}
                onChange={(e) => setNewCenter({...newCenter, capacity: e.target.value})}
              />
              <Textarea
                placeholder="Facilities (comma separated, e.g., Cold Storage, Grading, Packing)"
                value={newCenter.facilities}
                onChange={(e) => setNewCenter({...newCenter, facilities: e.target.value})}
              />
              <Button onClick={addCollectionCenter}>Add Center</Button>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Collection Centers</h4>
              {collectionCenters.length === 0 ? (
                <p className="text-sm text-gray-500">No collection centers added yet</p>
              ) : (
                <div className="space-y-2">
                  {collectionCenters.map(center => (
                    <Card key={center.id} className="bg-green-50">
                      <CardContent className="pt-4">
                        <h5 className="font-semibold">{center.name}</h5>
                        <p className="text-sm text-gray-600 mb-2">📍 {center.location}</p>
                        <div className="text-sm">
                          <p><strong>Capacity:</strong> {center.capacity} tons</p>
                          <div className="mt-2">
                            <p className="text-xs text-gray-600 mb-1"><strong>Facilities:</strong></p>
                            <div className="flex flex-wrap gap-1">
                              {center.facilities.map((f, idx) => (
                                <span key={idx} className="bg-green-200 text-green-800 text-xs px-2 py-1 rounded">
                                  {f}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <Card className="mt-4 bg-blue-50">
          <CardContent className="pt-3 text-sm">
            <h4 className="font-semibold mb-2">Benefits of FPO Membership</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Better bargaining power for input purchase and output sale</li>
              <li>Access to credit and financial services</li>
              <li>Collective marketing and reduced transaction costs</li>
              <li>Access to modern technology and training</li>
              <li>Government scheme benefits and subsidies</li>
            </ul>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
