import React, {useState} from 'react';
import cl from './AdminMain.module.css'
import {useNavigate} from "react-router-dom";
import CustomInput from "../../../components/UI/input/CustomInput";
import CustomButton from "../../../components/UI/button/CustomButton";
import UserService from "../../../services/UserService";
import Alert from "../../../components/UI/alert/Alert";

const AdminMain = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [user, setUser] = useState({})
    const [showAlert, setShowAlert] = useState(false)
    const [message, setMessage] = useState('')


    const fetchUser = async () => {
        try {
            const res = await UserService.getByEmail(email)
            if (res.data.message){
                setMessage(res.data.message)
                setShowAlert(true)
            }
            else{
                setUser(res.data)
            }
        } catch (err) {
            console.error(err.message)
        }
    }
    const makeAdmin = async () => {
        try {
            const res = await UserService.makeAdmin(user.id)
            await fetchUser()
        } catch (err) {
            console.log(err.message)
        }
    }
    const makeUnAdmin = async () => {
        try {
            const res = await UserService.makeUnAdmin(user.id)
            await fetchUser()
        } catch (err) {
            console.log(err.message)
        }
    }
    return (
        <div className={cl.container}>
            <div className={cl.sections__container}>
                <div
                    className={[cl.item, cl.products].join(' ')}
                    onClick={() => navigate('/admin/products')}
                >
                    Products
                </div>
                <div
                    className={[cl.item, cl.categories].join(' ')}
                    onClick={() => navigate('/admin/categories')}
                >
                    Categories
                </div>
                <div
                    className={[cl.item, cl.tags].join(' ')}
                    onClick={() => navigate('/admin/tags')}
                >
                    Tags
                </div>
            </div>
            <div className={cl.make__admin}>
                <hr/>
                <div>Users:</div>
                <div className={cl.find}>
                    <div className={cl.input}>
                        <CustomInput placeholder="email"
                                     value={email}
                                     onChange={e => setEmail(e.target.value)}
                                     type="email"
                        />
                    </div>
                    <CustomButton onClick={fetchUser}>find</CustomButton>
                </div>
                {user.name &&
                    <div className={cl.user__container}>
                        <div className={cl.user}>
                            <div>Name: {user.name}</div>
                            <div>Email: {user.email}</div>
                            <div>Role: {user.role}</div>
                        </div>
                        <div className={cl.btns}>
                            <CustomButton onClick={makeAdmin}>Make admin</CustomButton>
                            <CustomButton onClick={makeUnAdmin}>Make un admin</CustomButton>
                        </div>

                    </div>
                }

            </div>
            {showAlert &&
                <Alert
                    className={cl.alert}
                    message={message}
                    onClose={() => setShowAlert(false)}
                />
            }
        </div>

    );
};

export default AdminMain;