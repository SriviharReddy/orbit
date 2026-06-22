/** sidePanel.tsx — entry point for the Chrome side panel. */
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'theme-ui';
import App from './components/App';
import theme from './theme';
import './css/global.css';

const SidePanel: React.FC = () => {
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    // Get initial URL
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.url) setUrl(tabs[0].url);
    });

    // Update when the tab navigates
    const handleActivated = () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.url) setUrl(tabs[0].url);
      });
    };

    chrome.tabs.onActivated.addListener(handleActivated);
    chrome.tabs.onUpdated.addListener((_id, change, tab) => {
      if (change.status === 'complete' && tab.active && tab.url) {
        setUrl(tab.url);
      }
    });

    return () => chrome.tabs.onActivated.removeListener(handleActivated);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div id="popupBody" style={{ width: '100%', height: '100vh', overflowY: 'auto' }}>
        <App url={url} isSidePanel />
      </div>
    </ThemeProvider>
  );
};

ReactDOM.render(<SidePanel />, document.getElementById('root'));
