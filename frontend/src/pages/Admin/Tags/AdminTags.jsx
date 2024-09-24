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
import CustomInput from "../../../components/UI/input/CustomInput"; // Добавляем CustomInput для поиска
import { FaSearch } from "react-icons/fa";

const AdminTags = () => {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleAdd, setVisibleAdd] = useState(false);
    const [visibleChange, setVisibleChange] = useState(false);
    const [visibleDelete, setVisibleDelete] = useState(false);
    const [tagForChange, setTagForChange] = useState(null);
    const [tagForDelete, setTagForDelete] = useState(null);
    const [tagTitle, setTagTitle] = useState(''); // Стейт для фильтрации по названию тегов

    const fetchTags = async () => {
        try {
            setLoading(true);
            const res = await TagService.getAll(tagTitle); // Передаем параметр title для фильтрации
            setTags(res.data);
        } catch (error) {
            console.error("Error fetching tags:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTags(); // Загружаем теги при загрузке компонента
    }, []);

    const handleEditClick = (tag) => {
        setTagForChange(tag);
        setVisibleChange(true);
    };

    const handleDeleteClick = (tag) => {
        setTagForDelete(tag);
        setVisibleDelete(true);
    };

    const handleSearchSubmit = () => {
        fetchTags(tagTitle); // Загружаем теги с фильтрацией по введенному названию
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearchSubmit(); // Отправляем запрос по нажатию Enter
        }
    };

    return (
        <div className={cl.container}>
            <div className={cl.tags__container}>
                <div className={cl.search}>
                    <CustomInput
                        value={tagTitle}
                        onChange={e => setTagTitle(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <FaSearch className={cl.search__icon} onClick={handleSearchSubmit} />
                </div>
                <div className={cl.tags}>
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
                </div>
                {loading && <Loader />}
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
