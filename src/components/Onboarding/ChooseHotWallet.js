import React from 'react';
import { connect } from 'react-redux';
import {
  Grid,
  Card,
  Box,
  Text,
  Button,
  Link,
  Address,
  Flex
} from '@makerdao/ui-components';

import faqs from './faqs';
import { AccountTypes } from '../../utils/constants';

import LedgerStep from './LedgerStep';
import ChooseMKRBalanceStep from './ChooseMKRBalanceStep';
import Sidebar from './Sidebar';
import H2 from './H2';
import Step from './Step';
import ButtonCard from './ButtonCard';
import WalletIcon from './WalletIcon';

import Loader from '../Loader';

import {
  useHardwareAccount,
  useMetamaskAccount,
  connectHardwareWallet,
  resetHotWallet
} from '../../reducers/onboarding';

const SelectAWalletStep = ({
  active,
  resetHotWallet,
  onMetamaskSelected,
  onTrezorSelected,
  onLedgerSelected
}) => {
  return (
    <Step active={active}>
      <Grid gridRowGap="m" alignContent="start">
        <Box textAlign="center" mt={[0, 0, 0, 'l']}>
          <Box mb="s">
            <H2>Select a voting wallet</H2>
          </Box>
          <Text t="p2">
            <p>
              Select the wallet you would like to use as your voting wallet.
              <br />
              This is a hot wallet and will only be able to vote with your MKR.
            </p>
          </Text>
        </Box>
        <ButtonCard
          icon={<WalletIcon provider="metamask" style={{ maxWidth: '30px' }} />}
          title="MetaMask"
          subtitle="Connect and unlock wallet."
          onNext={onMetamaskSelected}
        />
        <ButtonCard
          icon={<WalletIcon provider="trezor" style={{ maxWidth: '30px' }} />}
          title="Trezor"
          subtitle="Connect via USB and unlock."
          onNext={onTrezorSelected}
        />
        <ButtonCard
          icon={<WalletIcon provider="ledger" style={{ maxWidth: '30px' }} />}
          title="Ledger"
          subtitle="Open and unlock wallet."
          onNext={onLedgerSelected}
        />
      </Grid>
    </Step>
  );
};

const ConfirmWalletStep = ({
  active,
  account,
  connecting,
  onConfirm,
  onCancel
}) => {
  return (
    <Step active={active}>
      <Grid gridRowGap="m" alignContent="start">
        <Text textAlign="center">
          <H2>Confirm voting wallet</H2>
        </Text>
        <Text t="p2" textAlign="center">
          <p>
            By confirming your voting wallet, you will be selecting the hot
            wallet address below. It will only be able to vote with your MKR.
          </p>
        </Text>
        <Card p="m">
          {!account &&
            connecting && (
              <Flex justifyContent="center" alignItems="center">
                <Box style={{ opacity: '0.6' }}>
                  <Loader />
                </Box>
                <Box ml="s" color="#868997">
                  Waiting for approval to access your account
                </Box>
              </Flex>
            )}
          {!account &&
            !connecting && (
              <Flex
                justifyContent="center"
                alignItems="center"
                opacity="0.6"
                textAlign="center"
              >
                There was an error connecting your wallet. Please ensure that
                your wallet is connected and try again.
              </Flex>
            )}
          {account && (
            <Grid
              alignItems="center"
              gridTemplateColumns={['auto 1fr auto', 'auto 1fr 1fr 1fr auto']}
              gridColumnGap="s"
            >
              <Box>
                <WalletIcon
                  provider={account.accountType}
                  style={{ maxWidth: '20px' }}
                />
              </Box>
              <Box>
                <Link fontWeight="semibold">
                  <Address
                    show={active}
                    full={account && account.address}
                    shorten
                  />
                </Link>
              </Box>
              <Box gridRow={['2', '1']} gridColumn={['1/2', '3']}>
                {(account && account.mkr) || '0'} MKR
              </Box>
              <Box gridRow={['2', '1']} gridColumn={['2/4', '4']}>
                {(account && account.eth) || '0'} ETH
              </Box>
              <Box
                borderRadius="4px"
                color="#E45432"
                bg="#FFE2D9"
                fontSize="1.2rem"
                fontWeight="bold"
                px="xs"
              >
                HOT WALLET
              </Box>
            </Grid>
          )}
        </Card>
        <Grid
          gridRowGap="xs"
          gridColumnGap="s"
          gridTemplateColumns={['1fr', 'auto auto']}
          justifySelf={['stretch', 'center']}
        >
          <Button variant="secondary-outline" onClick={onCancel}>
            Change Address
          </Button>
          <Button disabled={!account} onClick={onConfirm}>
            Confirm Voting Wallet
          </Button>
        </Grid>
      </Grid>
    </Step>
  );
};

class ChooseHotWallet extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 'select',
      faqs: faqs.hotWallet,
      account: undefined
    };

    this.steps = {
      SELECT_WALLET: 'select',
      SELECT_LEDGER_WALLET: 'ledger',
      CONFIRM_WALLET: 'confirm'
    };

    this.toSelectAWallet = this.toSelectAWallet.bind(this);
    this.onMetamaskSelected = this.onMetamaskSelected.bind(this);
    this.onTrezorSelected = this.onTrezorSelected.bind(this);
    this.onLedgerSelected = this.onLedgerSelected.bind(this);
    this.onLedgerLiveSelected = this.onLedgerLiveSelected.bind(this);
    this.onLedgerLegacySelected = this.onLedgerLegacySelected.bind(this);
    this.toSelectMKRBalance = this.toSelectMKRBalance.bind(this);
    this.toConfirmWallet = this.toConfirmWallet.bind(this);
    this.onAccountSelected = this.onAccountSelected.bind(this);
  }

  toSelectAWallet() {
    this.props.resetHotWallet();
    this.setState({
      step: this.steps.SELECT_WALLET,
      faqs: faqs.hotWallet
    });
  }

  onMetamaskSelected() {
    this.props.useMetamaskAccount();
    const checkMetamaskWallet = () => {
      if (
        !this.props.hotWallet &&
        this.props.connecting &&
        this.state.step === this.steps.CONFIRM_WALLET
      ) {
        this.props.useMetamaskAccount();
        setTimeout(checkMetamaskWallet, 500);
      }
    };
    setTimeout(checkMetamaskWallet, 500);
    this.toConfirmWallet();
  }

  onTrezorSelected() {
    this.props.connectHardwareWallet(AccountTypes.TREZOR);
    this.toSelectMKRBalance();
  }

  onLedgerSelected() {
    this.setState({
      step: this.steps.SELECT_LEDGER_WALLET,
      faqs: faqs.ledger
    });
  }

  onLedgerLiveSelected() {
    this.props.connectHardwareWallet(AccountTypes.LEDGER, { live: true });
    this.toSelectMKRBalance();
  }

  onLedgerLegacySelected() {
    this.props.connectHardwareWallet(AccountTypes.LEDGER, { live: false });
    this.toSelectMKRBalance();
  }

  toSelectMKRBalance() {
    this.setState({
      step: this.steps.SELECT_MKR_BALANCE,
      faqs: faqs.selectMKRBalance
    });
  }

  onAccountSelected(account) {
    this.props.useHardwareAccount(account, 'hot');
    this.toConfirmWallet();
  }

  toConfirmWallet() {
    this.setState({
      step: this.steps.CONFIRM_WALLET,
      faqs: faqs.hotWallet
    });
  }

  render() {
    return (
      <Box maxWidth="930px" m="0 auto">
        <Grid
          gridColumnGap="xl"
          gridRowGap="m"
          gridTemplateColumns={['1fr', '1fr', 'auto 340px']}
        >
          <div>
            <SelectAWalletStep
              active={this.state.step === this.steps.SELECT_WALLET}
              onMetamaskSelected={this.onMetamaskSelected}
              onTrezorSelected={this.onTrezorSelected}
              onLedgerSelected={this.onLedgerSelected}
            />
            <LedgerStep
              active={this.state.step === this.steps.SELECT_LEDGER_WALLET}
              onLedgerLive={this.onLedgerLiveSelected}
              onLedgerLegacy={this.onLedgerLegacySelected}
              onCancel={this.toSelectAWallet}
            />
            <ChooseMKRBalanceStep
              active={this.state.step === this.steps.SELECT_MKR_BALANCE}
              accounts={this.props.availableAccounts}
              connecting={this.props.connecting}
              onAccountSelected={this.onAccountSelected}
              onCancel={this.toSelectAWallet}
            />
            <ConfirmWalletStep
              active={this.state.step === this.steps.CONFIRM_WALLET}
              account={this.props.hotWallet}
              connecting={this.props.connecting}
              onConfirm={this.props.onComplete}
              onCancel={this.toSelectAWallet}
            />
          </div>
          <Sidebar faqs={this.state.faqs} />
        </Grid>
      </Box>
    );
  }
}

export default connect(
  state => ({
    ...state.onboarding
  }),
  {
    useHardwareAccount,
    useMetamaskAccount,
    connectHardwareWallet,
    resetHotWallet
  }
)(ChooseHotWallet);
