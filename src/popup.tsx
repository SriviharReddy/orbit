/** popup.tsx — entry point for the browser action popup. */
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'theme-ui';
import App from './components/App';
import theme from './theme';
import './css/global.css';

const Popup: React.FC = () => {
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.url) setUrl(tabs[0].url);
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div id="popupBody" style={{ width: '480px', maxHeight: '600px', overflowY: 'auto' }}>
        <App url={url} />
      </div>
    </ThemeProvider>
  );
};

ReactDOM.render(<Popup />, document.getElementById('root'));
