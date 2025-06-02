# Wedding Gallery - Windows Setup Guide 🪟

This guide will help you set up and run the Wedding Photo Gallery application on Windows systems.

## 📋 Prerequisites

### Required Software

1. **Node.js** (v16 or higher)

   - Download from: https://nodejs.org/
   - Choose the LTS version
   - Make sure to check "Add to PATH" during installation

2. **Git** (optional, for cloning)

   - Download from: https://git-scm.com/download/win

3. **Modern Web Browser**
   - Chrome, Firefox, Edge, or Safari

## 🚀 Quick Start (Windows)

### Option 1: Using Batch Files (Easiest)

1. **Download/Clone the project**
2. **Double-click `start-windows.bat`**
   - This will automatically install dependencies and start the server
   - The gallery will open at `http://localhost:8080`

### Option 2: Using Command Prompt/PowerShell

1. **Open Command Prompt or PowerShell**
2. **Navigate to project folder:**

   ```cmd
   cd path\to\wedding-gallery
   ```

3. **Install dependencies:**

   ```cmd
   npm install
   ```

4. **Start development server:**

   ```cmd
   npm run dev
   ```

5. **Open your browser** and go to `http://localhost:8080`

## 🏗️ Building for Production

### Using Batch File

- Double-click `build-windows.bat` to create a production build

### Using Command Line

```cmd
# Build the application
npm run build

# Preview the build (optional)
npm run preview
```

## 🌐 Hosting Options for Windows

### 1. Local Development Server

```cmd
npm run dev
```

- Accessible at `http://localhost:8080`
- Hot reload for development

### 2. Local Production Preview

```cmd
npm run preview
```

- Preview production build locally
- Accessible at `http://localhost:4173`

### 3. Network Access (LAN)

```cmd
npm run serve
```

- Accessible from other devices on your network
- Shows IP addresses for access

### 4. Windows IIS Deployment

1. **Build the application:**

   ```cmd
   npm run build
   ```

2. **Copy the `dist` folder** contents to your IIS website directory

3. **Configure IIS:**
   - Enable static content serving
   - Set up URL rewriting for SPA (Single Page Application)

### 5. Apache/Nginx on Windows

- Build the application: `npm run build`
- Copy `dist` folder contents to web server document root
- Configure server for SPA routing

## 🔧 Windows-Specific Features

### Platform Detection

The application automatically detects Windows and installs appropriate dependencies:

- `@rollup/rollup-win32-x64-msvc` for 64-bit Windows
- `@swc/core-win32-x64-msvc` for 64-bit Windows
- `@rollup/rollup-win32-ia32-msvc` for 32-bit Windows

### File Path Compatibility

- All file operations use Node.js path utilities for cross-platform compatibility
- Works with Windows backslash (`\`) and Unix forward slash (`/`) paths

### Environment Variables

Set Windows environment variables if needed:

```cmd
set NODE_ENV=production
set PORT=3000
npm run dev
```

## 🛠️ Troubleshooting

### Common Issues on Windows

#### 1. Node.js Not Found

**Error:** `'node' is not recognized as an internal or external command`
**Solution:**

- Reinstall Node.js and ensure "Add to PATH" is checked
- Restart Command Prompt/PowerShell
- Verify installation: `node --version`

#### 2. npm Permission Issues

**Error:** Permission denied errors during `npm install`
**Solution:**

```cmd
# Run as Administrator, or use:
npm install --no-optional
```

#### 3. Port Already in Use

**Error:** `Port 8080 is already in use`
**Solution:**

```cmd
# Use a different port
set PORT=3000
npm run dev
```

#### 4. Antivirus Blocking

**Issue:** Antivirus software blocking file operations
**Solution:**

- Add project folder to antivirus exclusions
- Temporarily disable real-time protection during development

#### 5. Long Path Names

**Issue:** Windows path length limitations
**Solution:**

- Enable long path names in Windows 10/11:
  - Run `gpedit.msc` as Administrator
  - Navigate to: Computer Configuration > Administrative Templates > System > Filesystem
  - Enable "Enable Win32 long paths"

### Build Issues

#### TypeScript Errors

```cmd
# Check for TypeScript errors
npm run typecheck
```

#### Clean Build

```cmd
# Clean and rebuild
rmdir /s dist
rmdir /s node_modules
del package-lock.json
npm install
npm run build
```

## 📁 Windows File Structure

```
wedding-gallery/
├── dist/                  # Production build output
├── src/                   # Source code
├── scripts/               # Build scripts
├── start-windows.bat      # Windows startup script
├── build-windows.bat      # Windows build script
├── package.json          # Node.js dependencies
└── WINDOWS_SETUP.md       # This file
```

## 🌟 Windows-Optimized Scripts

The following npm scripts are optimized for Windows:

```json
{
  "dev:windows": "npm run dev",
  "build:windows": "npm run build",
  "start": "npm run dev",
  "serve": "vite preview --host"
}
```

## 🔐 Security Considerations

### Windows Defender

- Add project folder to Windows Defender exclusions for better performance
- The application uses only client-side storage (localStorage)

### Network Access

- Windows Firewall may prompt for network access permission
- Allow Node.js through firewall for LAN access

### File Permissions

- Ensure the user has read/write permissions in the project directory
- Run as Administrator if encountering permission issues

## 📞 Support

If you encounter Windows-specific issues:

1. **Check the troubleshooting section above**
2. **Verify your Node.js installation:** `node --version`
3. **Check npm version:** `npm --version`
4. **Try running as Administrator**
5. **Check Windows Event Viewer** for system-level errors

## 🎉 Success!

Once running, you'll have a fully functional wedding photo gallery with:

- ✅ AI-powered face detection and categorization
- ✅ Secure user authentication and registration
- ✅ Photo upload, organization, and download
- ✅ Responsive design for all Windows devices
- ✅ Cross-platform compatibility

Enjoy your beautiful wedding photo gallery on Windows! 💒✨
