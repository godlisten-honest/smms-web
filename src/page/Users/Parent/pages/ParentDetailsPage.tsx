import React, { useEffect, useState } from "react";
import { Typography, Box, Divider, Button, Sheet, Modal, ModalDialog, ModalClose, DialogTitle, DialogContent, Stack, FormControl, FormLabel, Input, Select, Option, Avatar, Autocomplete } from "@mui/joy";
import { toast } from 'react-toastify';
import { LoadingView, NotFoundMessage } from "../../../../components";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE, FILE_BASE, STATUS } from "../../../../constant";
import { connect, useDispatch } from "react-redux";
import {
    editUserRequest,
    editUserReset,
    parentDetailsRequest,
} from '../../../../store/actions'
import { EditOutlined, RemoveRedEyeOutlined } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { NAVIGATE_TO_STUDENTDETAILSPAGE } from "../../../../route/types";

function CreateItems(
    title: String,
    value: String
) {
    return { title, value }
}

const ParentDetailsPage = ({
    accessToken,
    editStatus,
    editResult,
    editErrorMessage,
    detailsStatus,
    detailsErrorMessage,
    detailsResult


}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { t } = useTranslation();

    const { state } = useLocation();
    const { id } = state

    const initiateParentData = {
        parent_id: id,
        first_name: "",
        middle_name: "",
        last_name: "",
        parent_type: "",
        gender: "",
        email: "",
        username: "",
        mobile: "",
        student_ids: null
    }


    const [formModal, setFormModal] = useState(false);

    const [parentData, setParentData] = useState(initiateParentData);
    const [studentList, setStudentList] = useState([]);

    // function to fetch student data to fetch student data
    /* eslint-disable */
    useEffect(() => {
        axios.get(API_BASE + "/list/students", {
            timeout: 30000,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + accessToken,

            }
        }).then((res) => setStudentList(res.data.results)).catch((e) => console.error(e))
    }, [accessToken])

    useEffect(() => {
        if (detailsStatus === STATUS.SUCCESS) {
            setParentData({
                parent_id: detailsResult.id,
                first_name: detailsResult.first_name,
                middle_name: detailsResult.middle_name,
                last_name: detailsResult.last_name,
                parent_type: detailsResult.parent_type,
                gender: detailsResult.gender,
                email: detailsResult.email,
                username: detailsResult.username,
                mobile: detailsResult.mobile_number,
                student_ids: detailsResult.students,
            });
        }
        else if (detailsStatus === STATUS.ERROR) {
            // dispatch(parentDetailsReset());
            toast.error(detailsErrorMessage)
        }

        if (editStatus === STATUS.SUCCESS) {
            toast.success(editResult.message);
            setFormModal(false);
            dispatch(parentDetailsRequest(accessToken, { "parent_id": parentData.parent_id }))
            dispatch(editUserReset())
        }
        else if (editStatus === STATUS.ERROR) {
            toast.error(editErrorMessage);
            dispatch(editUserReset())
        }
    }, [detailsStatus, editStatus])


    useEffect(() => {
        if (parentData.parent_id != "") {
            dispatch(parentDetailsRequest(accessToken, { "parent_id": parentData.parent_id }))
        }
    }, [])
    /* eslint-enable */


    // Handle text, select, and RFID input changes
    const handleChange = (e) => {
        if (!e || !e.target) return;
        const { name, value } = e.target;
        setParentData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // ---- Submit function
    const handleSubmit = (event) => {
        event.preventDefault()
        if (parentData.first_name) {
            const formData = new FormData();

            // Append non-file data
            formData.append("user_id", parentData.parent_id);
            formData.append("first_name", parentData.first_name);
            formData.append("middle_name", parentData.middle_name);
            formData.append("last_name", parentData.last_name);
            formData.append("parent_type", parentData.parent_type);
            formData.append("gender", parentData.gender);
            formData.append("email", parentData.email);
            formData.append("username", parentData.username);
            formData.append("mobile_number", parentData.mobile);
            formData.append("role", "parent");

            parentData.student_ids.forEach(value => formData.append('student_ids', value.id));


            dispatch(editUserRequest(accessToken, formData))
        } else {
            toast.error(t("init.emptyErr"))
        }
    }


    const checkLoading = () => {
        if (detailsStatus === STATUS.LOADING || editStatus === STATUS.LOADING) {
            return true
        } else {
            return false
        }
    }

    const rows = [
        CreateItems(t("parent.type"), {
            'mother': t("parent.mother"),
            'father': t("parent.father"),
            'guardian': t("parent.guardian")
        }[parentData.parent_type]),
        CreateItems(t("parent.username"), parentData.username),
        CreateItems(t("parent.gender"), { 'M': t("parent.male"), 'F': t("parent.female") }[parentData.gender]),
        CreateItems(t("parent.email"), parentData.email),
        CreateItems(t("parent.mobile"), parentData.mobile),
    ]

    const studentDetails = (item) => [
        CreateItems(t("parent.gender"), { 'M': t("parent.male"), 'F': t("parent.female") }[item.gender]),
        CreateItems(t("parent.schoolName"), item.school && item.school.name),
        CreateItems(t("parent.classRoom"), item.class_room),
    ]


    return (
        <Box>
            {/* <PageTitle title={t("parent.details") + " - " + parentData.first_name + " " + parentData.last_name} /> */}

            <LoadingView loading={checkLoading()} />

            {/* Contents */}
            {parentData.first_name ?
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    // alignItems: 'flex-start',
                    maxWidth: "1200px",
                    gap: 4
                }}>
                    {/* Details */}
                    <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                        {/* parent details */}
                        <Sheet
                            variant="outlined"

                            sx={{
                                display: 'flex',
                                width: { xs: '100%', md: '600px' },
                                flexDirection: { xs: 'column', md: 'row' },
                                alignItems: 'center',
                                backgroundColor: 'background.body',
                                p: 2,
                                gap: { xs: 1, md: 3 },
                                borderRadius: 6
                            }}>
                            <Avatar sx={{ height: 160, width: 140, borderRadius: 6 }} />
                            <Divider orientation="horizontal" />
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6, width: '100%' }}>
                                <Typography level="h3">{parentData.first_name + " " + parentData.middle_name + " " + parentData.last_name}</Typography>
                                <Divider />
                                {rows.map((item, index) => (
                                    <Typography key={index} level="body-sm"><b>{item.title}:</b> {item.value}</Typography>
                                ))}
                                <Divider />
                                <Button
                                    size="sm"
                                    color="success"
                                    variant="outlined"
                                    // sx={{ alignSelf: 'flex-end' }}
                                    startDecorator={<EditOutlined />}
                                    onClick={() => setFormModal(true)}>
                                    {t("parent.edit")}
                                </Button>
                            </Box>
                        </Sheet>


                        {/* Parent*/}
                        {parentData.student_ids.length > 0 &&
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: {xs: 'column', md: 'row'},
                                    p: 2,
                                    gap: 1,
                                    borderRadius: 6
                                }}>
                                <Typography level="title-md">{t("parent.student")}</Typography>

                                <Divider />
                                {parentData.student_ids.map((item, index) => (
                                    <Sheet
                                        variant="outlined"
                                        key={index}
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            width: { xs: '100%', md: '200px' },
                                            backgroundColor: 'background.body',
                                            p: 2,
                                            gap: 1,
                                            borderRadius: 6
                                        }}>
                                        <Avatar
                                            src={FILE_BASE + item.profile_picture}
                                            sx={{ height: 80, width: 80, borderRadius: 100 }} />

                                        <Typography level="title-md">{item.first_name + " " + item.last_name}</Typography>
                                        {studentDetails(item).map((dt, id) => (
                                            <Typography key={id} level="body-sm"><b>{dt.title}:</b> {dt.value}</Typography>
                                        ))}
                                        <Button
                                            size="sm"
                                            variant="outlined"
                                            color="neutral"
                                            startDecorator={<RemoveRedEyeOutlined />}
                                            onClick={() => navigate(NAVIGATE_TO_STUDENTDETAILSPAGE, { state: { id: item.id } })}
                                        >{t("student.view")}</Button>
                                        <Divider />

                                    </Sheet>
                                ))}

                            </Box>}
                    </Box>
                </Box>
                :
                <NotFoundMessage />}

            {/* ------ Modal form for add user details ------ */}
            <Modal open={formModal} >
                <ModalDialog
                    aria-labelledby="nested-modal-title"
                    aria-describedby="nested-modal-description"
                    sx={(theme) => ({
                        [theme.breakpoints.only('xs')]: {
                            top: '60px',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            // borderRadius: 0,
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            transform: 'none',
                            maxWidth: 'unset',
                            overflow: 'auto'
                        },
                    })}>
                    <ModalClose variant="outlined" onClick={() => setFormModal(false)} />
                    <DialogTitle>{t("parent.add")}</DialogTitle>
                    <DialogContent>{t("init.enterDetails")}</DialogContent>
                    <Stack component='form' onSubmit={handleSubmit} gap={2} sx={{ mt: 2 }}>

                        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
                            {/* first name */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("parent.firstName")}</FormLabel>
                                <Input type="text" name="first_name" value={parentData.first_name} onChange={handleChange} placeholder={t("init.placeholder") + t("parent.firstName")} />
                            </FormControl>

                            {/* second name */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("parent.middleName")}</FormLabel>
                                <Input type="text" name="middle_name" value={parentData.middle_name} onChange={handleChange} placeholder={t("init.placeholder") + t("parent.middleName")} />
                            </FormControl>

                            {/* last name */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("parent.lastName")}</FormLabel>
                                <Input type="text" name="last_name" value={parentData.last_name} onChange={handleChange} placeholder={t("init.placeholder") + t("parent.lastName")} />
                            </FormControl>
                        </Stack>

                        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
                            {/* username */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("parent.username")}</FormLabel>
                                <Input type="text" name="username" value={parentData.username} onChange={handleChange} placeholder={t("init.placeholder") + t("parent.username")} />
                            </FormControl>

                            {/* gender */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("parent.gender")}</FormLabel>
                                <Select name="gender" defaultValue={parentData.gender} value={parentData.gender}
                                    placeholder={t("init.select") + t("parent.gender")}
                                    onChange={(e, value) => setParentData({ ...parentData, gender: value })}>
                                    {[{ value: 'M', label: t("parent.male") }, { value: 'F', label: t("parent.female") }].map((item, index) => (
                                        <Option key={index} value={item.value}>{item.label}</Option>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>

                        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
                            {/* studentr */}
                            <FormControl sx={{ flex: 1 }}>
                                <FormLabel>{t("parent.student")} <small>({t("parent.alertStudent")})</small></FormLabel>
                                <Autocomplete
                                    multiple
                                    options={studentList}
                                    value={parentData.student_ids}
                                    defaultValue={parentData.student_ids}
                                    getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    onChange={(e, value) => setParentData({ ...parentData, student_ids: value })}
                                    placeholder={t("init.select") + t("parent.student")}
                                />
                            </FormControl>

                            {/* type */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("parent.type")}</FormLabel>
                                <Select name="parent_type" defaultValue={parentData.parent_type} value={parentData.parent_type}
                                    placeholder={t("init.select") + t("parent.type")}
                                    onChange={(e, value) => setParentData({ ...parentData, parent_type: value })}>
                                    {[
                                        { value: 'mother', label: t("parent.mother") },
                                        { value: 'father', label: t("parent.father") },
                                        { value: 'guardian', label: t("parent.guardian") }]
                                        .map((item, index) => (
                                            <Option key={index} value={item.value}>{item.label}</Option>
                                        ))}
                                </Select>
                            </FormControl>
                        </Stack>

                        <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>

                            {/* email */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("parent.email")}</FormLabel>
                                <Input type="text" name="email" value={parentData.email} onChange={handleChange} placeholder={t("init.placeholder") + t("parent.email")} />
                            </FormControl>

                            {/* mobile */}
                            <FormControl sx={{ flex: 1 }} required>
                                <FormLabel>{t("parent.mobile")}</FormLabel>
                                <Input type="text" name="mobile" value={parentData.mobile} onChange={handleChange} placeholder={t("init.placeholder") + t("parent.mobile")} />
                            </FormControl>
                        </Stack>

                        <Stack gap={4} sx={{ mt: 2 }}>
                            <Button color="success" type="submit" fullWidth>
                                {editStatus === STATUS.LOADING ? t("init.loading") : t("init.submit")}
                            </Button>
                        </Stack>
                    </Stack>
                </ModalDialog>
            </Modal>
        </Box>
    )
}

const mapStateToProps = ({ user, auth }) => {
    const {
        accessToken,

        editUserStatus: editStatus,
        editUserResult: editResult,
        editUserErrorMEessage: editErrorMessage,
    } = auth
    const {
        parentDetailsStatus: detailsStatus,
        parentDetailsResult: detailsResult,
        parentDetailsErrorMessage: detailsErrorMessage,
    } = user

    return {
        accessToken,
        editStatus,
        editResult,
        editErrorMessage,
        detailsStatus,
        detailsErrorMessage,
        detailsResult
    }
}

export default connect(mapStateToProps, {})(ParentDetailsPage)