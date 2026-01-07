# Disease Scan Endpoint Verification Guide

## Overview

The **Disease Verification Panel** provides a comprehensive testing framework for validating the `/disease_scan` endpoint of your disease detection backend. It tests the endpoint's health, response structure, and accuracy with sample images.

## Features

### 5-Part Test Suite

1. **Backend Health Check** (`GET /health`)
   - Verifies the backend server is online and responding
   - Checks basic connectivity

2. **Supported Disease Classes** (`GET /supported_classes`)
   - Retrieves list of disease classes the model can detect
   - Validates endpoint structure

3. **Input Validation** (`POST /disease_scan` with invalid data)
   - Tests error handling for malformed requests
   - Validates proper rejection of invalid image data

4. **Sample Image Scans** (`POST /disease_scan` with sample images)
   - Tests disease detection on 3 different plant images
   - Validates response structure (disease, confidence, treatment, prevention)
   - Checks confidence score range (0-100)
   - Verifies detected diseases match supported classes

5. **Response Structure Validation**
   - Ensures all required fields are present
   - Validates data types and value ranges
   - Checks for proper error messages

### Visual Results Dashboard

- **Summary Card**: Total tests, passed/failed count, pass rate percentage
- **Test Results**: Individual test cards with status badges (✅ PASS / ❌ FAIL)
- **Response Data**: JSON display of endpoint responses
- **Error Details**: Detailed error messages for failed tests
- **Console Output**: Full captured logs from all tests
- **Export Options**: Copy logs to clipboard or download full JSON report

## How to Use

### 1. Start Your Disease Detection Backend

Make sure your Python Flask backend is running on port 5000:

```bash
# Windows
cd src/backend
python start_ai_backend.py

# Or double-click start_ai_backend.bat
```

Expected output:
```
 * Running on http://localhost:5000/
```

### 2. Open the Disease Detection Component

Navigate to the **Disease Detection** section in the KisanConnect app.

### 3. Run Verification Tests

1. Click the **"🔬 Endpoint Verification"** collapsible section
2. Click **"Run Verification Tests"** button
3. Wait for all 5 tests to complete (typically 2-5 seconds)
4. Review results in the dashboard

### 4. Analyze Results

- **Green badges (✅)**: Tests passed successfully
- **Red badges (❌)**: Tests failed - check error messages
- **Pass Rate**: Must be 100% for production-ready backend
- **JSON Report**: Download for documentation or sharing

## Backend Requirements

Your Flask API must implement these endpoints:

### GET /health
```json
Response (200 OK):
{
  "status": "healthy",
  "version": "1.0.0"
}
```

### GET /supported_classes
```json
Response (200 OK):
{
  "classes": [
    "Leaf Blight",
    "Powdery Mildew",
    "Bacterial Blight",
    ...
  ],
  "total": 12
}
```

### POST /disease_scan
```json
Request:
{
  "image": "<base64_encoded_image_data>"
}

Response (200 OK):
{
  "disease": "Leaf Blight",
  "confidence": 85.5,
  "treatment": "Apply fungicide...",
  "prevention": "Ensure proper drainage..."
}

Response (400 Bad Request):
{
  "error": "Invalid image format"
}
```

## Supported Disease Classes

The verification script validates detected diseases against this list:

- Leaf Blight
- Powdery Mildew
- Bacterial Blight
- Root Rot
- Fruit Borer
- Aphids
- Early Blight
- Late Blight
- Downy Mildew
- Rust
- Anthracnose
- Septoria Leaf Spot

## Sample Images

The verification panel includes 3 minimal test images:
- `diseased_leaf`: Sample diseased leaf image
- `healthy_crop`: Sample healthy plant image
- `infected_stem`: Sample infected stem image

All images are base64-encoded PNG files for consistent testing.

## Troubleshooting

### "Cannot connect to disease scan backend" Error

**Solution**: 
- Ensure Python backend is running on port 5000
- Check no firewall is blocking localhost:5000
- Verify Flask app is started without errors

### "Response missing required fields" Error

**Solution**:
- Ensure your Flask endpoint returns: `disease`, `confidence`, `treatment`, `prevention`
- All fields must be present in the response JSON
- Confidence must be a number between 0-100

### "Disease label not in standard classes" Warning

**Solution**:
- This is informational, not a failure
- Indicates the model detected a disease not in the standard list
- May indicate custom disease classes or model variations
- Test will still pass if response structure is valid

### "HTTP 5xx" Errors

**Solution**:
- Check backend server logs for Python errors
- Ensure TensorFlow/Keras model is properly loaded
- Verify required model file (e.g., `leaf_disease_model.h5`) exists

## Integration with Other Components

The verification panel is integrated into:
- **DiseaseDetection.tsx**: Main disease analysis component
- Appears as collapsible section below backend setup guide
- Can be expanded/collapsed to focus on image analysis

## API Integration

The `DiseaseVerificationTester` class provides programmatic access:

```typescript
import { DiseaseVerificationTester } from '../services/diseaseVerification';

// Run all tests
const tester = new DiseaseVerificationTester();
const results = await tester.runAllTests();

// Get summary
const summary = tester.getSummary();
console.log(`Passed: ${summary.passed}/${summary.total}`);

// Print detailed report
tester.printReport();

// Access individual test results
const results = tester.getResults();
results.forEach(result => {
  console.log(`${result.testName}: ${result.status}`);
});
```

## Performance Notes

- Each test runs sequentially to avoid race conditions
- Total runtime: 2-5 seconds depending on backend response time
- Network latency impacts test duration
- Results are cached in component state for offline review

## Security Considerations

⚠️ **Development Only**: This verification panel should only be used in development environments. Do not expose in production as it:
- Tests endpoint availability publicly
- Could reveal backend structure
- Uses test images that don't require authentication

Remove from production build or gate behind authentication.

## Console Output

All test details are logged to browser console:
- Timestamps for each test
- Full JSON responses from backend
- Error stack traces (if applicable)
- Pass/fail summary

Access via **Browser DevTools** (F12 → Console tab)

## Exporting Results

### Copy to Clipboard
Copies all console output as plain text for quick sharing.

### Download JSON Report
Generates a complete report including:
```json
{
  "timestamp": "2024-01-15T10:30:45.123Z",
  "summary": {
    "total": 5,
    "passed": 5,
    "failed": 0,
    "passRate": "100.0"
  },
  "results": [...],
  "logs": [...]
}
```

Perfect for:
- Bug reports
- Team documentation
- CI/CD integration
- Regression testing

## Next Steps

Once all tests pass:

1. **Image Analysis**: Use the main upload section to test with real crop images
2. **Backend Training**: Improve model accuracy with more training data
3. **Deployment**: Deploy verified backend to production server
4. **Monitoring**: Set up health checks to monitor endpoint status

## Support

For issues with the verification panel, check:
1. Browser console for error messages (F12)
2. Backend server logs for Python exceptions
3. Network tab (F12) to inspect HTTP requests/responses
4. Ensure backend is running on correct port (5000)

---

**Last Updated**: 2024
**Component**: DiseaseVerificationPanel.tsx
**Service**: diseaseVerification.ts
