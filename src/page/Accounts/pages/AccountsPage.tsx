import React, { Fragment, useEffect } from "react";
import { Typography, Box } from "@mui/joy";
import { toast } from 'react-toastify';
import { Main, PageTitle } from "../../../components";

const AccountsPage = () => {

    // useEffect(() => {
    //     toast.success('Welcome')
    // },[])
    return (
            <Box>
                <PageTitle title={'Account'} />

                <Typography>
                    All accounts details will be shown here
                </Typography>
            </Box>





    )
}

export default AccountsPage