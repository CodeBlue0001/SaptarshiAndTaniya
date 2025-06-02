const { execSync } = require("child_process");
const os = require("os");

function installPlatformSpecificDependencies() {
  const platform = os.platform();
  const arch = os.arch();

  console.log(`Detected platform: ${platform} ${arch}`);

  try {
    // Install platform-specific rollup binaries
    if (platform === "linux" && arch === "x64") {
      console.log("Installing Linux x64 dependencies...");
      execSync(
        "npm install @rollup/rollup-linux-x64-gnu @swc/core-linux-x64-gnu",
        { stdio: "inherit" },
      );
    } else if (platform === "win32" && arch === "x64") {
      console.log("Installing Windows x64 dependencies...");
      execSync(
        "npm install @rollup/rollup-win32-x64-msvc @swc/core-win32-x64-msvc",
        { stdio: "inherit" },
      );
    } else if (platform === "win32" && arch === "ia32") {
      console.log("Installing Windows x32 dependencies...");
      execSync(
        "npm install @rollup/rollup-win32-ia32-msvc @swc/core-win32-ia32-msvc",
        { stdio: "inherit" },
      );
    } else if (platform === "darwin" && arch === "x64") {
      console.log("Installing macOS x64 dependencies...");
      execSync("npm install @rollup/rollup-darwin-x64 @swc/core-darwin-x64", {
        stdio: "inherit",
      });
    } else if (platform === "darwin" && arch === "arm64") {
      console.log("Installing macOS ARM64 dependencies...");
      execSync(
        "npm install @rollup/rollup-darwin-arm64 @swc/core-darwin-arm64",
        { stdio: "inherit" },
      );
    } else {
      console.log(
        `Platform ${platform} ${arch} detected. Using fallback dependencies.`,
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

// Only run if this is not being executed during npm install of this package itself
if (require.main === module) {
  installPlatformSpecificDependencies();
}

module.exports = { installPlatformSpecificDependencies };
