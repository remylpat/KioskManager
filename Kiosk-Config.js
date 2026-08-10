import xapi from 'xapi';

const MAIN_PANEL_ID = 'kiosk_config_panel';
const ACTION_PANEL_ID = 'kiosk_exit_action';

const PHOTOBOOTH_URL = 'https://cronier-moisiere.synology.me/PhotoBooth/index.html';
const RECEPTIONIST_URL = 'https://cisco-ce.github.io/roomos-samples/kiosk-example/';
const VISITOR_KIOSK_URL = 'https://cisco-ce.github.io/roomos-samples/visitor-kiosk/';

// 1. Panneau principal de configuration réintégré depuis le Desk Pro
const XML_MAIN_PANEL = `
<Extensions>
  <Panel>
    <Order>1</Order>
    <PanelId>${MAIN_PANEL_ID}</PanelId>
    <Origin>local</Origin>
    <Location>HomeScreen</Location>
    <Icon>Sliders</Icon>
    <Name>Kiosk Config</Name>
    <ActivityType>Custom</ActivityType>
    <Page>
      <Name>⚙️ Kiosk Settings</Name>
      <Row>
        <Name>✅ Current URL</Name>
        <Widget>
          <WidgetId>txt_custom_url</WidgetId>
          <Name>Text</Name>
          <Type>Text</Type>
          <Options>size=4;fontSize=normal;align=center</Options>
        </Widget>
      </Row>
      <Row>
        <Name>⚙️ Set Custom Kiosk URL</Name>
        <Widget>
          <WidgetId>btn_set_url</WidgetId>
          <Name>Set URL</Name>
          <Type>Button</Type>
          <Options>size=2</Options>
        </Widget>
      </Row>
      <Row>
        <Name>📞 Enable SIP URL Handler</Name>
        <Widget>
          <WidgetId>toggle_sip_url</WidgetId>
          <Type>ToggleButton</Type>
          <Options>size=1</Options>
        </Widget>
      </Row>
      <Row>
        <Name>🔊 Disable Ultrasound</Name>
        <Widget>
          <WidgetId>toggle_ultrasound</WidgetId>
          <Type>ToggleButton</Type>
          <Options>size=1</Options>
        </Widget>
      </Row>
      <Row>
        <Name>🎙️ Disable Assistant</Name>
        <Widget>
          <WidgetId>toggle_assistant</WidgetId>
          <Type>ToggleButton</Type>
          <Options>size=1</Options>
        </Widget>
      </Row>
      <Row>
        <Name>🔒 Lock Settings Menu</Name>
        <Widget>
          <WidgetId>toggle_settings_menu</WidgetId>
          <Type>ToggleButton</Type>
          <Options>size=1</Options>
        </Widget>
      </Row>
      <Row>
        <Name>📷 Disable SpeakerTrack</Name>
        <Widget>
          <WidgetId>toggle_speakertrack</WidgetId>
          <Type>ToggleButton</Type>
          <Options>size=1</Options>
        </Widget>
      </Row>
      <Row>
        <Name>🚶 Wakeup On Motion</Name>
        <Widget>
          <WidgetId>toggle_motion_detection</WidgetId>
          <Type>ToggleButton</Type>
          <Options>size=1</Options>
        </Widget>
      </Row>
      <Row>
        <Name>------ Examples ------</Name>
        <Widget>
          <WidgetId>widget_1</WidgetId>
          <Name>Few examples from cool members 😎</Name>
          <Type>Text</Type>
          <Options>size=4;fontSize=normal;align=center</Options>
        </Widget>
      </Row>
      <Row>
        <Name>📸 Photobooth</Name>
        <Widget>
          <WidgetId>widget_2</WidgetId>
          <Name> by Rémy Cronier</Name>
          <Type>Text</Type>
          <Options>size=3;fontSize=normal;align=center</Options>
        </Widget>
        <Widget>
          <WidgetId>toggle_photobooth_mode</WidgetId>
          <Type>ToggleButton</Type>
          <Options>size=1</Options>
        </Widget>
      </Row>
      <Row>
        <Name>🏢 Receptionist</Name>
        <Widget>
          <WidgetId>toggle_receptionist_mode</WidgetId>
          <Type>ToggleButton</Type>
          <Options>size=1</Options>
        </Widget>
      </Row>
      <Row>
        <Name>👤 Visitor Receptionist</Name>
        <Widget>
          <WidgetId>widget_4</WidgetId>
          <Name>by Tore Bjolseth</Name>
          <Type>Text</Type>
          <Options>size=3;fontSize=normal;align=center</Options>
        </Widget>
        <Widget>
          <WidgetId>toggle_visitor_kiosk_mode</WidgetId>
          <Type>ToggleButton</Type>
          <Options>size=1</Options>
        </Widget>
      </Row>
      <Row>
        <Name>------ 🚀 Ready 🚀 ------</Name>
        <Widget>
          <WidgetId>widget_3</WidgetId>
          <Name>🤫 Exit Secret: Tap 3x with 3 👆 on 📺</Name>
          <Type>Text</Type>
          <Options>size=4;fontSize=normal;align=center</Options>
        </Widget>
        <Widget>
          <WidgetId>btn_save_apply</WidgetId>
          <Name>💾 Save &amp; Apply Settings</Name>
          <Type>Button</Type>
          <Options>size=4</Options>
        </Widget>
      </Row>
      <Row>
        <Name/>
      </Row>
      <Row>
        <Name/>
      </Row>
      <Options/>
    </Page>
  </Panel>
</Extensions>
`;

// 2. Bouton d'action dans le Control Panel pour sortir du Kiosque
const XML_ACTION_PANEL = `
<Extensions>
  <Panel>
    <Order>1</Order>
    <PanelId>${ACTION_PANEL_ID}</PanelId>
    <Origin>local</Origin>
    <Location>ControlPanel</Location>
    <Type>Action</Type>
    <Icon>Power</Icon>
    <Name>Exit Kiosk</Name>
  </Panel>
</Extensions>
`;

const state = {
  kioskMode: 'off',
  customUrl: '',
  photoboothMode: 'off',
  receptionistMode: 'off',
  visitorKioskMode: 'off',
  sipUrl: 'off',
  disableUltrasound: 'off',
  disableAssistant: 'off',
  lockSettings: 'off',
  disableSpeakerTrack: 'off',
  motionDetection: 'off'
};

async function refreshUrlTextWidget() {
  const textValue = state.customUrl || 'Not set';
  try {
    await xapi.Command.UserInterface.Extensions.Widget.SetValue({ 
      WidgetId: 'txt_custom_url', 
      Value: textValue 
    });
  } catch (e) {
    console.warn('Kiosk Macro: Could not update txt_custom_url widget:', e.message);
  }
}

async function setupUIPanels() {
  try {
    try { await xapi.Command.UserInterface.Extensions.Panel.Remove({ PanelId: MAIN_PANEL_ID }); } catch (e) {}
    try { await xapi.Command.UserInterface.Extensions.Panel.Remove({ PanelId: ACTION_PANEL_ID }); } catch (e) {}

    await xapi.Command.UserInterface.Extensions.Panel.Save({ PanelId: MAIN_PANEL_ID }, XML_MAIN_PANEL);
    await xapi.Command.UserInterface.Extensions.Panel.Save({ PanelId: ACTION_PANEL_ID }, XML_ACTION_PANEL);

    // Lecture de l'URL existante dans les réglages du codec
    try {
      const currentConfigUrl = await xapi.Config.UserInterface.Kiosk.URL.get();
      if (currentConfigUrl) {
        state.customUrl = currentConfigUrl;
      }
    } catch (e) {
      console.warn('Kiosk Macro: Unable to read current Kiosk URL:', e.message);
    }

    await refreshUrlTextWidget();

    console.log('Kiosk Macro: UI Panels loaded.');
  } catch (err) {
    console.error('Kiosk Macro: Error loading UI panels:', err);
  }
}

async function initSystemSettings() {
  const configs = [
    { label: 'HttpClient Mode', fn: () => xapi.Config.HttpClient.Mode.set('On') },
    { label: 'HttpClient AllowHTTP', fn: () => xapi.Config.HttpClient.AllowHTTP.set('True') },
    { label: 'HttpClient AllowInsecureHTTPS', fn: () => xapi.Config.HttpClient.AllowInsecureHTTPS.set('True') },
    { label: 'NetworkServices HTTP', fn: () => xapi.Config.NetworkServices.HTTP.Mode.set('HTTP+HTTPS') },
    { label: 'WebEngine Mode', fn: () => xapi.Config.WebEngine.Mode.set('On') }
  ];

  for (const cfg of configs) {
    try {
      await cfg.fn();
    } catch (err) {
      console.warn(`Kiosk Macro: Config Skipped (${cfg.label}): ${err.message}`);
    }
  }
}

async function grantMediaPermissions(rawUrl) {
  if (!rawUrl) return;

  let hostOnly = rawUrl;
  try {
    if (rawUrl.includes('://')) {
      hostOnly = rawUrl.split('/')[2].split(':')[0];
    } else {
      hostOnly = rawUrl.split('/')[0].split(':')[0];
    }
  } catch (e) {
    hostOnly = rawUrl;
  }

  try {
    await xapi.Command.WebEngine.MediaAccess.Add({ Device: 'Camera', Hostname: hostOnly });
    await xapi.Command.WebEngine.MediaAccess.Add({ Device: 'Microphone', Hostname: hostOnly });
    console.log(`Kiosk Macro: MediaAccess granted for ${hostOnly}`);
  } catch (err) {
    console.error(`Kiosk Macro: MediaAccess failed for ${hostOnly}:`, err);
  }
}

async function applyConfigurations() {
  console.log('Kiosk Macro: Applying configurations...');

  try { await xapi.Config.WebEngine.Mode.set('On'); } catch (e) {}

  // Sélection de l'URL à charger selon les exemples activés
  let targetUrl = state.customUrl;
  if (state.photoboothMode === 'on') {
    targetUrl = PHOTOBOOTH_URL;
  } else if (state.receptionistMode === 'on') {
    targetUrl = RECEPTIONIST_URL;
  } else if (state.visitorKioskMode === 'on') {
    targetUrl = VISITOR_KIOSK_URL;
  }

  if (targetUrl) {
    await grantMediaPermissions(targetUrl);
    try { await xapi.Config.UserInterface.Kiosk.URL.set(targetUrl); } catch (e) {}
  }

  // Activer le mode Kiosk si un exemple ou une URL personnalisée est choisie
  const isKioskActive = (
    targetUrl.length > 0 ||
    state.photoboothMode === 'on' || 
    state.receptionistMode === 'on' || 
    state.visitorKioskMode === 'on'
  );
  
  try { await xapi.Config.UserInterface.Kiosk.Mode.set(isKioskActive ? 'On' : 'Off'); } catch (e) {}
  try { await xapi.Config.WebEngine.Features.SipUrlHandler.set(state.sipUrl === 'on' ? 'On' : 'Off'); } catch (e) {}

  const ultraVol = state.disableUltrasound === 'on' ? 0 : 70;
  try { await xapi.Config.Audio.Ultrasound.MaxVolume.set(ultraVol); } catch (e) {}
  try { await xapi.Config.UserInterface.Assistant.Mode.set(state.disableAssistant === 'on' ? 'Off' : 'On'); } catch (e) {}
  try { await xapi.Config.UserInterface.SettingsMenu.Mode.set(state.lockSettings === 'on' ? 'Locked' : 'Unlocked'); } catch (e) {}
  try { await xapi.Config.Cameras.SpeakerTrack.Mode.set(state.disableSpeakerTrack === 'on' ? 'Off' : 'Auto'); } catch (e) {}
  try { await xapi.Config.Standby.WakeupOnMotionDetection.set(state.motionDetection === 'on' ? 'On' : 'Off'); } catch (e) {}

  xapi.Command.UserInterface.Message.Alert.Display({
    Title: 'Settings Saved',
    Text: 'Kiosk configurations applied successfully.',
    Duration: 3
  });

  try {
    await xapi.Command.UserInterface.Extensions.Panel.Close();
  } catch (e) {
    console.warn('Kiosk Macro: Unable to close UI panel:', e.message);
  }
}

async function exitAndCleanKiosk() {
  try {
    await xapi.Config.UserInterface.Kiosk.Mode.set('Off');
    await xapi.Command.WebEngine.DeleteStorage({ Type: 'All' });

    state.photoboothMode = 'off';
    state.receptionistMode = 'off';
    state.visitorKioskMode = 'off';

    xapi.Command.UserInterface.Extensions.Widget.SetValue({ WidgetId: 'toggle_photobooth_mode', Value: 'off' });
    xapi.Command.UserInterface.Extensions.Widget.SetValue({ WidgetId: 'toggle_receptionist_mode', Value: 'off' });
    xapi.Command.UserInterface.Extensions.Widget.SetValue({ WidgetId: 'toggle_visitor_kiosk_mode', Value: 'off' });

    xapi.Command.UserInterface.Message.Alert.Display({
      Title: 'Kiosk Reset',
      Text: 'Kiosk mode disabled and cache cleared.',
      Duration: 3
    });
  } catch (err) {
    console.error('Kiosk Macro: Error exiting Kiosk mode:', err);
  }
}

async function main() {
  await setupUIPanels();
  await initSystemSettings();
}

main();

xapi.Event.UserInterface.Extensions.Panel.Clicked.on(async (event) => {
  if (event.PanelId === ACTION_PANEL_ID) {
    await exitAndCleanKiosk();
  }
});

xapi.Event.UserInterface.Extensions.Widget.Action.on(async (action) => {
  if (action.Type !== 'clicked' && action.Type !== 'changed') return;

  switch (action.WidgetId) {
    case 'btn_set_url':
      xapi.Command.UserInterface.Message.TextInput.Display({
        FeedbackId: 'input_kiosk_url',
        Title: 'Kiosk Target URL',
        Text: 'Enter web application URL:',
        Placeholder: state.customUrl || 'https://...',
        InputType: 'SingleLine',
        SubmitText: 'Set'
      });
      break;

    case 'toggle_photobooth_mode':
      state.photoboothMode = action.Value;
      if (action.Value === 'on') {
        state.receptionistMode = 'off';
        state.visitorKioskMode = 'off';
        xapi.Command.UserInterface.Extensions.Widget.SetValue({ WidgetId: 'toggle_receptionist_mode', Value: 'off' });
        xapi.Command.UserInterface.Extensions.Widget.SetValue({ WidgetId: 'toggle_visitor_kiosk_mode', Value: 'off' });
      }
      break;

    case 'toggle_receptionist_mode':
      state.receptionistMode = action.Value;
      if (action.Value === 'on') {
        state.photoboothMode = 'off';
        state.visitorKioskMode = 'off';
        xapi.Command.UserInterface.Extensions.Widget.SetValue({ WidgetId: 'toggle_photobooth_mode', Value: 'off' });
        xapi.Command.UserInterface.Extensions.Widget.SetValue({ WidgetId: 'toggle_visitor_kiosk_mode', Value: 'off' });
      }
      break;

    case 'toggle_visitor_kiosk_mode':
      state.visitorKioskMode = action.Value;
      if (action.Value === 'on') {
        state.photoboothMode = 'off';
        state.receptionistMode = 'off';
        xapi.Command.UserInterface.Extensions.Widget.SetValue({ WidgetId: 'toggle_photobooth_mode', Value: 'off' });
        xapi.Command.UserInterface.Extensions.Widget.SetValue({ WidgetId: 'toggle_receptionist_mode', Value: 'off' });
      }
      break;

    case 'toggle_sip_url':
      state.sipUrl = action.Value;
      break;

    case 'toggle_ultrasound':
      state.disableUltrasound = action.Value;
      break;

    case 'toggle_assistant':
      state.disableAssistant = action.Value;
      break;

    case 'toggle_settings_menu':
      state.lockSettings = action.Value;
      break;

    case 'toggle_speakertrack':
      state.disableSpeakerTrack = action.Value;
      break;

    case 'toggle_motion_detection':
      state.motionDetection = action.Value;
      break;

    case 'btn_save_apply':
      await applyConfigurations();
      break;
  }
});

xapi.Event.UserInterface.Message.TextInput.Response.on(async (event) => {
  if (event.FeedbackId === 'input_kiosk_url' && event.Text) {
    state.customUrl = event.Text;
    await refreshUrlTextWidget();
    console.log(`Kiosk Macro: Custom URL set to ${event.Text}`);
  }
});