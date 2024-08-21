import React, {useEffect, useState} from 'react';
import {FaAngleDown, FaAngleUp, FaSearch} from "react-icons/fa";
import cl from './TagCheckboxSelect.module.css';
import TagService from "../../../services/TagService";
import Loader from "../../UI/loader/Loader";
import productStore from "../../../store/ProductStore";
import {observer} from "mobx-react-lite";
import CustomInput from "../../UI/input/CustomInput";

const TagCheckboxSelect = observer(() => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]); // Массив для хранения ID выбранных тегов
    const [tags, setTags] = useState([]);
    const [tagsLoading, setTagsLoading] = useState(false);
    const [tagTitle, setTagTitle]= useState('')
    const fetchTags = async (title) => {
        try {
            setTagsLoading(true);
            const res = await TagService.getAll(title);
            setTags(res.data);
        } catch (error) {
            console.error("Error fetching tags:", error);
        } finally {
            setTagsLoading(false);
        }
    };
    useEffect(() => {
        fetchTags()
    }, []);

    const toggleList = () => {
        // if (!tags[0]) {
        //     fetchTags().then(()=>{
        //         setIsOpen(!isOpen);
        //     })
        // }
        // else {
        //     setIsOpen(!isOpen);
        // }
        setIsOpen(!isOpen);
    };

    const handleCheckboxChange = (event, tagId) => {
        if (event.target.checked) {
            productStore.setFilter('tag_ids',[...productStore.filters.tag_ids, tagId])
        } else {
            productStore.setFilter('tag_ids', productStore.filters.tag_ids.filter(id => id !== tagId))
        }

    }

    const handleTagsKeyDown = async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            await handleTagsSearchSubmit()
        }
    }
    const handleTagsSearchSubmit = async (e) => {
        await fetchTags(tagTitle)
    }

    return (
        <div className={cl.container}>
            <div className={cl.select}>
                <div onClick={toggleList} className={cl.tagsOpen}>
                    <div>Tags</div>
                    {isOpen ? <FaAngleUp className={cl.arrow}/> : <FaAngleDown className={cl.arrow}/>}
                </div>
                {isOpen && (
                    <div className={cl.tags}>
                        {tagsLoading &&
                            <div className={cl.loader}>
                                <Loader/>
                            </div>
                        }
                        <div className={cl.tags__search}>
                            <CustomInput
                                value={tagTitle}
                                onChange={e => setTagTitle(e.target.value)}
                                onKeyDown={handleTagsKeyDown}
                                className={cl.tag__input}
                            />
                            <FaSearch className={cl.searchIcon} onClick={handleTagsSearchSubmit}/>
                        </div>
                        {tags.map(tag => (
                            <label key={tag.id} className={cl.custom__checkbox}>
                                <input
                                    type="checkbox"
                                    name={tag.id}
                                    checked={productStore.filters.tag_ids.includes(tag.id)}
                                    onChange={(event) => handleCheckboxChange(event, tag.id)}
                                />
                                <span className={cl.checkmark}></span>
                                {tag.title}
                            </label>
                        ))}
                    </div>
                )}
            </div>
            <div className={cl.tags}>
                {tags
                    .filter(tag => productStore.filters.tag_ids.includes(tag.id)) // Фильтруем теги
                    .map(tag => (
                        <label key={tag.id} className={cl.custom__checkbox}>
                        <input
                                type="checkbox"
                                name={tag.id}
                                checked={productStore.filters.tag_ids.includes(tag.id)}
                                onChange={(event) => handleCheckboxChange(event, tag.id)}
                            />
                            <span className={cl.checkmark}></span>
                            {tag.title}
                        </label>
                    ))}
            </div>
        </div>
    );
});

export default TagCheckboxSelect;
