import React from 'react';
import CustomButton from "../../UI/button/CustomButton";
import CharacteristicService from "../../../services/CharacteristicService";
import cl from './CharacteristicDelete.module.css'
import CategoryService from "../../../services/CategoryService";
const CharacteristicDelete = ({fetch, setVisible, characteristic}) => {
    const deleteCategory = async (e)=>{
        e.preventDefault()
        try {
            await CharacteristicService.delete(characteristic.id)
            setVisible(false)
            fetch()
        }catch (err){
        }
    }
    const back = (e)=>{
        e.preventDefault()
        setVisible(false)
    }
    return (
        <div className={cl.container}>
            <div className={cl.text}>Are you sure you want to delete
                <div className={cl.characteristic}>
                    <div className={cl.type}>{characteristic.type}</div>
                    <div className={cl.body}>{characteristic.body}</div>
                </div>
                characteristic?
            </div>
            <div className={cl.buttons}>
                <CustomButton onClick={deleteCategory}>Yes</CustomButton>
                <CustomButton onClick={back}>No</CustomButton>
            </div>
        </div>
    );
};

export default CharacteristicDelete;