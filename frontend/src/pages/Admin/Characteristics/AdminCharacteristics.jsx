import React, { useEffect, useState } from 'react';
import CharacteristicService from "../../../services/CharacteristicService";
import cl from './AdminCharacteristics.module.css';
import { TiDelete } from "react-icons/ti";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import Modal from "../../../components/UI/modal/Modal";
import CharacteristicDelete from "../../../components/Characteristic/Delete/CharacteristicDelete";
import CharacteristicUpdateForm from "../../../components/Characteristic/UpdateForm/CharacteristicUpdateForm";
import CharacteristicPostForm from "../../../components/Characteristic/PostForm/CharacteristicPostForm";
import Loader from "../../../components/UI/loader/Loader";
import CustomInput from "../../../components/UI/input/CustomInput"; // Добавляем CustomInput для поиска
import { FaSearch } from "react-icons/fa";

const AdminCharacteristics = () => {
    const [characteristics, setCharacteristics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleAdd, setVisibleAdd] = useState(false);
    const [visibleChange, setVisibleChange] = useState(false);
    const [visibleDelete, setVisibleDelete] = useState(false);
    const [characteristicForChange, setCharacteristicForChange] = useState(null);
    const [characteristicForDelete, setCharacteristicForDelete] = useState(null);
    const [characteristicTitle, setCharacteristicTitle] = useState('');

    const fetchCharacteristics = async () => {
        try {
            setLoading(true);
            const res = await CharacteristicService.getAll(characteristicTitle);
            setCharacteristics(res.data);
        } catch (error) {
            console.error("Error fetching characteristics:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCharacteristics(); // Загружаем теги при загрузке компонента
    }, []);

    const handleEditClick = (characteristic) => {
        setCharacteristicForChange(characteristic);
        setVisibleChange(true);
    };

    const handleDeleteClick = (characteristic) => {
        setCharacteristicForDelete(characteristic);
        setVisibleDelete(true);
    };

    const handleSearchSubmit = () => {
        fetchCharacteristics(characteristicTitle);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearchSubmit();
        }
    };

    return (
        <div className={cl.container}>
            <div className={cl.characteristics__container}>
                <div className={cl.search}>
                    <CustomInput
                        value={characteristicTitle}
                        onChange={e => setCharacteristicTitle(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <FaSearch className={cl.search__icon} onClick={handleSearchSubmit} />
                </div>
                <div className={cl.characteristics}>
                    {characteristics.map(characteristic => (
                        <div className={cl.characteristic__item} key={characteristic.id}>
                            <div className={cl.characteristic}>
                                <div className={cl.characteristic__type}>{characteristic.type}</div>
                                <div>{characteristic.body}</div>
                            </div>
                            <div>
                                <MdOutlineDriveFileRenameOutline
                                    className={cl.change}
                                    onClick={() => handleEditClick(characteristic)}
                                />
                                <TiDelete
                                    className={cl.tip}
                                    onClick={() => handleDeleteClick(characteristic)}
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
                <CharacteristicPostForm fetch={fetchCharacteristics} setVisible={setVisibleAdd} />
            </Modal>
            <Modal visible={visibleChange} setVisible={setVisibleChange}>
                {characteristicForChange && (
                    <CharacteristicUpdateForm
                        fetch={fetchCharacteristics}
                        setVisible={setVisibleChange}
                        characteristic={characteristicForChange}
                    />
                )}
            </Modal>
            <Modal visible={visibleDelete} setVisible={setVisibleDelete}>
                {characteristicForDelete && (
                    <CharacteristicDelete
                        fetch={fetchCharacteristics}
                        setVisible={setVisibleDelete}
                        characteristic={characteristicForDelete}
                    />
                )}
            </Modal>
        </div>
    );
};

export default AdminCharacteristics;
