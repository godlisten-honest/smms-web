import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from "react-redux";
import {
    userLoginRequest, userLoginReset,

    ambassadorOTPRequest, ambassadorOTPReset
} from "../../../store/actions"

import { CssVarsProvider } from '@mui/joy/styles';
import GlobalStyles from '@mui/joy/GlobalStyles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel, { formLabelClasses } from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import theme from '../../../utils/theme';
import { Avatar, Card, CircularProgress, DialogContent, DialogTitle, Modal, ModalClose, ModalDialog } from '@mui/joy';

import { useNavigate } from 'react-router-dom';


import image from '../../../constant/image';
import { NAVIGATE_TO_DASHBOARD } from '../../../route/types';
import { toast } from 'react-toastify';
import { STATUS } from '../../../constant';
import { LoadingView } from '../../../components';
import axios from 'axios';
import LanguageMenu from '../../../components/molecules/LanguageMenu';
import { ColorSchemeToggle } from '../../../utils';
import { useTranslation } from 'react-i18next';

interface FormElements extends HTMLFormControlsCollection {
    email: HTMLInputElement;
    // usermail: HTMLInputElement;
    password: HTMLInputElement;
    // persistent: HTMLInputElement;
}
interface SignInFormElement extends HTMLFormElement {
    readonly elements: FormElements;
}

const LoginPage = ({
    // ambLoginStatus,
    // ambLoginResult,
    // ambLoginErrorMessage,

    // ambOtpStatus,
    // ambOtpResult,
    // ambOtpErrorMessage,
}) => {

    const navigate = useNavigate();
    const dispatch = useDispatch()
    const { t } = useTranslation();

    const [refresh, setRefresh] = useState(false)

    const [OTPModal, setOTPModal] = useState(false);
    const [loadOTP, setLoadOTP] = useState(false);
    const [OTP, setOTP] = useState('')
    const [username, setUsername] = useState('')



    // FUNCTION TO VERIFY OTP FROM  BACKEND
    const verifyOTP = (event) => {
        event.preventDefault();
        if (OTP) {
            setLoadOTP(true)
            dispatch(ambassadorOTPRequest(username, OTP))

        } else {
            toast.error('Please enter OTP to verify')
        }

    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const formElements = event.currentTarget.elements;
        const data = {
            email: formElements.email.value,
            password: formElements.password.value,
        };
        console.log(data)
        if (data.email != "" && data.password != "") {
            // navigate(NAVIGATE_TO_DASHBOARD)
            fetchLogin(data)
            setUsername(data.email)

        } else {
            toast.error(t("login.emptyErr"));
        }
    }

    const fetchLogin = async (data) => {

        const onSuccess = (response) => {
            console.debug('Request Successful!', response.data);
            navigate(NAVIGATE_TO_DASHBOARD, {
                state: {
                    name: response.data.user.first_name
                }
            })
            return response;
        };

        const onError = (error) => {
            console.log('Request Failed:', error.config);
            console.debug(error);
            if (error.response) {
                console.log('Status:', error.response.status);
                console.log('Data:', error.response.data);
                console.log('Headers:', error.response.headers);

                toast.error(error.response.data.message);

                return error.response

            } else {
                console.log('Error Message:', error.message);

                return error.message
            }
        };

        return axios({
            url: 'http://127.0.0.1:8000//login/',
            method: "POST",
            timeout: 10000,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            data: {
                'username': data.email,
                'password': data.password,
            }
        })
            .then(onSuccess).catch(onError);
    };

    return (
        <CssVarsProvider defaultMode="light" disableTransitionOnChange theme={theme}>
            <CssBaseline />
            <GlobalStyles
                styles={{
                    ':root': {
                        '--Collapsed-breakpoint': '769px', // form will stretch when viewport is below `769px`
                        '--Cover-width': '50vw', // must be `vw` only
                        '--Form-maxWidth': '600px',
                        '--Transition-duration': '0.4s', // set to `none` to disable transition
                    },
                }}
            />

            {/* loading  */}
            {/* <LoadingView loading={checkLoading()} /> */}

            <Box
                sx={styles.container}
            >
                <Box
                    sx={styles.subcontainer}
                >
                    <Box
                        component="header"
                        sx={{
                            py: 4,
                            gap: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            // flexDirection: 'column',
                        }}
                    >
                        <Box sx={{
                            display: 'flex',
                            gap: 1,
                            alignItems: 'center'
                        }}
                        >
                            <Avatar
                                src={image.Images.logo}
                                size='sm'
                                sx={{
                                    maxWidth: 90, maxHeight: 90,
                                }}
                            />
                            <Typography level='title-lg' sx={{ fontFamily: 'roboto' }}>{t("intro.appName")}</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <LanguageMenu change={() => setRefresh(!refresh)} />
                            <ColorSchemeToggle />
                        </Box>
                    </Box>
                    <Card
                        component="main"
                        sx={styles.card}>

                        <Box
                            sx={{
                                // py: 4,
                                width: 500,
                                maxWidth: '100%',
                                px: 2,
                                gap: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                alignSelf: 'center'
                            }}
                        >
                            <Typography textAlign='center' level='h3' sx={styles.title}>
                                {t("intro.title")}
                            </Typography>
                            <Typography textAlign='center' level='body-md' sx={styles.title}>
                                {t("intro.desc")}
                            </Typography>

                        </Box>
                        <Box
                            sx={styles.form}
                        >
                            <Stack sx={{ mb: 2 }}>
                                <Typography textAlign='center' level="h3">{t("login.title")}</Typography>
                            </Stack>


                            <Stack component='form' onSubmit={handleSubmit} gap={4} sx={{ mt: 2 }} noValidate>
                                <FormControl required>
                                    <FormLabel>{t("login.username")}</FormLabel>
                                    <Input type="text" name="email" placeholder={t("login.usernamePlaceholder")} sx={styles.input} />
                                </FormControl>
                                <FormControl required>
                                    <FormLabel>{t("login.password")}</FormLabel>
                                    <Input type="password" name="password" placeholder={t("login.passwordPlaceholder")} sx={styles.input} />
                                </FormControl>
                                <Stack gap={4} sx={{ mt: 2 }}>
                                    <Button type="submit" fullWidth sx={styles.button}>
                                        {t("login.loginButton")}
                                    </Button>
                                </Stack>
                            </Stack>
                        </Box>
                    </Card>

                    <Box component="footer" sx={{ py: 3 }}>
                        <Typography level="body-xs" textAlign="center">
                            © {t("intro.owner")} {new Date().getFullYear()}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* OTP MODAL */}
            <Modal open={OTPModal} >
                <ModalDialog
                    aria-labelledby="nested-modal-title"
                    aria-describedby="nested-modal-description"
                    sx={(theme) => ({
                        [theme.breakpoints.only('xs')]: {  // ----------------> FOR MOBILE
                            top: 'unset',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            // borderRadius: 0,
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            transform: 'none',
                            maxWidth: 'unset',
                        },
                    })}>
                    <ModalClose variant="outlined" component="button" onClick={() => setOTPModal(false)} />
                    <DialogTitle>OTP Verification</DialogTitle>
                    <DialogContent>Please enter OTP that has been sent to your email.</DialogContent>
                    <form
                        onSubmit={verifyOTP}
                    >
                        <FormControl sx={{ pb: 1 }}>
                            {/* <FormLabel></FormLabel> */}
                            <Input
                                autoFocus
                                type="password"
                                required
                                value={OTP}
                                defaultValue={OTP}
                                placeholder='Insert OTP here'
                                onChange={(event) => setOTP(event.target.value)}
                            />
                        </FormControl>

                        <Button
                            startDecorator={loadOTP && <CircularProgress />}
                            type="submit"
                            fullWidth>
                            {loadOTP ? "LOADING..." : "CONFIRM"}
                        </Button>
                    </form>
                </ModalDialog>
            </Modal>

        </CssVarsProvider>
    );
}

// Stylish
const styles = {
    container: (theme) => ({
        //   width: '90%',
        transition: 'width var(--Transition-duration)',
        transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage:
            `url(${image.Images.backgroung})`,
        [theme.getColorSchemeSelector('dark')]: {
            backgroundImage:
                `url(${image.Images.backgroung2})`,
        },
    }),
    subcontainer: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100dvh',
        justifyContent: 'space-between',
        // width:
        //   'clamp(var(--Form-maxWidth), (var(--Collapsed-breakpoint) - 100vw) * 999, 100%)',
        maxWidth: '100%',
        px: 2,
        m: 2
    },
    card: {
        background: 'linear-gradient(297deg, rgba(255,165,0,1) 0%, rgba(226,124,0,1) 70%, rgba(215,152,152,1) 100%)',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        width: '100%',
        boxShadow: 'md',
        borderRadius: 0,
    },
    form: {
        my: 'auto',
        py: 2,
        pb: 5,
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: 400,
        maxWidth: '100%',
        mx: 'auto',
        backgroundColor: 'background.surface',
        borderRadius: 'sm',
        '& form': {
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
        },
        [`& .${formLabelClasses.asterisk}`]: {
            visibility: 'hidden',
        },
    },
    input: {
        height: 45,

    },
    button: {
        height: 45,
        backgroundColor: 'text.primary',
        color: 'background.surface',
        fontWeight: 'bold',
        '&:hover':
        {
            backgroundColor: 'grey'
        }
    },
    title: {
        color: 'white',
        fontFamily: 'roboto'
    }

}

const mapStateToProps = ({ authAmb }) => {
    const {
        userLoginStatus: ambLoginStatus,
        userLoginResult: ambLoginResult,
        userLoginErrorMessage: ambLoginErrorMessage,

        otpStatus: ambOtpStatus,
        otpResult: ambOtpResult,
        otpErrorMessage: ambOtpErrorMessage
    } = authAmb


    return {
        ambLoginStatus,
        ambLoginResult,
        ambLoginErrorMessage,

        ambOtpStatus,
        ambOtpResult,
        ambOtpErrorMessage,
    }
}

export default LoginPage
// export default connect(mapStateToProps, {})(LoginPage)