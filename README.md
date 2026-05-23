# time

Quick start

1. Install dependencies:

```powershell
npm install
```

2. Run locally:

```powershell
npm start
```

GUI (Electron)

Run the GUI version:

```powershell
npm run gui
```

To package the GUI into a distributable Windows app (requires `electron-packager`):

```powershell
npm run package-gui
```

Build an .exe (Windows)

1. Install `pkg` (choose one):

```powershell
npm install -g pkg
# or
npx -p pkg pkg . --targets node18-win-x64 --output dist/discord.exe
```

2. From the project folder run:

```powershell
npm run build-exe
```

3. The executable will be written to `dist\discord.exe`.

Notes
- If you use `npx pkg` it will download the necessary binaries automatically.
- Run `npm install` before building so `pkg` includes the dependencies (`figlet`, `chalk`, `boxen`).
