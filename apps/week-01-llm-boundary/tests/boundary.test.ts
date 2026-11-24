import { createServer } from "../src/server.js";
import http from "http";

async function runTests() {
  const app = createServer();
  const server = http.createServer(app);

  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 3000;
  const baseUrl = `http://127.0.0.1:${port}`;

  console.log(`🧪 Running boundary & validation test suite against ${baseUrl}...`);

  try {
    // Test 1: GET /health
    console.log("\n[Test 1] Health Check Endpoint (GET /health)");
    const healthRes = await fetch(`${baseUrl}/health`);
    const healthData = await healthRes.json();
    console.log(`Status: ${healthRes.status}, Body:`, healthData);
    if (healthRes.status !== 200 || healthData.status !== "ok") {
      throw new Error("Health check failed");
    }
    console.log("✓ Health check passed");

    // Test 2: Validation Error - Empty Body
    console.log("\n[Test 2] Empty Payload Validation (POST /v1/chat/generate)");
    const emptyRes = await fetch(`${baseUrl}/v1/chat/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const emptyData = await emptyRes.json();
    console.log(`Status: ${emptyRes.status}, Body:`, emptyData);
    if (emptyRes.status !== 400 || emptyData.error?.code !== "VALIDATION_ERROR") {
      throw new Error("Empty body validation failed");
    }
    console.log("✓ Empty body rejection passed");

    // Test 3: Validation Error - Invalid Temperature
    console.log("\n[Test 3] Temperature Boundary Validation");
    const tempRes = await fetch(`${baseUrl}/v1/chat/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: "Hello", temperature: 3.5 }),
    });
    const tempData = await tempRes.json();
    console.log(`Status: ${tempRes.status}, Body:`, tempData);
    if (tempRes.status !== 400 || tempData.error?.code !== "VALIDATION_ERROR") {
      throw new Error("Temperature validation failed");
    }
    console.log("✓ Temperature boundary rejection passed");

    // Test 4: Structured Error Handling when API key is missing
    console.log("\n[Test 4] Upstream Auth/Provider Boundary (Missing API key)");
    const authRes = await fetch(`${baseUrl}/v1/chat/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: "Hello world" }),
    });
    const authData = await authRes.json();
    console.log(`Status: ${authRes.status}, Body:`, authData);
    if (![401, 500, 502].includes(authRes.status) || !authData.error?.code) {
      throw new Error("Sanitized error handling failed");
    }
    console.log("✓ Error normalization and sanitization passed");

    console.log("\n🎉 All 4 boundary verification tests passed cleanly!");
  } finally {
    server.close();
  }
}

runTests().catch((err) => {
  console.error("Test suite failed:", err);
  process.exit(1);
});
