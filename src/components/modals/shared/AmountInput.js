import React, { Component, Fragment } from 'react';
import ReactGA from 'react-ga';
import {
  InputLabels,
  ValueLabel,
  EndButton,
  GreyLink,
  Skip,
  FlexRowEnd
} from './styles';
import Input from '../../Input';
import { countDecimals, formatRound, toSlug } from '../../../utils/misc';

export default class AmountInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: ''
    };
  }

  componentDidMount() {
    ReactGA.modalview(toSlug(this.props.title || 'amount-input'));
  }

  setAmount = event => {
    this.setState({ amount: event.target.value });
  };

  setMaxAmount = () => {
    this.setState({ amount: this.props.maxAmount });
  };

  handleKeyPress = event => {
    if (event.key === 'Enter') this.submit(this.state.amount);
  };

  submit(amount) {
    const { onSubmit, maxAmount } = this.props;
    if (
      !amount ||
      isNaN(Number(amount)) ||
      Number(amount) > maxAmount ||
      Number(amount) === 0
    ) {
      window.alert('Please enter a valid amount');
    } else {
      onSubmit(amount);
    }
  }

  render() {
    const { amountLabel, maxAmount, buttonLabel, onCancel } = this.props;
    return (
      <Fragment>
        <InputLabels>
          <div>Enter MKR amount</div>
          <div>
            <ValueLabel>{amountLabel}</ValueLabel> {formatRound(maxAmount, 6)}
            {countDecimals(maxAmount) > 5 ? '...' : ''} MKR
          </div>
        </InputLabels>
        <Input
          type="text"
          onKeyPress={this.handleKeyPress}
          value={this.state.amount}
          onChange={this.setAmount}
          placeholder="00.0000 MKR"
          button={<GreyLink onClick={this.setMaxAmount}>Set max</GreyLink>}
        />
        <FlexRowEnd>
          <Skip mr={24} mt={24} onClick={onCancel}>
            Skip this step
          </Skip>
          <EndButton onClick={() => this.submit(this.state.amount)}>
            {buttonLabel}
          </EndButton>
        </FlexRowEnd>
      </Fragment>
    );
  }
}
