import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

export function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!visible) return null;

  const install = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setVisible(false);
    }
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="py-3 px-4 flex items-center justify-between gap-3">
        <div className="text-sm">
          <p className="font-semibold text-blue-800">Install KisanConnect</p>
          <p className="text-blue-700">Works offline and opens like an app</p>
        </div>
        <Button onClick={install} className="bg-blue-600 hover:bg-blue-700">
          Install
        </Button>
      </CardContent>
    </Card>
  );
}
