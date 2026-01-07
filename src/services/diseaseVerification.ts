// Disease Scan Endpoint Verification Script
// Tests POST /disease_scan with sample images and validates against supported disease classes

export interface VerificationResult {
  testName: string;
  status: 'pass' | 'fail';
  details: string;
  error?: string;
  responseData?: any;
}

export interface VerificationSummary {
  total: number;
  passed: number;
  failed: number;
  passRate: string;
  timestamp?: string;
}

// Supported disease classes for validation
const SUPPORTED_DISEASES = [
  'Leaf Blight',
  'Powdery Mildew',
  'Bacterial Blight',
  'Root Rot',
  'Fruit Borer',
  'Aphids',
  'Early Blight',
  'Late Blight',
  'Downy Mildew',
  'Rust',
  'Anthracnose',
  'Septoria Leaf Spot'
];

// Sample test images (base64 encoded minimal PNG images for testing)

const SAMPLE_IMAGES = {
  diseased_leaf: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==',
  healthy_crop: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  infected_stem: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNgYGD4DwABBAEAW/kP7QAAAABJRU5ErkJggg=='
};

class DiseaseVerificationTester {
  private baseUrl: string = 'http://localhost:5000';
  private results: VerificationResult[] = [];

  async testEndpointHealth(): Promise<VerificationResult> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      if (response.ok) {
        return {
          testName: 'Backend Health Check',
          status: 'pass',
          details: 'Disease scan backend is online and responding',
          responseData: await response.json()
        };
      } else {
        return {
          testName: 'Backend Health Check',
          status: 'fail',
          details: `Backend returned status ${response.status}`,
          error: `HTTP ${response.status}`
        };
      }
    } catch (error: any) {
      return {
        testName: 'Backend Health Check',
        status: 'fail',
        details: 'Cannot connect to disease scan backend',
        error: error.message
      };
    }
  }

  async testDiseaseScanEndpoint(imageBase64: string, imageName: string): Promise<VerificationResult> {
    try {
      const response = await fetch(`${this.baseUrl}/disease_scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          image: imageBase64.split(',')[1] || imageBase64 // Remove data URL prefix if present
        })
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          testName: `Disease Scan: ${imageName}`,
          status: 'fail',
          details: `API returned status ${response.status}`,
          error: data.error || JSON.stringify(data)
        };
      }

      // Validate response structure
      if (!data.disease || !data.confidence) {
        return {
          testName: `Disease Scan: ${imageName}`,
          status: 'fail',
          details: 'Response missing required fields (disease, confidence)',
          responseData: data,
          error: 'Invalid response structure'
        };
      }

      // Validate disease label matches supported classes
      const isValidDisease = SUPPORTED_DISEASES.some(
        d => d.toLowerCase() === data.disease.toLowerCase() ||
             data.disease.toLowerCase().includes(d.toLowerCase())
      );

      if (!isValidDisease) {
        console.warn(`Warning: Disease "${data.disease}" not in standard classes. It may be a new or misspelled label.`);
      }

      // Validate confidence is between 0 and 100
      const confidence = parseFloat(data.confidence);
      if (isNaN(confidence) || confidence < 0 || confidence > 100) {
        return {
          testName: `Disease Scan: ${imageName}`,
          status: 'fail',
          details: 'Confidence score outside valid range (0-100)',
          responseData: data,
          error: `Invalid confidence: ${data.confidence}`
        };
      }

      return {
        testName: `Disease Scan: ${imageName}`,
        status: 'pass',
        details: `Detected: ${data.disease} (${confidence.toFixed(1)}% confidence)`,
        responseData: data
      };
    } catch (error: any) {
      return {
        testName: `Disease Scan: ${imageName}`,
        status: 'fail',
        details: 'Failed to call disease scan endpoint',
        error: error.message
      };
    }
  }

  async testResponseValidation(): Promise<VerificationResult> {
    try {
      const response = await fetch(`${this.baseUrl}/disease_scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: 'invalid_base64' })
      });

      const data = await response.json();

      // Should either reject invalid data or handle gracefully
      if (response.status >= 400) {
        return {
          testName: 'Input Validation',
          status: 'pass',
          details: 'API properly rejects invalid image data',
          responseData: data
        };
      } else {
        return {
          testName: 'Input Validation',
          status: 'fail',
          details: 'API should reject invalid image data',
          responseData: data,
          error: 'No validation on invalid input'
        };
      }
    } catch (error: any) {
      return {
        testName: 'Input Validation',
        status: 'fail',
        details: 'Validation test failed',
        error: error.message
      };
    }
  }

  async testSupportedClasses(): Promise<VerificationResult> {
    try {
      const response = await fetch(`${this.baseUrl}/supported_classes`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        const classes = data.classes || data.supported_diseases || [];
        
        return {
          testName: 'Supported Disease Classes',
          status: 'pass',
          details: `Found ${classes.length} supported classes`,
          responseData: { classes, total: classes.length }
        };
      } else {
        return {
          testName: 'Supported Disease Classes',
          status: 'fail',
          details: 'Endpoint not available or returned error',
          error: `HTTP ${response.status}`
        };
      }
    } catch (error: any) {
      return {
        testName: 'Supported Disease Classes',
        status: 'fail',
        details: 'Could not fetch supported classes',
        error: error.message
      };
    }
  }

  async runAllTests(): Promise<VerificationResult[]> {
    console.log('🔍 Starting Disease Scan Verification Tests...\n');
    this.results = [];

    // Test 1: Backend health
    const healthTest = await this.testEndpointHealth();
    this.results.push(healthTest);
    console.log(`✓ ${healthTest.testName}: ${healthTest.status}`);

    if (healthTest.status === 'fail') {
      console.error('❌ Backend is offline. Stopping tests.');
      return this.results;
    }

    // Test 2: Supported classes endpoint
    const classesTest = await this.testSupportedClasses();
    this.results.push(classesTest);
    console.log(`✓ ${classesTest.testName}: ${classesTest.status}`);

    // Test 3: Image validation
    const validationTest = await this.testResponseValidation();
    this.results.push(validationTest);
    console.log(`✓ ${validationTest.testName}: ${validationTest.status}`);

    // Test 4: Disease scan with samples
    console.log('\n📸 Testing with sample images...');
    for (const [name, imageData] of Object.entries(SAMPLE_IMAGES)) {
      const scanTest = await this.testDiseaseScanEndpoint(imageData, name);
      this.results.push(scanTest);
      console.log(`✓ ${scanTest.testName}: ${scanTest.status}`);
      if (scanTest.responseData?.disease) {
        console.log(`  → Disease: ${scanTest.responseData.disease} (${scanTest.responseData.confidence}%)`);
      }
    }

    return this.results;
  }

  getResults(): VerificationResult[] {
    return this.results;
  }

  getSummary() {
    const passed = this.results.filter(r => r.status === 'pass').length;
    const failed = this.results.filter(r => r.status === 'fail').length;
    const total = this.results.length;

    return {
      total,
      passed,
      failed,
      passRate: total > 0 ? ((passed / total) * 100).toFixed(1) : '0.0'
    };
  }

  printReport() {
    console.log('\n========== VERIFICATION REPORT ==========\n');
    
    for (const result of this.results) {
      const icon = result.status === 'pass' ? '✅' : '❌';
      console.log(`${icon} ${result.testName}`);
      console.log(`   Status: ${result.status.toUpperCase()}`);
      console.log(`   Details: ${result.details}`);
      
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
      
      if (result.responseData) {
        console.log(`   Response: ${JSON.stringify(result.responseData, null, 2)}`);
      }
      console.log();
    }

    const summary = this.getSummary();
    console.log(`========== SUMMARY ==========`);
    console.log(`Total Tests: ${summary.total}`);
    console.log(`Passed: ${summary.passed}`);
    console.log(`Failed: ${summary.failed}`);
    console.log(`Pass Rate: ${summary.passRate}%`);
    console.log(`\nStatus: ${summary.failed === 0 ? '✅ ALL TESTS PASSED' : '⚠️ SOME TESTS FAILED'}`);
  }
}

// Export for use in components
export { DiseaseVerificationTester, SUPPORTED_DISEASES };
