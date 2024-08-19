import React, {useEffect, useState} from 'react';
import cl from './TagSelector.module.css';
import TagService from "../../../services/TagService";
import {RxCross2} from "react-icons/rx";
import {IoMdAdd} from "react-icons/io";
import Modal from "../../UI/modal/Modal";
import Loader from "../../UI/loader/Loader";
import {FaTags} from "react-icons/fa6";

const TagSelector = ({selectedTags, setSelectedTags}) => {
    const [tags, setTags] = useState([]);
    const [tagsLoading, setTagsLoading] = useState(true);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        try {
            setTagsLoading(true);
            const res = await TagService.getAll();
            setTags(res.data);
        } catch (error) {
            console.error("Error fetching tags:", error);
        } finally {
            setTagsLoading(false);
        }
    };

    const handleTagSelect = (tag) => {
        if (!selectedTags.includes(tag)) {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleTagRemove = (tag) => {
        setSelectedTags(selectedTags.filter(t => t !== tag));
    };

    return (
        <div className={cl.container}>
            <div className={cl.selected__tag}>
                <FaTags className={cl.title}/>

                <div className={cl.selected__tags}>
                    {selectedTags.map((tag, index) => (
                        <div key={`${tag.id}-${index}`} className={cl.selectedTag}>
                            {tag.title}
                            <RxCross2 className={cl.delete} onClick={() => handleTagRemove(tag)}/>
                        </div>
                    ))}
                </div>
                <IoMdAdd
                    className={cl.add}
                    onClick={() => setVisible(true)}
                />
            </div>

            <Modal visible={visible} setVisible={setVisible}>
                <div>
                    <div className={cl.title}>Tags</div>

                    <div className={cl.selected__tags}>
                        {selectedTags.map((tag, index) => (
                            <div key={`${tag.id}-${index}`} className={cl.selectedTag}>
                                {tag.title}
                                <RxCross2 className={cl.delete} onClick={() => handleTagRemove(tag)}/>
                            </div>
                        ))}
                    </div>
                    <hr/>
                    {tagsLoading ? (
                        <Loader/>
                    ) : (
                        <div className={cl.tags__list}>
                            {tags.map((tag, index) => (
                                <div
                                    key={`${tag.id}-${index}`}
                                    onClick={() => handleTagSelect(tag)}
                                    className={cl.tag}
                                >
                                    {tag.title}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default TagSelector;
