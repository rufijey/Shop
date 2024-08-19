import React, {useEffect, useState} from 'react';
import CustomInput from "../../UI/input/CustomInput";
import CustomButton from "../../UI/button/CustomButton";
import TagService from "../../../services/TagService";

const TagUpdateForm = ({fetch, setVisible, tag}) => {
    const [tagTitle, setTagTitle] = useState('');
    useEffect(() => {
        setTagTitle(tag.title)
    }, []);
    const UpdateTag= (e)=>{
        e.preventDefault();
        TagService.update(tag.id, tagTitle).then(res=>{
            if(res.data.message){
                alert(res.data.message)
            }
            setVisible(false)
            fetch()
        }).catch(err=>{
            console.log(err.message)
        })
    }

    return (
        <div>
            <form>
                <CustomInput onChange={e => setTagTitle(e.target.value)} value={tagTitle} type="text"
                         placeholder="Tag title"/>
                <CustomButton onClick={UpdateTag}>Submit</CustomButton>
            </form>
        </div>
    );
};

export default TagUpdateForm;