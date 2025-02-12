import { fork } from "@redux-saga/core/effects";

import authSaga from "./auth/sagas";
import userSaga from "./user/sagas";
import resourcesSaga from "./resources/sagas"

export default function* root() {
    yield fork(authSaga);
    yield fork(userSaga);
    yield fork(resourcesSaga);
}