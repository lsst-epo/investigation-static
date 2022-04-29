/* eslint-disable no-bitwise */
import React from 'reactn';
import { Trans } from 'gatsby-plugin-react-i18next';
import ls from 'local-storage';

class Debug extends React.PureComponent {
  getDownloadLink = () => {
    const savedState = JSON.stringify(ls(this.global.investigation));
    const savedStateHash = this.hashKeys(Object.keys(savedState));
    const state = JSON.stringify(this.global);
    const stateHash = this.hashKeys(Object.keys(state));
    const browser = navigator.userAgent;
    const location = window.location.href;
    const online = navigator.onLine;
    const date = new Date();
    const dimensions = `${window.innerWidth}px x ${window.innerHeight}px`;

    const data = new Blob(
      [
        `Location: ${location}\nDate: ${date}\nBrowser: ${browser}\nOnline: ${online}\nDimensions: ${dimensions}\n\nLocal storage - ${savedStateHash}\n${savedState}\n\nState - ${stateHash}\n${state}`,
      ],
      { type: 'text/plain' }
    );
    return window.URL.createObjectURL(data);
  };

  getFileName = () => `debug-${new Date().getTime()}.txt`;

  hashKeys = keys =>
    keys.reduce((hash, char) => 0 | (31 * hash + char.charCodeAt(0)), 0);

  render = () => (
    <a
      href={this.getDownloadLink()}
      download={this.getFileName()}
      type="text/plain"
    >
      <Trans>interface::actions.debug</Trans>
    </a>
  );
}

export default Debug;
