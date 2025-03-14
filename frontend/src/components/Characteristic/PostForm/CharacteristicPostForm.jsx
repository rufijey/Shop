import React, {useState} from 'react';
import CustomInput from "../../UI/input/CustomInput";
import CustomButton from "../../UI/button/CustomButton";
import CharacteristicService from "../../../services/CharacteristicService";

const CharacteristicPostForm = ({fetch, setVisible}) => {
    const [characteristicBody, setCharacteristicBody] = useState('');
    const [characteristicType, setCharacteristicType] = useState('');
    const addNewCharacteristic= (e)=>{
        e.preventDefault();
        CharacteristicService.post(characteristicBody, characteristicType).then(res=>{
            setVisible(false)
            setCharacteristicBody('')
            setCharacteristicType('')
            fetch()
        }).catch(err=>{
            if(err.message){
                alert(err.message)
            }
        })
    }

    return (
        <div>
            <form>
                <CustomInput onChange={e => setCharacteristicType(e.target.value)} value={characteristicType} type="text"
                             placeholder="type"/>
                <CustomInput onChange={e => setCharacteristicBody(e.target.value)} value={characteristicBody} type="text"
                         placeholder="body"/>
                <CustomButton onClick={addNewCharacteristic}>Submit</CustomButton>
            </form>
        </div>
    );
};

export default CharacteristicPostForm;