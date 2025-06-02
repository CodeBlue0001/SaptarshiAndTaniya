const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("Creating Windows deployment package...");

// Create deployment directory
const deployDir = "wedding-gallery-windows";
if (fs.existsSync(deployDir)) {
  fs.rmSync(deployDir, { recursive: true, force: true });
}
fs.mkdirSync(deployDir);

// Copy necessary files
const filesToCopy = [
  "package.json",
  "package-lock.json",
  "vite.config.ts",
  "tsconfig.json",
  "tsconfig.app.json",
  "tsconfig.node.json",
  "tailwind.config.ts",
  "postcss.config.js",
  "components.json",
  "index.html",
  "start-windows.bat",
  "build-windows.bat",
  "start-windows.ps1",
  "WINDOWS_SETUP.md",
  "WEDDING_GALLERY_README.md",
];

const directoriesToCopy = ["src", "public", "scripts"];

// Copy files
filesToCopy.forEach((file) => {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join(deployDir, file));
    console.log(`✓ Copied ${file}`);
  }
});

// Copy directories
directoriesToCopy.forEach((dir) => {
  if (fs.existsSync(dir)) {
    fs.cpSync(dir, path.join(deployDir, dir), { recursive: true });
    console.log(`✓ Copied ${dir}/`);
  }
});

// Create Windows-specific README
const windowsReadme = `# Wedding Gallery - Windows Package

## Quick Start for Windows Users

### Method 1: Double-click to start (Easiest)
1. Double-click \`start-windows.bat\`
2. Wait for installation and startup
3. Open http://localhost:8080 in your browser

### Method 2: PowerShell
1. Right-click \`start-windows.ps1\` and "Run with PowerShell"
2. Open http://localhost:8080 in your browser

### Method 3: Command Line
1. Open Command Prompt in this folder
2. Run: \`npm install\`
3. Run: \`npm run dev\`
4. Open http://localhost:8080 in your browser

## Building for Production
- Double-click \`build-windows.bat\`
- Or run: \`npm run build\`

## Features
- 💒 Wedding photo gallery with AI face detection
- 🔐 Secure login and registration system
- 📤 Photo upload with drag & drop
- 👥 Automatic people categorization
- 📁 Folder organization
- ��� Up to 50GB storage
- 📱 Mobile responsive design

See WINDOWS_SETUP.md for detailed setup instructions.
See WEDDING_GALLERY_README.md for complete feature documentation.
`;

fs.writeFileSync(path.join(deployDir, "README.md"), windowsReadme);

console.log(`\n✅ Windows deployment package created in: ${deployDir}/`);
console.log("\nTo use:");
console.log(`1. Copy the '${deployDir}' folder to your Windows machine`);
console.log("2. Double-click start-windows.bat to start the application");
console.log("3. Open http://localhost:8080 in your browser");
console.log("\nFor detailed instructions, see WINDOWS_SETUP.md");
