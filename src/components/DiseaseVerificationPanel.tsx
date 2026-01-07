import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Play, CheckCircle, AlertTriangle, Loader2, Copy, Download } from "lucide-react";
import { DiseaseVerificationTester, VerificationResult } from "../services/diseaseVerification";

export function DiseaseVerificationPanel() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<VerificationResult[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const captureConsoleLogs = () => {
    const originalLog = console.log;
    const originalError = console.error;
    const capturedLogs: string[] = [];

    console.log = (...args) => {
      capturedLogs.push(args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' '));
      originalLog(...args);
    };

    console.error = (...args) => {
      capturedLogs.push('ERROR: ' + args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' '));
      originalError(...args);
    };

    return { capturedLogs, restore: () => {
      console.log = originalLog;
      console.error = originalError;
    }};
  };

  const runTests = async () => {
    setRunning(true);
    setResults([]);
    setSummary(null);
    setLogs([]);

    const { capturedLogs, restore } = captureConsoleLogs();

    try {
      const tester = new DiseaseVerificationTester();
      const testResults = await tester.runAllTests();
      tester.printReport();

      setResults(testResults);
      const testSummary = tester.getSummary();
      setSummary(testSummary);
      setLogs(capturedLogs);
    } catch (error: any) {
      setLogs([...logs, `Fatal error: ${error.message}`]);
    } finally {
      restore();
      setRunning(false);
    }
  };

  const copyLogsToClipboard = () => {
    const text = logs.join('\n');
    navigator.clipboard.writeText(text);
    alert('Test logs copied to clipboard!');
  };

  const downloadReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      summary,
      results,
      logs
    };

    const json = JSON.stringify(report, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `disease-verification-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔬 Disease Scan Endpoint Verification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700">
            Tests the POST /disease_scan endpoint with sample images and validates responses against supported disease classes.
          </p>
        </CardContent>
      </Card>

      {/* Control Button */}
      <Button 
        onClick={runTests} 
        disabled={running}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        size="lg"
      >
        {running ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Running Tests...
          </>
        ) : (
          <>
            <Play className="h-4 w-4 mr-2" />
            Run Verification Tests
          </>
        )}
      </Button>

      {/* Summary Card */}
      {summary && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-lg">Test Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-4 gap-3 text-center">
              <div>
                <p className="text-3xl font-bold text-blue-600">{summary.total}</p>
                <p className="text-xs text-gray-600">Total Tests</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-600">{summary.passed}</p>
                <p className="text-xs text-gray-600">Passed</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-red-600">{summary.failed}</p>
                <p className="text-xs text-gray-600">Failed</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-600">{summary.passRate}%</p>
                <p className="text-xs text-gray-600">Pass Rate</p>
              </div>
            </div>
            <Progress value={parseFloat(summary.passRate)} className="h-2" />
            <Alert className={summary.failed === 0 ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}>
              <AlertDescription className={summary.failed === 0 ? "text-green-800" : "text-yellow-800"}>
                {summary.failed === 0 ? "✅ All tests passed! Your disease scan endpoint is working correctly." : `⚠️ ${summary.failed} test(s) failed. Check the details below.`}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Test Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {results.map((result, idx) => (
              <Card key={idx} className={result.status === 'pass' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {result.status === 'pass' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        )}
                        <h4 className="font-semibold text-sm">{result.testName}</h4>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{result.details}</p>
                      
                      {result.error && (
                        <p className="text-xs text-red-600 mt-1 font-mono">Error: {result.error}</p>
                      )}

                      {result.responseData && (
                        <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono overflow-auto max-h-32">
                          <pre>{JSON.stringify(result.responseData, null, 2)}</pre>
                        </div>
                      )}
                    </div>
                    <Badge className={result.status === 'pass' ? 'bg-green-600' : 'bg-red-600'}>
                      {result.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Console Logs */}
      {logs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex justify-between items-center">
              Console Output
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={copyLogsToClipboard}>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
                <Button size="sm" variant="outline" onClick={downloadReport}>
                  <Download className="h-4 w-4 mr-1" />
                  Report
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-gray-100 p-4 rounded font-mono text-xs overflow-auto max-h-96 space-y-1">
              {logs.map((log, idx) => (
                <div key={idx} className="whitespace-pre-wrap break-words">
                  {log}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      {results.length === 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-sm">ℹ️ Instructions</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>1. Make sure your disease detection backend is running on port 5000</p>
            <p>2. Click "Run Verification Tests" to start testing</p>
            <p>3. Tests will check:</p>
            <ul className="list-disc list-inside ml-4">
              <li>Backend health check endpoint</li>
              <li>Supported disease classes endpoint</li>
              <li>Input validation</li>
              <li>Disease scan with sample images</li>
            </ul>
            <p className="mt-2 text-xs text-gray-600">
              Results will be displayed above, with option to download full report as JSON
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
