import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { setTimeout as delay } from "timers/promises";
import http from "http";
import net from "net";
import path from "path";
import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

const PREFERRED_PORT = Number(process.env.VITE_PORT || 4173);
const HOST = process.env.VITE_HOST || "127.0.0.1";
const packageRoot = fileURLToPath(new URL("..", import.meta.url));

async function getAvailablePort(preferred) {
  const start = Math.max(1, preferred);
  for (let port = start; port < start + 20; port += 1) {
    const isFree = await new Promise((resolve) => {
      const srv = net.createServer();
      srv.once("error", () => {
        resolve(false);
      });
      srv.once("listening", () => {
        srv.close(() => resolve(true));
      });
      srv.listen(port, HOST);
    });
    if (isFree) return port;
  }
  throw new Error("No available port found for dev server");
}

async function isServerUp(port) {
  return new Promise((resolve) => {
    const req = http.get(
      {
        host: HOST,
        port,
        path: "/",
        timeout: 2000,
      },
      (res) => {
        res.resume();
        resolve(res.statusCode !== undefined && res.statusCode < 500);
      },
    );
    req.on("error", () => resolve(false));
    req.on("timeout", () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function waitForServer(port, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await isServerUp(port)) return;
    await delay(500);
  }
  throw new Error(`Server did not become ready within ${timeoutMs}ms`);
}

async function run() {
  const PORT = await getAvailablePort(PREFERRED_PORT);
  process.env.VITE_PORT = String(PORT);

  const devServer = spawn(
    "yarn",
    ["dev", "--host", HOST, "--port", String(PORT), "--strictPort"],
    {
      cwd: packageRoot,
      stdio: "inherit",
      env: { ...process.env, BROWSER: "none" },
    },
  );

  let driver;
  const originalPath = process.env.PATH || "";
  const sanitizedPath = originalPath
    .split(path.delimiter)
    .filter((segment) => !segment.includes(`${path.sep}node_modules${path.sep}.bin`))
    .join(path.delimiter);

  try {
    await waitForServer(PORT);

    const options = new chrome.Options();
    options.addArguments(
      "--headless=new",
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
    );

    process.env.PATH = sanitizedPath || originalPath;

    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();

    await driver.get(`http://${HOST}:${PORT}/`);

    await driver.wait(until.elementLocated(By.css("#root")), 10000);
    const headingEls = await driver.findElements(By.css("h1"));
    if (headingEls.length > 0) {
      const headingText = await headingEls[0].getText();
      console.log(`Found heading: ${headingText}`);
    } else {
      console.warn("Heading <h1> not found; continuing.");
    }

    console.log("✅ Selenium smoke test passed (root rendered).");
  } finally {
    process.env.PATH = originalPath;
    if (driver) {
      await driver.quit().catch(() => {});
    }
    devServer.kill("SIGINT");
    await delay(1500);
  }
}

run().catch((err) => {
  console.error("❌ Selenium smoke test failed:", err);
  process.exitCode = 1;
});

