import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Web3 from "web3";
import { useWeb3React } from '@web3-react/core';

import {
    Box, Button, Divider, Grid, IconButton, InputBase,
    Paper, styled, TextField
} from '@mui/material';
import Modal from "@mui/material/Modal";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    bgcolor: "background.paper",
    border: "1px solid black",
    boxShadow: 24,
    p: 4,
    borderRadius: "10px",
};

import { OperatorAddress } from 'mainConfig';
import {
    useOperatorContract,
} from "hooks/useContractHelpers";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function AirdropWallet() {
    const { account } = useWeb3React();
    const OperatorContract = useOperatorContract();
    const { walletID } = useParams();
    const [creditBalance, setCreditBalance] = useState(0);

    // Set Operator address modal
    const [operatorAddressOpen, setOperatorAddressOpen] = useState(false);

    const getCreditBalance = async () => {
        // Get the ERC20 token balance.
        OperatorContract.methods.balanceOf(walletID).call()
            .then(creditBalance => {
                setCreditBalance(Web3.utils.fromWei(`${creditBalance}`));
            })
            .catch(err => console.log(err));
    };

    useEffect(() => {
        getCreditBalance();
    }, []);

    return (
        <>
            <Grid>
                <Grid item xs={12}>
                    <Box component={'h3'}>Airdrop wallet address</Box>
                </Grid>
                <Grid item xs={12}>
                    <Item>
                        <div style={{ flex: '1' }}>
                            {walletID}
                        </div>
                    </Item>
                </Grid>
                <Grid item xs={12}>
                    <Box component={'h3'}>Credit $HBT balance</Box>
                </Grid>
                <Grid item xs={12}>
                    <Item>
                        <div style={{ flex: '1' }}>
                            {creditBalance}
                        </div>
                    </Item>
                </Grid>
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Button variant="contained" color="secondary" style={{ marginTop: '20px' }}>
                        Purchase Credit by credit card.
                    </Button>
                    <Button onClick={() => setOperatorAddressOpen(true)} variant="contained" color="primary" style={{ marginTop: '20px' }}>
                        Deposit $HBT
                    </Button>
                    <Button variant="contained" color="primary" style={{ marginTop: '20px' }} disabled>
                        Deposit ETH
                    </Button>
                </Box>
            </Grid>
            <Modal
                open={operatorAddressOpen}
                onClose={() => setOperatorAddressOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                size="small"
            >
                <Box sx={style}>
                    <Grid container spacing={3}>
                        <Grid item md={12}>
                            <Box component={'h3'}>Please send your $HBT to the Operator smart contract address below.</Box>
                            <Grid item md={12} sx={{ display: 'flex' }}>
                                <Grid item md={12}>
                                    <Item>
                                        <div style={{ flex: '1' }}>
                                            {OperatorAddress}
                                        </div>
                                    </Item>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </>
    );
}