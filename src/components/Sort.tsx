/** Sort — comment sort order selector. Reconstructed from `_n` in bundle. */
import React from 'react';
import { Box, Select } from 'theme-ui';

interface Props {
  sortType: string;
  setSortType: (v: string) => void;
}

const Sort: React.FC<Props> = ({ sortType, setSortType }) => (
  <Box sx={{ mt: '14px' }}>
    <Select value={sortType} onChange={(e) => setSortType(e.target.value)}>
      <option value="best">Best</option>
      <option value="top">Top</option>
      <option value="new">New</option>
      <option value="old">Old</option>
      <option value="controversial">Controversial</option>
    </Select>
  </Box>
);

export default Sort;
