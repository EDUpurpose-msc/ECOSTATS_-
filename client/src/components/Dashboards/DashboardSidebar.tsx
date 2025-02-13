import { ConfigProvider, Menu, message, Select, ThemeConfig } from "antd";
import Sider from "antd/es/layout/Sider";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarUser from "../SidebarUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartBar, faChartLine, faChartSimple, faFile } from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "../../stores/useAuthStore";
import _ from "lodash"
import Title from "antd/es/typography/Title";
import { parseResError } from "../../services/errorHandler";
import { getProgramByQuery } from "../../services/api/programApi";
import { getUnitsByQuery } from "../../services/api/unitApi";
import { focalPersonGetByQuery } from "../../services/api/focalPersonApi";
import { sectorGetByQuery } from "../../services/api/sectorApi";
import { generateYearOptionsFixed } from "../../services/helper";
import { generateMenu } from "../Reports/ReportsSidebar";

const DashboardSidebar = ({open}) => {
    const navigate = useNavigate();
    const authStore = useAuthStore();

    const [year, setYear] = useState<number>(new Date().getFullYear());

    const [collapsed, setCollapsed] = useState(true);

    const menuStyle1 : React.CSSProperties = {
        fontWeight: "bold"
    };
    const menuStyle2 : React.CSSProperties = {
        fontWeight: "normal"
    };

    const [items, setItems] = useState<any[]>([
       
    ]);

    const theme : ThemeConfig = {
        "token": {
            "colorPrimary": "#254d27",
            "colorInfo": "#254d27",
            "wireframe": false
        },
        "components": {
            "Layout": {
                "siderBg": "rgb(37,77,39)",
                "algorithm": true
            },
            "Menu": {
                "itemBg": "rgb(37,77,39)",
                "itemColor": "rgba(255,255,255,0.88)",
                "itemDisabledColor": "rgba(189,189,189,0.25)",
                "itemHoverBg": "rgba(25,111,29,0.92)",
                "itemHoverColor": "rgba(215,215,215,0.88)",
                "itemSelectedBg": "rgb(29,156,36)",
                "itemSelectedColor": "rgb(255,255,255)",
                "itemActiveBg": "rgb(30,120,34)",
                "groupTitleColor": "rgba(255,255,255,0.67)"
            }
        }
    }

    useEffect(() => setCollapsed(open), [open]);

    const initSidebar = async () => {
        try {
            const it : any[] = [];
    
            const programs : any[] = (await getProgramByQuery({programHead : authStore.user?._id!, deletedAt : null}, [])).data;
            const units : any[] = (await getUnitsByQuery({unitHead : authStore.user?._id!, deletedAt : null}, ["programId"])).data;
            const fp : any[] = (await focalPersonGetByQuery(
                {
                    userId : authStore.user?._id,
                    deletedAt : null
                }, 
                [
                    {
                        path: "unitId",
                        populate : {
                            path: "programId"
                        }
                    }
                ]
            )).data;
            const sectors = (await sectorGetByQuery({calendar_year : year}, ["configs", "classification"])).data;
            
            sectors.forEach( (sector) => {
                if(["planning officer", "admin"].includes(authStore.user?.role!) || [...programs.map(a => a.sector_id), ...units.map(a => a.programId.sector_id), ...fp.map(a => a.unitId.programId.sector_id)].includes(sector._id)){
                    it.push({
                        key: sector._id,
                        label : sector.name,
                        icon : <FontAwesomeIcon icon={faChartSimple} />,
                        style: menuStyle1,
                        children : sector.classification ? generateMenu(sector, navigate, menuStyle2, "/dashboard/report")  : sector.configs?.map((config : any) => {
                            return {
                                key : config._id,
                                label : config.name,
                                style : menuStyle2,
                                onClick : () => navigate(`/dashboard/report/${config._id}`)
                            }
                        })
                    });
                }
            })
    
            setItems(it);
        } catch (error) {
            message.error(parseResError(error).msg)
        }
    }

    useEffect(()=>{
        
        initSidebar();
    }, [authStore.user, year]);

    return (
        <>
        <ConfigProvider
            theme={theme}
            >
            <Sider 
            theme="dark" 
            width="400" 
            className="overflow-y-scroll"
            collapsedWidth={0}
            collapsible
            collapsed={collapsed}
            trigger={null}>
                <div style={{padding: "0.5rem"}} >
                    <SidebarUser />
                    {/* <Title className="my-4" level={5} style={{color: "white"}}>Dashboard</Title> */}
                    <div className="w-full " >
                        <Select   value={year} className="block ms-auto me-0 w-fit"    options={generateYearOptionsFixed} onChange={e => setYear(e)} />
                    </div>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        style={{ borderRight: 0 }}
                        items={items}
                    />
                </div>
            </Sider>
        </ConfigProvider>
</>
    )
}

export default DashboardSidebar;