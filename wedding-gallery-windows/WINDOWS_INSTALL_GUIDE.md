# 🪟 Wedding Gallery - Windows Installation Guide

## 🎯 Quick Start for Windows Users

### Method 1: One-Click Setup (Recommended)

1. **Download** the wedding gallery files
2. **Double-click** `start-windows.bat`
3. **Wait** for automatic installation and startup
4. **Open** your browser to `http://localhost:8080`

### Method 2: PowerShell (Alternative)

1. **Right-click** `start-windows.ps1`
2. **Select** "Run with PowerShell"
3. **Allow** execution if prompted
4. **Open** your browser to `http://localhost:8080`

## 📋 What You Need (Pre-installed)

### Required Software

- **Windows 10/11** (recommended) or Windows 8.1
- **Node.js 16+** - Download from [nodejs.org](https://nodejs.org/)
- **Modern Web Browser** - Chrome, Firefox, Edge, or Safari

### Installing Node.js on Windows

1. Go to https://nodejs.org/
2. Click "Download for Windows (x64)"
3. Run the installer
4. ✅ **Check "Add to PATH"** during installation
5. Restart your computer

## 🚀 What Happens When You Start

### Automatic Setup Process

1. **Dependency Check** - Verifies Node.js and npm installation
2. **Package Installation** - Downloads and installs required packages
3. **Platform Detection** - Installs Windows-specific optimizations
4. **Server Startup** - Starts the development server
5. **Ready!** - Gallery accessible at http://localhost:8080

### First Time Setup (30-60 seconds)

```
================================
Wedding Photo Gallery
Development Server for Windows
================================

Checking Node.js installation...
Node.js version: v18.17.0
Checking npm installation...
npm version: 9.6.7

Installing dependencies...
Installing Windows x64 dependencies...
Platform-specific dependencies installed successfully!

Starting development server...
The gallery will be available at: http://localhost:8080
```

## 🌐 Accessing Your Gallery

### Local Access

- **Your Computer**: http://localhost:8080
- **Alternative Port**: http://127.0.0.1:8080

### Network Access (Optional)

- **Other Devices**: Check the startup logs for network IP addresses
- **Example**: http://192.168.1.100:8080
- **WiFi Sharing**: Other devices on your WiFi can access the gallery

## 📁 File Organization on Windows

### Project Structure

```
wedding-gallery/
├── 📁 src/                    # Source code
├── 📁 public/                 # Public assets
├── 📁 scripts/                # Setup scripts
├── 📁 dist/                   # Built files (after build)
├── 🦇 start-windows.bat       # Quick start (double-click)
├── 🔷 start-windows.ps1       # PowerShell start
├── 🔨 build-windows.bat       # Build for production
├── 📄 package.json            # Dependencies
└── 📖 README files            # Documentation
```

### Windows-Specific Files

- **start-windows.bat** - Command prompt startup
- **start-windows.ps1** - PowerShell startup
- **build-windows.bat** - Production build
- **scripts/postinstall.js** - Cross-platform setup

## 🛠️ Command Line Usage (Advanced)

### Open Command Prompt in Project Folder

1. **Hold Shift** and **right-click** in the folder
2. **Select** "Open PowerShell window here" or "Open command window here"

### Common Commands

```cmd
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check for errors
npm run typecheck
```

## 🎨 Features Available

### 🔐 User Authentication

- **Register** new accounts
- **Login** with email/password
- **Role-based** access (admin/user)

### 📸 Photo Management

- **Upload** multiple photos (drag & drop)
- **Organize** in folders
- **Search** by filename or tags
- **Download** high-quality originals

### 🤖 AI Features

- **Face Detection** - Automatic face recognition
- **People Grouping** - Photos organized by people
- **Smart Classification** - AI-powered categorization

### 📱 Responsive Design

- **Desktop** - Full-featured experience
- **Tablet** - Touch-optimized interface
- **Mobile** - Mobile-responsive gallery

## 🏗️ Building for Production

### Create Production Build

1. **Double-click** `build-windows.bat`
2. **Wait** for build completion
3. **Find** built files in `dist/` folder

### Deploy to Web Server

1. **Copy** contents of `dist/` folder
2. **Upload** to your web hosting
3. **Configure** server for SPA routing

### Popular Windows Hosting Options

- **IIS** (Internet Information Services)
- **Apache** for Windows
- **XAMPP** (Apache + MySQL)
- **Local Network** sharing

## 🔧 Troubleshooting Windows Issues

### Common Problems & Solutions

#### ❌ "node is not recognized"

**Problem**: Node.js not in PATH
**Solution**:

1. Reinstall Node.js with "Add to PATH" checked
2. Restart Command Prompt/PowerShell
3. Test with: `node --version`

#### ❌ Port 8080 already in use

**Problem**: Another service using port 8080
**Solutions**:

- Close other development servers
- Kill process: `netstat -ano | findstr :8080` then `taskkill /PID [number] /F`
- Use different port: Set PORT=3000 before starting

#### ❌ PowerShell execution policy

**Problem**: "Execution of scripts is disabled"
**Solution**: Run PowerShell as Administrator:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### ❌ Windows Defender blocking

**Problem**: Antivirus blocking file operations
**Solution**:

1. Add project folder to Windows Defender exclusions
2. Windows Security → Virus & threat protection → Exclusions → Add folder

#### ❌ npm permission errors

**Problem**: Permission denied during installation
**Solutions**:

- Run Command Prompt as Administrator
- Use: `npm install --no-optional`
- Clear npm cache: `npm cache clean --force`

#### ❌ Long file paths (Windows limitation)

**Problem**: Path too long errors
**Solution**: Enable long paths in Windows 10/11:

1. Run `gpedit.msc` as Administrator
2. Computer Configuration → Administrative Templates → System → Filesystem
3. Enable "Enable Win32 long paths"

### Advanced Troubleshooting

#### Check System Requirements

```cmd
# Check Windows version
winver

# Check Node.js and npm
node --version
npm --version

# Check available ports
netstat -an | findstr :8080
```

#### Clean Installation

```cmd
# Remove node_modules and reinstall
rmdir /s node_modules
del package-lock.json
npm install
```

#### Network Diagnostics

```cmd
# Check local network
ipconfig
ping localhost
telnet localhost 8080
```

## 🔒 Security & Privacy

### Data Storage

- **Local Storage** - All data stays on your computer
- **No Cloud Upload** - Photos remain private
- **Browser Storage** - Uses localStorage for user data

### Network Security

- **Local Network** - Only accessible on your network
- **No External APIs** - No data sent to third parties
- **Firewall Safe** - Windows Firewall compatible

### User Privacy

- **Face Detection** - Processed locally, not uploaded
- **Photo Metadata** - Stored locally only
- **Login System** - Simple local authentication

## 📞 Getting Help

### Self-Help Resources

1. **Check troubleshooting section** above
2. **View startup logs** for error messages
3. **Test Node.js installation**: `node --version`
4. **Try different browser** (Chrome recommended)

### System Information Gathering

When seeking help, include:

- **Windows Version** (run `winver`)
- **Node.js Version** (run `node --version`)
- **Error Messages** from startup logs
- **Browser Console** errors (F12 → Console)

## 🎉 Success Checklist

✅ **Node.js installed** and in PATH  
✅ **Project files** downloaded/extracted  
✅ **start-windows.bat** runs without errors  
✅ **Browser opens** to http://localhost:8080  
✅ **Homepage loads** with wedding gallery interface  
✅ **Can register** a new user account  
✅ **Can upload** photos successfully  
✅ **Face detection** works on uploaded photos

## 🌟 Enjoy Your Wedding Gallery!

You now have a fully functional, AI-powered wedding photo gallery running on your Windows system! The gallery features:

- 💒 **Beautiful Interface** - Modern, responsive design
- 🤖 **AI Face Detection** - Automatic people categorization
- 🔐 **Secure Access** - User authentication and privacy
- 📁 **Smart Organization** - Folders and intelligent grouping
- 📱 **Cross-Device** - Works on all your Windows devices
- 💾 **50GB Storage** - Plenty of space for wedding photos

**Happy Memories! 💕📸**
