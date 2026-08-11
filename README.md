# Cisco RoomOS Kiosk Manager Macro

An interactive **RoomOS In-Room Control & Kiosk Management Macro** designed for Cisco Desk, Board, and Room Series devices. 

This macro provides a multi-page UI panel on the Touch 10 / Navigator / Desk Pro display to configure and manage Web Engine kiosk settings dynamically, switch between custom URLs or predefined web applications, and enforce hardware/security behaviors in real time.

<img width="604" height="268" alt="image" src="https://github.com/user-attachments/assets/aedf6629-7f4d-4965-bdc8-79e56e71b89e" />
<img width="577" height="303" alt="image" src="https://github.com/user-attachments/assets/6cf4bbf4-8ada-46c9-9526-90c9dde7b935" />
<img width="578" height="407" alt="image" src="https://github.com/user-attachments/assets/0fb70ba6-98df-43d0-84a0-2c8102a740e3" />


---

## 🌟 Features

* **Dynamic Kiosk URL Configuration:** Input and update any web app URL directly from the touch interface with immediate status preview.
* **Instant Pre-configured App Modes:** Single-toggle switching between popular RoomOS web applications with immediate launch:
  * 📸 **Photobooth Mode** *(by Rémy Cronier)*
  * 🏢 **Receptionist Mode** *(Cisco Sample)*
  * 👤 **Visitor Receptionist Mode** *(by Tore Bjolseth)*
* **Real-time Configuration Sync:** The UI automatically queries the codec (`xConfig`) every time the panel is opened, guaranteeing that all toggles and current URL text accurately reflect the system state.
* **Instant Hardware & Feature Toggles:** Toggles apply changes directly to the codec upon interaction without requiring a separate save step:
  * Toggle **SIP URL Handler**
  * Silence / Disable **Ultrasound** (`Audio Ultrasound MaxVolume`)
  * Enable / Disable **Cisco Assistant** (`UserInterface Assistant Mode`)
  * Lock / Unlock **Settings Menu** (`UserInterface SettingsMenu Mode`)
  * Enable / Disable **SpeakerTrack** (`Cameras SpeakerTrack Mode`)
  * Toggle **Wakeup on Motion** (`Standby WakeupOnMotionDetection`)
* **Automatic Web Engine Setup:** Automatically configures HTTP/HTTPS policies and grants camera/microphone permissions for active target domains.
* **Control Panel Exit Button:** Dedicated action button in the Control Panel menu to instantly exit Kiosk mode, purge Web Engine cache/storage, and reset example states.

---

## 🛠️ Installation

1. Log into your Cisco device's web interface (or open **Control Hub** / **CE Deploy**).
2. Open the **Macro Editor**.
3. Create a new Macro (e.g., `KioskManager.js`) and paste the complete JavaScript code.
4. Turn **On** the macro toggle switch.

The macro automatically registers two UI panel extensions:
- **HomeScreen Panel:** `Kiosk Config` (Main multi-page interface)
- **ControlPanel Action:** `Exit Kiosk` (Fast exit button)

---

## 📱 UI Overview

The main panel (`kiosk_config_panel`) is divided into **3 dedicated pages**:

### 1. 🌐 Kiosk Page
* **Current URL:** Displays the active Kiosk URL read directly from the codec configuration.
* **Actions Row:** 
  * **Set URL** (`size=2`): Opens an on-screen text input prompt to enter a custom URL.
  * **💾 Save & Enable** (`size=2`): Commits the current custom URL, applies media permissions, and launches Kiosk mode.
* **Exit Secret Notice:** Reminds users of the native 3-finger triple-tap exit gesture.

### 2. 📋 Examples Page
Features exclusive toggles for community presets. Activating any toggle automatically:
1. Unchecks other example toggles.
2. Updates `Current URL` and state.
3. Grants camera & microphone permissions for the domain.
4. **Instantly applies and launches Kiosk mode**.

### 3. ⚙️ Settings Page
Modifies codec settings instantly upon toggle interaction:

| Setting | Type | Codec Action (`xConfig`) |
| :--- | :--- | :--- |
| **Enable SIP URL Handler** | Toggle | `WebEngine Features SipUrlHandler: On/Off` |
| **Disable Ultrasound** | Toggle | `Audio Ultrasound MaxVolume: 0` (Disabled) / `70` (Enabled) |
| **Disable Assistant** | Toggle | `UserInterface Assistant Mode: Off/On` |
| **Lock Settings Menu** | Toggle | `UserInterface SettingsMenu Mode: Locked/Unlocked` |
| **Disable SpeakerTrack** | Toggle | `Cameras SpeakerTrack Mode: Off/Auto` |
| **Wakeup On Motion** | Toggle | `Standby WakeupOnMotionDetection: On/Off` |

---

## 🚪 Exit Action Button (`kiosk_exit_action`)

Located in the top **Control Panel** swipe-down menu:
- Instantly sets `UserInterface Kiosk Mode: Off`.
- Executes `xCommand WebEngine DeleteStorage Type: All` to clear local web storage and cookies.
- Resets preset toggles back to `Off`.

---

## 🔒 Permissions & Security

When applying a URL (custom or preset), the macro parses the hostname and executes:
```javascript
xCommand WebEngine MediaAccess Add Device: Camera Hostname: <domain>
xCommand WebEngine MediaAccess Add Device: Microphone Hostname: <domain>
