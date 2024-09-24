import React, {useEffect} from 'react';
import authStore from "../../../store/AuthStore";

const UserPage = () => {

    return (
        <div>
            {authStore.user.role}
        </div>
    );
};

export default UserPage;