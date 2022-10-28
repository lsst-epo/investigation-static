/* eslint-disable no-bitwise */
import React, { useGlobal } from 'reactn';
import { Trans } from 'gatsby-plugin-react-i18next';
import ls from 'local-storage';
import { isBrowser } from '../../../lib/utilities';

const Debug = () => {
  const getFileName = () => `debug-${new Date().getTime()}.txt`;

  const hashKeys = keys =>
    keys.reduce((hash, char) => 0 | (31 * hash + char.charCodeAt(0)), 0);

  const getDownloadLink = () => {
    if (isBrowser()) {
      const [global] = useGlobal();
      const savedState = JSON.stringify(ls(global.investigation));
      const savedStateHash = hashKeys(Object.keys(savedState));
      const state = JSON.stringify(global);
      const stateHash = hashKeys(Object.keys(state));
      const browser = navigator.userAgent;
      const location = window.location.href;
      const online = navigator.onLine;
      const date = new Date();
      const dimensions = `${window.innerWidth}px x ${window.innerHeight}px`;

      const data = new Blob(
        [
          `Location: ${location}\nDate: ${date}\nBrowser: ${browser}\nOnline: ${online}\nDimensions: ${dimensions}\n\nLocal storage: ${savedStateHash}\n${savedState}\n\nState: ${stateHash}\n${state}`,
        ],
        { type: 'text/plain' }
      );
      return window.URL.createObjectURL(data);
    }

    return '';
  };

  return (
    <>
      <h3>
        <Trans>interface::debug.title</Trans>
      </h3>
      <p>
        <Trans i18nKey="interface::debug.instructions">
          If your application is experiencing issues that cannot be solved by
          clearing saved answers,
          <a
            href={getDownloadLink()}
            download={getFileName()}
            type="text/plain"
          >
            download this debug log
          </a>
          and attach it in an email to our developers at
          <a
            href="mailto:education@lsst.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            education@lsst.org
          </a>
          .
        </Trans>
      </p>
    </>
  );
};

export default Debug;
