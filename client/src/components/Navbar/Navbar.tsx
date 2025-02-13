import { Button } from "@mui/material";
import "./Navbar.css"
import {  Avatar, Dropdown, Flex, Layout, MenuProps, Space, Button as AntButton, Menu } from 'antd';
import { Link, useNavigate } from "react-router-dom";
import GuestGuard from "../Guards/GuestGuard";
import { useAuthStore } from "../../stores/useAuthStore";
import RouteGuard from "../Guards/RouteGuard";
import { DownOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import Cookies from "js-cookie"
import NavbarMenus from "./NavbarMenus";
import IsAuth from "../Guards/IsAuth";

const { Header } = Layout;

const Navbar = () => {
    const button : React.CSSProperties = {
        fontSize: '12px',
        fontWeight: '700',
        padding: '0.3rem 1.4rem',
        background: '#fff',
        borderRadius: '40px',
        color: '#333',
        boxShadow: '0 0 10px rgba(0, 0, 0, .1)',
        textTransform: 'none',
        fontFamily: '"Poppins", sans-serif',
    };

    const { user, setUser, clearTokens } = useAuthStore();
    const navigate = useNavigate();

    const items: MenuProps['items'] = [
        {
            label: 'Profile',
            key: '1',
            icon: (<UserOutlined />),
            onClick: () => {
                navigate('/profile')
            }
          },
        {
          type: 'divider',
        },
        {
          label: 'Logout',
          key: '3',
          icon: (<LogoutOutlined />),
          onClick: () => {
            Cookies.remove("accessToken")
            Cookies.remove("refreshToken")
            clearTokens()
            setUser(null)
            location.href = "/"
          }
        },
      ];

    return (
        <Header className="navbar flex align-center px-6" >
            <div className="logo" style={{ color: 'white', fontSize: '24px' }}>
                <img src="/logo.png" alt="" />
                EcoStats
            </div>
            
            <NavbarMenus />

            <Flex gap="small">
                <GuestGuard>
                    <Link to="/login">
                        <Button variant="contained" style={button} >
                                Login 
                        </Button>
                    </Link>

                    {/* <Link to="/signup">
                        <Button variant="contained" style={button} >
                                Sign Up 
                        </Button>
                    </Link> */}
                </GuestGuard>
                <IsAuth>
                    {/* <Button variant="contained" style={button} >
                            Logout 
                    </Button> */}
                    <Dropdown  menu={{ items }} trigger={['click']}>
                        <Space>
                            <Avatar className="cursor-pointer hover:scale-110" src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${user?.name}`} /> 
                        </Space>
                    </Dropdown>
                </IsAuth>
            </Flex>
        </Header>
    );
};

export default Navbar;
