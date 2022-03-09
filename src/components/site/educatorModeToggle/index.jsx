import React from 'reactn';
import PropTypes from 'prop-types';
import { Trans, withTranslation } from 'gatsby-plugin-react-i18next';
import classnames from 'classnames';
import { SelectionControl, TextField } from 'react-md';

const EDUCATOR_PASSPHRASE = '3ducatorMod3';

class EducatorModeToggle extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      passphraseInput: null,
      passphraseError: false,
    };
  }

  handleEducatorModeChange = value => {
    const { passphraseInput } = this.state;

    if (value && passphraseInput === EDUCATOR_PASSPHRASE) {
      this.setState({ passphraseError: false });
      this.dispatch.setEducatorMode(true);
    }

    if (value && passphraseInput !== EDUCATOR_PASSPHRASE) {
      this.setState({ passphraseError: true });
      this.dispatch.setEducatorMode(false);
    }

    if (!value) {
      this.dispatch.setEducatorMode(false);
    }
  };

  handlePassphraseChange = value => {
    this.setState({ passphraseInput: value });
  };

  render = () => {
    const { t } = this.props;
    const { educatorMode } = this.global;
    const { passphraseError, passphraseInput } = this.state;

    return (
      <div className="educator-toggle-container">
        <TextField
          id="educatorModePassphrase"
          name="educatorModePassphrase"
          className={classnames('educator-passphrase-input', {
            expanded: !educatorMode,
          })}
          error={passphraseError}
          errorText={<Trans>interface::errors.passphrase.mismatch</Trans>}
          fullWidth={false}
          onChange={this.handlePassphraseChange}
          defaultValue={passphraseInput}
          placeholder={t('interface::formfields.passphrase.placeholder')}
        />
        <SelectionControl
          defaultChecked={false}
          id="educatorModeToggle"
          name="educatorModeToggle"
          type="switch"
          label={<Trans>interface::educator_mode.title</Trans>}
          checked={educatorMode}
          onChange={this.handleEducatorModeChange}
        />
      </div>
    );
  };
}

EducatorModeToggle.propTypes = {
  t: PropTypes.func,
};

export default withTranslation()(EducatorModeToggle);
