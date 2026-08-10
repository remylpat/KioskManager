# Cisco RoomOS Kiosk Manager Macro

An interactive **RoomOS In-Room Control & Kiosk Management Macro** designed for Cisco Desk, Board, and Room Series devices. 

This macro provides a full UI panel on the Touch 10 / Navigator / Desk Pro display to configure and manage Web Engine kiosk settings dynamically, switch between custom URLs or predefined web applications (such as Photobooth or Receptionist modes), and enforce security/device behaviors.

---

## 🌟 Features

* **Dynamic Kiosk URL Configuration:** Input and update any web app URL directly from the touch interface.
* **Pre-configured App Modes:** Single-toggle switching between popular RoomOS web applications:
  * 📸 **Photobooth Mode** *(by Rémy Cronier)*
  * 🏢 **Receptionist Mode** *(Cisco Sample)*
  * 👤 **Visitor Receptionist Mode** *(by Tore Bjolseth)*
* **Automatic Web Engine Setup:** Automatically configures HTTP/HTTPS policies and grants camera/microphone permissions for the active domain.
* **Hardware & Feature Toggles:**
  * Toggle **SIP URL Handler**
  * Silence / Disable **Ultrasound** (Max volume control)
  * Enable / Disable **Cisco Assistant**
  * Lock / Unlock **Settings Menu**
  * Enable / Disable **SpeakerTrack**
  * Toggle **Wakeup on Motion**
* **Control Panel Exit Button:** Includes a dedicated action button in the Control Panel to easily exit Kiosk mode and purge Web Engine cache/cookies.

---

## 🛠️ Installation

1. Log into your Cisco device's web interface (or open **CE Deploy** / **Control Hub**).
2. Open the **Macro Editor**.
3. Create a new Macro (e.g., `KioskManager.js`) and paste the content of `kiosk_manager.js`.
4. Turn **On** the macro toggle switch.

The macro will automatically register two UI panel extensions:
- **HomeScreen Panel:** `Kiosk Config` (Main configuration interface)
- **ControlPanel Action:** `Exit Kiosk` (Fast exit button)

---

## 📱 UI Overview

### Main Panel (`kiosk_config_panel`)

| Row / Control | Type | Description |
| :--- | :--- | :--- |
| **Current URL** | Text Display | Displays the active Kiosk URL stored in the codec configuration. |
| **Set Custom Kiosk URL** | Button | Opens an on-screen text input prompt to enter a custom web URL. |
| **SIP URL Handler** | Toggle | Controls `WebEngine Features SipUrlHandler`. |
| **Disable Ultrasound** | Toggle | Mutes or restores audio ultrasound emission (`Audio Ultrasound MaxVolume`). |
| **Disable Assistant** | Toggle | Disables or enables Webex Assistant (`UserInterface Assistant Mode`). |
| **Lock Settings Menu** | Toggle | Prevents users from accessing device settings (`UserInterface SettingsMenu Mode`). |
| **Disable SpeakerTrack** | Toggle | Toggles camera auto-framing (`Cameras SpeakerTrack Mode`). |
| **Wakeup On Motion** | Toggle | Controls standby motion detection (`Standby WakeupOnMotionDetection`). |
| **Examples / Presets** | Toggles | Exclusive toggles to quickly load Kiosk Examples from the community. |
| **Save & Apply Settings** | Button | Commits all selected toggles, updates Web Engine media permissions, and launches Kiosk mode. |

### Exit Action Button (`kiosk_exit_action`)

Located in the **Control Panel** swipe-down menu:
- Instantly sets `UserInterface Kiosk Mode: Off`.
- Executes `xCommand WebEngine DeleteStorage Type: All` to clear local web storage and cookies.
- Resets preset toggles back to `Off`.

---

## 🔒 Permissions & Security

When applying a URL (custom or preset), the macro automatically parses the hostname and executes:
```javascript
xCommand WebEngine MediaAccess Add Device: Camera Hostname: <domain>
xCommand WebEngine MediaAccess Add Device: Microphone Hostname: <domain>
