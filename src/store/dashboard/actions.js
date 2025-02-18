import { STATE } from "../../constant";

// ------ counts actions -------
export function countsRequest(token, data) {
    return {
        type: STATE.COUNTS_REQUEST,
        payload: {
            token,
            data
        }
    }
}

export function countsReset() {
    return {
        type: STATE.COUNTS_RESET
    }
}

// ------ sales summary actions ----
export function salesSummaryRequest(token, data) {
    return {
        type: STATE.SALES_SUMMARY_REQUEST,
        payload: {
            token,
            data
        }
    }
}

export function salesSummaryReset() {
    return {
        type: STATE.SALES_SUMMARY_RESET
    }
}

// ------- sales trend actions ----
export function salesTrendRequest(token, data) {
    return {
        type: STATE.SALES_TREND_REQUEST,
        payload: {
            token,
            data
        }
    }
}

export function salesTrendReset() {
    return {
        type: STATE.SALES_TREND_RESET
    }
}