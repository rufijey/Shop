import React, {useEffect, useState} from 'react';
import cl from './CharacteristicSelector.module.css';
import CharacteristicService from "../../../services/CharacteristicService";
import {RxCross2} from "react-icons/rx";
import {IoMdAdd} from "react-icons/io";
import Modal from "../../UI/modal/Modal";
import Loader from "../../UI/loader/Loader";
import {FaTags} from "react-icons/fa6";

const CharacteristicSelector = ({selectedCharacteristics, setSelectedCharacteristics, characteristics, loading}) => {
    // const [characteristics, setCharacteristics] = useState([]);
    // const [characteristicsLoading, setCharacteristicsLoading] = useState(true);
    const [visible, setVisible] = useState(false);

    // useEffect(() => {
    //     fetchCharacteristics();
    // }, []);

    // const fetchCharacteristics = async () => {
    //     try {
    //         setCharacteristicsLoading(true);
    //         const res = await CharacteristicService.getAll();
    //         setCharacteristics(res.data);
    //     } catch (error) {
    //         console.error("Error fetching characteristics:", error);
    //     } finally {
    //         setCharacteristicsLoading(false);
    //     }
    // };

    const handleCharacteristicSelect = (characteristic) => {
        if (!selectedCharacteristics.includes(characteristic)) {
            setSelectedCharacteristics([...selectedCharacteristics, characteristic]);
        }
    };

    const handleCharacteristicRemove = (characteristic) => {
        setSelectedCharacteristics(selectedCharacteristics.filter(t => t !== characteristic));
    };

    return (
        <div className={cl.container}>
            <div className={cl.selected__characteristic}>
                <FaTags className={cl.body}/>

                <div className={cl.selected__characteristics}>
                    {selectedCharacteristics.map((characteristic, index) => (
                        <div key={`${characteristic.id}-${index}`} className={cl.selected_characteristic}>
                            {characteristic.body}
                            <RxCross2 className={cl.delete} onClick={() => handleCharacteristicRemove(characteristic)}/>
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
                    <div className={cl.body}>Characteristics</div>

                    <div className={cl.selected__characteristics}>
                        {selectedCharacteristics.map((characteristic, index) => (
                            <div key={`${characteristic.id}-${index}`} className={cl.selected_characteristic}>
                                {characteristic.body}
                                <RxCross2 className={cl.delete} onClick={() => handleCharacteristicRemove(characteristic)}/>
                            </div>
                        ))}
                    </div>
                    <hr/>
                    {loading ? (
                        <Loader/>
                    ) : (
                        <div className={cl.characteristics__list}>
                            {characteristics.map((characteristic, index) => (
                                <div
                                    key={`${characteristic.id}-${index}`}
                                    onClick={() => handleCharacteristicSelect(characteristic)}
                                    className={cl.characteristic}
                                >
                                    {characteristic.type} - {characteristic.body}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default CharacteristicSelector;
