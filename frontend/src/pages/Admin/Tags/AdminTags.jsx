import React, { useEffect, useState } from 'react';
import TagService from "../../../services/TagService";
import cl from './AdminTags.module.css';
import { TiDelete } from "react-icons/ti";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import Modal from "../../../components/UI/modal/Modal";
import TagDelete from "../../../components/Tag/Delete/TagDelete";
import TagUpdateForm from "../../../components/Tag/UpdateForm/TagUpdateForm";
import TagPostForm from "../../../components/Tag/PostForm/TagPostForm";
import Loader from "../../../components/UI/loader/Loader";
import {getPagesCount} from "../../../utils/pages";


const AdminTags = () => {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleAdd, setVisibleAdd] = useState(false);
    const [visibleChange, setVisibleChange] = useState(false);
    const [visibleDelete, setVisibleDelete] = useState(false);
    const [tagForChange, setTagForChange] = useState(null);
    const [tagForDelete, setTagForDelete] = useState(null);
    const fetchTags = async () => {
        try {
            setLoading(true);
            const res = await TagService.getAll();
            setTags(res.data);
        } catch (error) {
            console.error("Error fetching tags:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

    const handleEditClick = (tag) => {
        setTagForChange(tag);
        setVisibleChange(true);
    };

    const handleDeleteClick = (tag) => {
        setTagForDelete(tag);
        setVisibleDelete(true);
    };


    return (
        <div className={cl.container}>
            <div className={cl.tags}>
                <div className={cl.title}>Tags:</div>
                {tags.map(tag => (
                    <div className={cl.tag__item} key={tag.id}>
                        <div>{tag.title}</div>
                        <div>
                            <MdOutlineDriveFileRenameOutline
                                className={cl.change}
                                onClick={() => handleEditClick(tag)}
                            />
                            <TiDelete
                                className={cl.tip}
                                onClick={() => handleDeleteClick(tag)}
                            />
                        </div>
                    </div>
                ))}
                {loading && <Loader/>}
            </div>
            <IoMdAddCircleOutline
                className={cl.add}
                onClick={() => setVisibleAdd(true)}
            />
            <Modal visible={visibleAdd} setVisible={setVisibleAdd}>
                <TagPostForm fetch={fetchTags} setVisible={setVisibleAdd} />
            </Modal>
            <Modal visible={visibleChange} setVisible={setVisibleChange}>
                {tagForChange && (
                    <TagUpdateForm
                        fetch={fetchTags}
                        setVisible={setVisibleChange}
                        tag={tagForChange}
                    />
                )}
            </Modal>
            <Modal visible={visibleDelete} setVisible={setVisibleDelete}>
                {tagForDelete && (
                    <TagDelete
                        fetch={fetchTags}
                        setVisible={setVisibleDelete}
                        tag={tagForDelete}
                    />
                )}
            </Modal>
        </div>
    );
};

export default AdminTags;
