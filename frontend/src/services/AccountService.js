import api from "../api";
import axios from "axios";
import {getFingerprint} from "./FingerprintService";

export default class EmailService {
    static async verify(id, hash, fingerprint) {
        return await axios.get(`email/verify/${id}/${hash}/${fingerprint}`)
    }
    static async resend(email) {
        return await axios.get(`email/verify/resend/${email}`)
    }
}