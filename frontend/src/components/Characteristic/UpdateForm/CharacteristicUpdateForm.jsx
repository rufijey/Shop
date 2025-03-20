import React, {useEffect, useState} from 'react';
import CustomInput from "../../UI/input/CustomInput";
import CustomButton from "../../UI/button/CustomButton";
import CharacteristicService from "../../../services/CharacteristicService";

const CharacteristicUpdateForm = ({fetch, setVisible, characteristic}) => {
    const [characteristicBody, setCharacteristicBody] = useState('');
    const [characteristicType, setCharacteristicType] = useState('');
    useEffect(() => {
        setCharacteristicBody(characteristic.body)
        setCharacteristicType(characteristic.type)
    }, [characteristic]);
    const UpdateCharacteristic= async (e)=>{
        e.preventDefault();

        try {
            await CharacteristicService.update(characteristic.id, characteristicBody, characteristicType)
            setVisible(false)
            fetch()
        }catch (err){
            if (err.response.message) {
                alert(err.response.message)
            }
        }
    }

    return (
        <div>
            <form>
                <CustomInput onChange={e => setCharacteristicType(e.target.value)} value={characteristicType} type="text"
                             placeholder="type"/>
                <CustomInput onChange={e => setCharacteristicBody(e.target.value)} value={characteristicBody} type="text"
                             placeholder="body"/>
                <CustomButton onClick={UpdateCharacteristic}>Submit</CustomButton>
            </form>
        </div>
    );
};

export default CharacteristicUpdateForm;