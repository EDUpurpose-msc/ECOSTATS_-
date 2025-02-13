import { ConfigProvider, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";
import { useEffect, useState } from "react";


const NavbarMenus = () => {

    const navigate  = useNavigate();

    const authStore = useAuthStore();

    const configTheme = {
        "token": {
          "colorPrimary": "#41a61d",
          "colorInfo": "#41a61d"
        },
        "components": {
          "Menu": {
            "itemBg": "rgb(247,247,186)",
            "itemColor": "rgba(4,164,47,0.88)",
            "itemSelectedColor": "rgb(1,27,63)",
            "popupBg": "rgb(247,247,186)",
            "itemSelectedBg": "rgba(230,244,255,0)",
            "horizontalItemSelectedColor": "rgb(1,23,54)"
          }
        }
    }

    const [items, setItems]  = useState<any>([]);

    useEffect(() => {
        const i = [
            {
                key : "1",
                label : "Home",
                onClick: () => navigate("/"),
                role : ["admin", "planning team", "chief", "focal"]
            },
            {
                key : "2",
                label : "Admin",
                onClick: () => navigate("/admin"),
                role : ["admin", "planning officer"]
            },
            {
                key : "3",
                label : "Reports",
                onClick: () => navigate("/reports"),
                role : ["admin", "planning officer", "chief", "focal"]
            },
            {
                key : "4",
                label : "Visualizations",
                onClick: () => navigate("/dashboard"),
                role : ["admin", "planning officer", "chief", "focal"]
            },
        ];
        setItems(i.filter(i => {
            return i.role?.includes(authStore.user?.role!)
        }))
    }, [authStore.user])

    return (
        <ConfigProvider theme={configTheme}>
            <Menu

                mode="horizontal"
                style={{
                    flex: 1,
                    justifyContent: "center",
                    // maxWidth: 100,
                    width :" 100%"
                }}
                items={items} />
        </ConfigProvider>
    )
}

export default NavbarMenus;