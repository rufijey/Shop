import React, {useEffect, useRef, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import cl from './Navbar.module.css'
import {FaBars} from "react-icons/fa6";
import {MdAdminPanelSettings} from "react-icons/md";
import {AiOutlineUser} from "react-icons/ai";
import {LuUserCircle2} from "react-icons/lu";
import AuthStore from "../../../store/AuthStore";
import {observer} from "mobx-react-lite";
import authStore from "../../../store/AuthStore";
import {AiOutlineProduct} from "react-icons/ai";
import CustomInput from "../../UI/input/CustomInput";
import {AiFillHome} from "react-icons/ai";
import {FaSearch} from "react-icons/fa";
import productStore from "../../../store/ProductStore";
import {FaCartShopping} from "react-icons/fa6";
import Modal from "../../UI/modal/Modal";
import CurrentOrder from "../../Order/CurrentOrder";
import {IoShirt} from "react-icons/io5";
import orderStore from "../../../store/OrderStore";

const Navbar = observer(({classNames}) => {
    const [visible, setVisible] = useState(false);
    const [search, setSearch] = useState('');
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setVisible(!visible);
    }

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await AuthStore.logout();
    }

    const searchSubmit = async () => {
        const path = window.location.pathname
        if (!(path === '/products' || path === '/admin/products')) {
            const part = path.split('/')[1];
            part === 'admin' ? navigate(`/admin/products`) : navigate('/products')
        }
        productStore.setFilter('title', search);
        productStore.syncUrl()
        await productStore.fetchProducts()
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchSubmit();
        }
    }

    const handleCartClick = () => {
        orderStore.setVisible(true)
    }

    return (
        <div className={[cl.navbar, classNames].join(' ')}>
            <div className={cl.main__links}>
                <Link to='/' className={cl.main__item}><AiFillHome/></Link>
                <div className={cl.main__item}
                    onClick={()=>{
                        navigate('/products')
                        if(window.location.pathname.split('/').at(-1) === 'products'){
                            productStore.syncUrl()
                        }
                    }}
                ><IoShirt/></div>
            </div>
            <div className={cl.input}>
                <CustomInput
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <FaSearch className={cl.search__icon} onClick={searchSubmit}/>
            </div>
            <div className={cl.navbar__links}>
                <div onClick={handleCartClick} className={cl.item}>
                    <FaCartShopping/>
                    {orderStore.order.products_quantity > 0 && (
                        <div className={cl.cart__quantity}>
                            {orderStore.order.products_quantity}
                        </div>
                    )}
                </div>
                {authStore.isAdmin &&
                    <Link to='/admin' className={cl.item}><MdAdminPanelSettings/></Link>
                }
                <div className={cl.icon} onClick={toggleDropdown} ref={dropdownRef}>
                    {authStore.isAuthenticated
                        ? <div>
                            <LuUserCircle2 className={cl.item}/>
                            <div className={`${cl.dropdown} ${visible ? cl.visible : ''}`}>
                                <Link to='/user/me' className={cl.dropdown__item}>Me</Link>
                                <div onClick={handleLogout} className={cl.dropdown__item}>Logout</div>
                            </div>
                        </div>
                        : <div>
                            <AiOutlineUser className={cl.item}/>
                            <div className={`${cl.dropdown} ${visible ? cl.visible : ''}`}>
                                <Link to='/user/register' className={cl.dropdown__item}>Register</Link>
                                <Link to='/user/login' className={cl.dropdown__item}>Login</Link>
                            </div>
                        </div>
                    }
                </div>
            </div>
            <Modal visible={orderStore.visible} setVisible={orderStore.setVisible}>
                <CurrentOrder setVisibleModal={orderStore.setVisible}/>
            </Modal>
        </div>
    );
});

export default Navbar;
