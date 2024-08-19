import React, {useState} from 'react';
import CustomInput from "../../UI/input/CustomInput";
import CustomButton from "../../UI/button/CustomButton";
import TagService from "../../../services/TagService";

const TagPostForm = ({fetch, setVisible}) => {
    const [tagTitle, setTagTitle] = useState('');
    const addNewCategory= (e)=>{
        e.preventDefault();
        TagService.post(tagTitle).then(res=>{
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
                <CustomButton onClick={addNewCategory}>Submit</CustomButton>
            </form>
        </div>
    );
};

export default TagPostForm;