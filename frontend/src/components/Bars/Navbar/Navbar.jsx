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
import { AiOutlineProduct } from "react-icons/ai";
import CustomInput from "../../UI/input/CustomInput";
import { AiFillHome } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import productStore from "../../../store/ProductStore";
import { FaCartShopping } from "react-icons/fa6";

const Navbar = observer(() => {
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

    function handleLogout() {
        AuthStore.logout();
        navigate('/user/login');
    }

    const searchSubmit = async () => {
        const path = window.location.pathname
        if(!(path === '/products' || path === '/admin/products')){
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

    return (
        <div className={cl.navbar}>
            <div className={cl.main__links}>
                <Link to='/' className={cl.main__item}><AiFillHome/></Link>
                <Link to='/products' className={cl.main__item}><AiOutlineProduct/></Link>
            </div>
            <div className={cl.input}>
            <CustomInput
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <FaSearch className={cl.searchIcon} onClick={searchSubmit}/>
            </div>
            <div className={cl.navbar__links}>
                {authStore.isAuthenticated &&
                    <Link to='/cart' className={cl.item}><FaCartShopping/></Link>
                }
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
        </div>
    );
});

export default Navbar;
