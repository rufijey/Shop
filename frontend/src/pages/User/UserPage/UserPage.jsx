import React, {useEffect} from 'react';
import authStore from "../../../store/AuthStore";
import {getFingerprint} from "../../../services/FingerprintService";
import axios from "axios";
import AuthStore from "../../../store/AuthStore";
import router from "../../../router";
const UserPage = () => {
    return (
        <div>
            {authStore.user.role}
        </div>
    );
};

export default UserPage;