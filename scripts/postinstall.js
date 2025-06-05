import { execSync } from 'node:child_process';
import { platform, arch } from 'node:os';

function installPlatformSpecificDependencies() {
  const currentPlatform = platform();
  const currentArch = arch();

  console.log(`Detected platform: ${currentPlatform} ${currentArch}`);

  try {
    // Install platform-specific rollup binaries
    if (currentPlatform === "linux" && currentArch === "x64") {
      console.log("Installing Linux x64 dependencies...");
      execSync(
        "npm install @rollup/rollup-linux-x64-gnu @swc/core-linux-x64-gnu",
        { stdio: "inherit" },
      );
    } else if (currentPlatform === "win32" && currentArch === "x64") {
      console.log("Installing Windows x64 dependencies...");
      execSync(
        "npm install @rollup/rollup-win32-x64-msvc @swc/core-win32-x64-msvc",
        { stdio: "inherit" },
      );
    } else if (currentPlatform === "win32" && currentArch === "ia32") {
      console.log("Installing Windows x32 dependencies...");
      execSync(
        "npm install @rollup/rollup-win32-ia32-msvc @swc/core-win32-ia32-msvc",
        { stdio: "inherit" },
      );
    } else if (currentPlatform === "darwin" && currentArch === "x64") {
      console.log("Installing macOS x64 dependencies...");
      execSync("npm install @rollup/rollup-darwin-x64 @swc/core-darwin-x64", {
        stdio: "inherit",
      });
    } else if (currentPlatform === "darwin" && currentArch === "arm64") {
      console.log("Installing macOS ARM64 dependencies...");
      execSync(
        "npm install @rollup/rollup-darwin-arm64 @swc/core-darwin-arm64",
        { stdio: "inherit" },
      );
    } else {
      console.log(
        `Platform ${currentPlatform} ${currentArch} detected. Using fallback dependencies.`,
      );
      // Most platforms should work with the default packages
    }

    console.log("Platform-specific dependencies installed successfully!");
  } catch (error) {
    console.warn(
      "Warning: Could not install platform-specific dependencies:",
      error.message,
    );
    console.log(
      "The application should still work with fallback implementations.",
    );
  }
}

// Only run if this is being executed directly
if (import.meta.url === import.meta.resolve('./postinstall.js')) {
  installPlatformSpecificDependencies();
}

export { installPlatformSpecificDependencies };