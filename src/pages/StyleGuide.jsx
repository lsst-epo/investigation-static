import React from 'react';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardBody from 'react-md/lib/Cards/CardText';
import Button from 'react-md/lib/Buttons/Button';
import TextField from 'react-md/lib/TextFields/TextField';
import DataTable from 'react-md/lib/DataTables/DataTable';
import TableHeader from 'react-md/lib/DataTables/TableHeader';
import TableBody from 'react-md/lib/DataTables/TableBody';
import TableRow from 'react-md/lib/DataTables/TableRow';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import ExpansionList from 'react-md/lib/ExpansionPanels/ExpansionList';
import ExpansionPanel from 'react-md/lib/ExpansionPanels/ExpansionPanel';
import DialogContainer from 'react-md/lib/Dialogs/DialogContainer';
import Select from '../components/site/forms/select';
import CaretDown from '../components/site/icons/CaretDown';
import Link from '../components/site/link';
import '../components/site/forms/table/table.module.scss';

class StyleGuide extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showDialog: false,
    };
  }

  handleInput = e => {
    const { value, name } = e.target;

    this.setState(
      prevState => ({
        ...prevState,
        [name]: value,
      }),
      () => console.log(this.state) // eslint-disable-line no-console
    );
  };

  handleDialogClick = () => {
    this.setState(
      prevState => ({
        ...prevState,
        showDialog: !prevState.showDialog,
      }),
      () => console.log(this.state) // eslint-disable-line no-console
    );
  };

  handleDialogHide = () => {
    this.setState(
      prevState => ({
        ...prevState,
        showDialog: false,
      }),
      () => console.log(this.state) // eslint-disable-line no-console
    );
  };

  render() {
    const selectName = 'example-select';
    const selectValue = this.state[selectName]; // eslint-disable-line react/destructuring-assignment
    const dialogVisible = this.state.showDialog; // eslint-disable-line react/destructuring-assignment
    const swatchStyles = { width: '15vw', height: '15vw', marginTop: '20px' };
    const selectItems = [
      {
        label: 'Apples',
        value: 'A',
      },
      {
        label: 'Bananas',
        value: 'B',
      },
      {
        label: 'Cherries',
        value: 'C',
      },
      {
        label: 'Durian',
        value: 'D',
      },
      {
        label: 'Elderberry',
        value: 'E',
      },
    ];

    return (
      <div>
        <Card>
          <CardTitle title="Colors" />
          <CardBody className="container-flex wrap spaced">
            <Card style={swatchStyles} className="background-white">
              <CardTitle title="Photon White" />
            </Card>
            <Card style={swatchStyles} className="background-black">
              <CardTitle title="Dusk Gray" />
            </Card>
            <Card style={swatchStyles} className="background-neutral-10">
              <CardTitle title="Neutral 10" />
            </Card>
            <Card style={swatchStyles} className="background-neutral-20">
              <CardTitle title="Neutral 20" />
            </Card>
            <Card style={swatchStyles} className="background-neutral-30">
              <CardTitle title="Neutral 30" />
            </Card>
            <Card style={swatchStyles} className="background-neutral-40">
              <CardTitle title="Neutral 40" />
            </Card>
            <Card style={swatchStyles} className="background-primary">
              <CardTitle title="Primary" />
            </Card>
            <Card style={swatchStyles} className="background-secondary-light">
              <CardTitle title="Secondary Light" />
            </Card>
            <Card style={swatchStyles} className="background-secondary">
              <CardTitle title="Secondary" />
            </Card>
            <Card style={swatchStyles} className="background-secondary-dark">
              <CardTitle title="Secondary Dark" />
            </Card>
            <Card style={swatchStyles} className="background-error">
              <CardTitle title="Error" />
            </Card>
          </CardBody>
        </Card>
        <br />
        <Card className="md-block-centered">
          <CardTitle title="Typography" />
          <CardBody>
            <h1 className="heading-primary">Heading Primary</h1>
            <br />
            <h2 className="heading-secondary">Heading Secondary</h2>
            <br />
            <h3 className="subheading-primary">Subheading Primary</h3>
            <br />
            <div className="copy-secondary">Copy Primary</div>
            <br />
            <p className="copy-primary">Copy Primary</p>
            <br />
            <div className="label-primary">Label Primary</div>
          </CardBody>
        </Card>
        <br />
        <Card className="md-block-centered">
          <CardTitle title="Buttons" />
          <CardBody>
            <div className="container-flex wrap">
              <Button flat primary swapTheming>
                Primary
              </Button>
              <Button flat primary swapTheming disabled>
                Disabled Primary
              </Button>
            </div>
            <div className="container-flex wrap">
              <Button flat secondary swapTheming>
                Secondary
              </Button>
              <Button flat secondary swapTheming disabled>
                Disabled Secondary
              </Button>
            </div>
            <div className="container-flex wrap">
              <Button flat primary className="outlined">
                Primary Outlined
              </Button>
              <Button flat primary className="outlined" disabled>
                Primary Outlined
              </Button>
            </div>
            <div className="container-flex wrap">
              <Button flat secondary className="outlined">
                Secondary Outlined
              </Button>
              <Button flat secondary className="outlined" disabled>
                Disabled Secondary Outlined
              </Button>
            </div>
            <div className="container-flex wrap">
              <Button flat secondary swapTheming to="#" component={Link}>
                Button as Link
              </Button>
            </div>
          </CardBody>
        </Card>
        <br />
        <Card className="md-block-centered">
          <CardTitle title="Form Elements" />
          <CardBody>
            <div>
              {/* eslint-disable react/jsx-handler-names */}
              <Select
                options={selectItems}
                label="Example Select"
                name={selectName}
                value={selectValue}
                placeholder="Select"
                handleChange={this.handleInput}
              />
              {/* eslint-enable react/jsx-handler-names */}
            </div>
            <br />
            <div>
              <TextField
                id="block-text-input-1"
                type="text"
                label="Block Text Field"
                lineDirection="center"
                placeholder="Type Text Here"
              />
            </div>
            <br />
            <div>
              <span style={{ marginRight: '20px' }} className="inline">
                An Inline Text element with a right margin next to a text input
                wrapped in an inline-block element
              </span>
              <span>
                <TextField
                  id="inline-text-input-1"
                  type="text"
                  style={{ maxWidth: '200px' }}
                  className="inline-block"
                  label="Block Text Field"
                  lineDirection="center"
                  placeholder="Type Text Here"
                />
              </span>
              <span style={{ marginLeft: '20px' }} className="inline">
                Another Inlnine Text element with a left margin next to a text
                input wrapped in an inline-block element
              </span>
            </div>
            <div style={{ maxWidth: '50%' }}>
              <TextField
                id="textarea-1"
                type="text"
                label="Text Area"
                lineDirection="center"
                placeholder="Type Multiple Lines here, Type Multiple Lines here, Type Multiple Lines here"
                rows={3}
                maxRows={8}
              />
            </div>
          </CardBody>
        </Card>
        <br />
        <Card className="md-block-centered">
          <CardTitle title="Tables" />
          <CardBody>
            <p>Responsive table whose width reflects its contents</p>
            <DataTable plain fullWidth={false}>
              <TableHeader>
                <TableRow>
                  <TableColumn />
                  <TableColumn>Col 1 Title</TableColumn>
                  <TableColumn>Col 2 Title</TableColumn>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* eslint-disable react/no-array-index-key */}
                {Array.from(Array(10)).map((_, i) => (
                  <TableRow key={`row-1-${i}`}>
                    <TableColumn className="row-title">{`Row ${i}`}</TableColumn>
                    <TableColumn>Column 1 content</TableColumn>
                    <TableColumn>Column 2 content</TableColumn>
                  </TableRow>
                ))}
                {/* eslint-enable react/no-array-index-key */}
              </TableBody>
            </DataTable>
            <br />
            <br />
            <p>Responsive full width table</p>
            <DataTable plain>
              <TableHeader>
                <TableRow>
                  <TableColumn />
                  <TableColumn>Col 1 Title</TableColumn>
                  <TableColumn>Col 2 Title</TableColumn>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* eslint-disable react/no-array-index-key */}
                {Array.from(Array(10)).map((_, i) => (
                  <TableRow key={`row-2-${i}`}>
                    <TableColumn className="row-title">{`Row ${i}`}</TableColumn>
                    <TableColumn>Column 1 content</TableColumn>
                    <TableColumn>Column 2 content</TableColumn>
                  </TableRow>
                ))}
                {/* eslint-enable react/no-array-index-key */}
              </TableBody>
            </DataTable>
          </CardBody>
        </Card>
        <br />
        <Card className="md-block-centered">
          <CardTitle title="Accordions" />
          <CardBody>
            <ExpansionList>
              <ExpansionPanel
                label="Learn more... (card style)"
                footer={null}
                expanderIcon={<CaretDown />}
              >
                <p>...about all sorts of things!</p>
                <p>...about all sorts of things!</p>
                <p>...about all sorts of things!</p>
                <p>...about all sorts of things!</p>
                <p>...about all sorts of things!</p>
                <p>...about all sorts of things!</p>
                <p>...about all sorts of things!</p>
              </ExpansionPanel>
            </ExpansionList>
            <br />
            <ExpansionList className="unstyled">
              <ExpansionPanel
                label="Learn more... (unstyled)"
                footer={null}
                expanderIcon={<CaretDown />}
                className="unstyled"
              >
                <p>...about all sorts of things!</p>
                <p>...about all sorts of things!</p>
                <p>...about all sorts of things!</p>
                <p>...about all sorts of things!</p>
                <p>...about all sorts of things!</p>
                <p>...about all sorts of things!</p>
                <p>...about all sorts of things!</p>
              </ExpansionPanel>
            </ExpansionList>
          </CardBody>
        </Card>
        <br />
        <Card className="md-block-centered">
          <CardTitle title="Dialogs" />
          <CardBody>
            <Button flat secondary swapTheming onClick={this.handleDialogClick}>
              Open Dialog
            </Button>
            <DialogContainer
              id="dialog-example-1"
              visible={dialogVisible}
              title="Dialog Contents"
              initialFocus=".initial-focus"
              onHide={this.handleDialogHide}
            >
              <p className="initial-focus">
                This is the contents of the dialog
              </p>
              <p>This is the contents of the dialog</p>
              <p>This is the contents of the dialog</p>
              <p>This is the contents of the dialog</p>
            </DialogContainer>
            <br />
            <br />
            <button
              type="button"
              className="fake-link"
              onClick={this.handleDialogClick}
            >
              Link styled dialog opener
            </button>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default StyleGuide;
