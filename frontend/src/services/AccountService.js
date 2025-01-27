import api from "../api";
import axios from "axios";
import {getFingerprint} from "./FingerprintService";

export default class AccountService {
    static async verify(id, hash, fingerprint) {
        return await axios.post(`account/verify`,{
            id: id,
            hash: hash,
            fingerprint: fingerprint
        })
    }
    static async resendEmail(email) {
        return await axios.get(`account/verify/resend/${email}`)
    }
    static async forgotPassword(email) {
        return await axios.post(`account/password/forgot`, {
            email: email
        })
    }
    static async resetPassword(data) {
        return await axios.post(`account/password/reset`, data)
    }
}