/** options.tsx — extension options/settings page. */
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider, Box, Flex, Label, Select, Checkbox, Text, Button } from 'theme-ui';
import { useColorMode } from 'theme-ui';
import theme from './theme';
import './css/global.css';

const Options: React.FC = () => {
  const [themeMode, setThemeMode] = useState('default');
  const [sortType, setSortType] = useState('best');
  const [youtubeDefault, setYoutubeDefault] = useState(false);
  const [hidePosts, setHidePosts] = useState(false);
  const [noPopupCheck, setNoPopupCheck] = useState(false);
  const [sidePanelDefault, setSidePanelDefault] = useState(false);
  const [saved, setSaved] = useState(false);
  const [, setColorMode] = useColorMode();

  useEffect(() => {
    chrome.storage.local.get(
      ['theme', 'sortType', 'youtubeDefault', 'hidePosts', 'noPopupCheck', 'sidePanelDefault'],
      (result) => {
        if (result.theme) setThemeMode(result.theme);
        if (result.sortType) setSortType(result.sortType);
        if (result.youtubeDefault !== undefined) setYoutubeDefault(result.youtubeDefault);
        if (result.hidePosts !== undefined) setHidePosts(result.hidePosts);
        if (result.noPopupCheck !== undefined) setNoPopupCheck(result.noPopupCheck);
        if (result.sidePanelDefault !== undefined) setSidePanelDefault(result.sidePanelDefault);
      }
    );
  }, []);

  const handleSave = () => {
    const settings = { theme: themeMode, sortType, youtubeDefault, hidePosts, noPopupCheck, sidePanelDefault };
    chrome.storage.local.set(settings, () => {
      // Apply theme immediately
      if (themeMode === 'default') {
        setColorMode(window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      } else {
        setColorMode(themeMode);
      }
      // Update side panel behavior
      chrome.runtime.sendMessage({ updateSidePanel: sidePanelDefault });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  const row = { display: 'flex', alignItems: 'center', mb: '16px', gap: '12px' };

  return (
    <Box id="popupBody" sx={{ p: '24px', maxWidth: '400px', color: 'primaryText' }}>
      <Text sx={{ fontSize: '20px', fontWeight: 'bold', mb: '24px', display: 'block' }}>
        Orbit Settings
      </Text>

      {/* Theme */}
      <Flex sx={row}>
        <Label sx={{ minWidth: '160px' }}>Theme</Label>
        <Select value={themeMode} onChange={(e) => setThemeMode(e.target.value)}>
          <option value="default">System default</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </Select>
      </Flex>

      {/* Default sort */}
      <Flex sx={row}>
        <Label sx={{ minWidth: '160px' }}>Default sort</Label>
        <Select value={sortType} onChange={(e) => setSortType(e.target.value)}>
          <option value="best">Best</option>
          <option value="top">Top</option>
          <option value="new">New</option>
          <option value="old">Old</option>
          <option value="controversial">Controversial</option>
        </Select>
      </Flex>

      {/* Checkboxes */}
      <Flex sx={row}>
        <Label>
          <Checkbox checked={youtubeDefault} onChange={(e) => setYoutubeDefault(e.target.checked)} />
          Show YouTube comments by default on YouTube
        </Label>
      </Flex>

      <Flex sx={row}>
        <Label>
          <Checkbox checked={hidePosts} onChange={(e) => setHidePosts(e.target.checked)} />
          Hide posts with 0 comments
        </Label>
      </Flex>

      <Flex sx={row}>
        <Label>
          <Checkbox checked={noPopupCheck} onChange={(e) => setNoPopupCheck(e.target.checked)} />
          Disable icon badge check (faster browsing)
        </Label>
      </Flex>

      <Flex sx={row}>
        <Label>
          <Checkbox checked={sidePanelDefault} onChange={(e) => setSidePanelDefault(e.target.checked)} />
          Open in side panel by default
        </Label>
      </Flex>

      <Flex sx={{ alignItems: 'center', gap: '12px', mt: '8px' }}>
        <Button
          onClick={handleSave}
          sx={{
            all: 'unset',
            cursor: 'pointer',
            p: '8px 16px',
            borderRadius: '4px',
            bg: 'primary',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: '.1s linear',
            '&:hover': { opacity: 0.85 },
          }}
        >
          Save
        </Button>
        {saved && <Text sx={{ color: 'primary', fontSize: '13px' }}>Saved!</Text>}
      </Flex>
    </Box>
  );
};

const Root: React.FC = () => (
  <ThemeProvider theme={theme}>
    <Options />
  </ThemeProvider>
);

ReactDOM.render(<Root />, document.getElementById('root'));
