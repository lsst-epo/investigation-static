import PropTypes from 'prop-types';
import React from 'reactn';
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
          errorText="Incorrect passphrase"
          fullWidth={false}
          onChange={this.handlePassphraseChange}
          defaultValue={passphraseInput}
          placeholder="Passphrase"
        />
        <SelectionControl
          defaultChecked={false}
          id="educatorModeToggle"
          name="educatorModeToggle"
          type="switch"
          label="Educator mode"
          checked={educatorMode}
          onChange={this.handleEducatorModeChange}
        />
      </div>
    );
  };
}

export default EducatorModeToggle;
