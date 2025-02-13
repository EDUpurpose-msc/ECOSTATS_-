import { Badge, ConfigProvider, Menu, message, Select, ThemeConfig } from "antd";
import Sider from "antd/es/layout/Sider";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarUser from "../SidebarUser";
import { FormEnum, Sector } from "../../types/forms/formNameEnum";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faList, faMagnifyingGlass, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "../../stores/useAuthStore";
import { getProgramByQuery } from "../../services/api/programApi";
import { getUnitsByQuery } from "../../services/api/unitApi";
import _ from "lodash";
import { focalPersonGetByQuery } from "../../services/api/focalPersonApi";
import { parseResError } from "../../services/errorHandler";
import { sectorGetByQuery } from "../../services/api/sectorApi";
import { reportConfigGetByQuery } from "../../services/api/reportConfigApi";
import { generateYearOptionsFixed } from "../../services/helper";
import { getReportCount } from "../../services/api/userApi";
import { useReportCountStore } from "../../stores/useUserStore";
import { flattenReports } from "../Admin/Configurations/EditClassification";



export const generateMenu = (data, navigate, menuStyle, url) => {
    const configs : any[] = data.configs;
    const flatConfigs = flattenReports(data.classification);
    // Helper function to recursively process classifications
    const processClassifications = (classifications) => {
        return classifications.map((classification) => {
            const hasReports = classification.reports && classification.reports.length > 0;
            const hasSubClassifications = classification.classifications && classification.classifications.length > 0;

            // If classification has reports, create menu items for each report
            const reportItems = hasReports
                ? classification.reports.map((report) => ({
                      key: report, // Assuming 'name' array has IDs
                      label: configs.find(c => c._id == report).name, // Replace with the report name if available
                      style: menuStyle,
                      onClick: () => navigate(`${url}/${report}`)
                  }))
                : [];

            // If classification has sub-classifications, recursively process them
            const subClassificationItems = hasSubClassifications
                ? processClassifications(classification.classifications)
                : [];

            // Create a parent menu item for the classification, including its children
            return {
                key: classification.name,
                label: classification.name,
                children: [...reportItems, ...subClassificationItems],
                style: menuStyle
            };
        });
    };

    // Start processing from the root data
    console.log(data.classification.classifications);
    const items = processClassifications(data.classification.classifications || []);
    return [...items, ...configs.filter(c => !flatConfigs.includes(c._id)).map(c => ({
        key: c._id,
        label: c.name,
        style: menuStyle,
        onClick: () => navigate(`${url}/${c._id}`)  
    }))];

};


const ReportsSidebar = ({open}) => {
    const navigate = useNavigate();
    const authStore = useAuthStore();
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const reportCountStore = useReportCountStore();

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
            },
            // "Select": {
            //     "colorText": "rgb(255,254,254)",
            //     "colorIcon": "rgb(211,211,211)",
            //     "colorBgElevated": "rgb(81,141,84)",
            //     "optionSelectedBg": "rgb(145,210,113)",
            // }
        }
    }

    useEffect(() => setCollapsed(open), [open]);

    // const initReportCount = async () => {
    //     if(["planning officer", "chief"].includes(authStore.user?.role!)){
    //         const reportCount = (await getReportCount(authStore.user?._id!)).data;
    //         reportCountStore.setReportCount(reportCount);
    //     }
    // }

    // useEffect(() => {
    //     initReportCount();
    // }, [reportCountStore.refresh, authStore.user]);
    

    const initSidebar = async () => {
        try {
            const it : any[] = [];
            if(["planning officer", "chief"].includes(authStore.user?.role!)){
                const reportCount = (await getReportCount(authStore.user?._id!)).data;
                reportCountStore.setReportCount(reportCount);
                it.push({
                    key: "reports",
                    label : "Reports",
                    icon : <FontAwesomeIcon icon={faFile} />,
                    style: menuStyle1,
                    children : [
                        {
                            key : "to-review",
                            label : "To Review",
                            icon: <div><Badge status="success" count={reportCount?.toReview ? reportCount?.toReview : 0}/></div>,
                            style: menuStyle2,
                            onClick : () => navigate(`/reports/to-review`),
                        },
                        {
                            key : "to-approve",
                            label : "To Approve",
                            icon: <div><Badge status="success"  count={reportCount?.toApprove ? reportCount?.toApprove : 0}/></div>,
                            style: menuStyle2,
                            onClick : () => navigate(`/reports/to-approve`)
                        },
                    ]
                });
            }

   
    
            
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
            console.log("sectors", sectors);
            sectors.forEach( (sector) => {
                if(["planning officer", "admin"].includes(authStore.user?.role!) || [...programs.map(a => a.sector_id), ...units.map(a => a.programId.sector_id), ...fp.map(a => a.unitId.programId.sector_id)].includes(sector._id)){
                    it.push({
                        key: sector._id,
                        label : sector.name,
                        icon : <FontAwesomeIcon icon={faFile} />,
                        style: menuStyle1,
                        children : sector.classification ? generateMenu(sector, navigate, menuStyle2, "/reports/report")  : sector.configs?.map((config : any) => {
                            return {
                                key : config._id,
                                label : config.name,
                                style : menuStyle2,
                                onClick : () => navigate(`/reports/report/${config._id}`)
                            }
                        })
                    });
                }
            })
    
            // const sectorAccess = [...programs.data.map(a => a.management), ...units.data.map(a => a.programId.management), ...fp.data.map(a => a.unitId.programId.management)]
            // if(sectorAccess.includes(Sector.LAND) || ["planning officer", "admin"].includes(authStore.user?.role!)){
            //     it.push({
            //         key: Sector.LAND,
            //         label: "Land Sector",
            //         icon: <FontAwesomeIcon icon={faList} />,
            //         style: menuStyle1,
            //         role : ["admin", "planning officer", "chief", "focal"],
            //         children : [
            //             {
            //                 key  : "Land Management",
            //                 label : "A. Land Management",
            //                 style : menuStyle2,
            //                 children : [
            //                     {
            //                         key : FormEnum.LAND_1,
            //                         label : "Table 1. Land Area",
            //                         style  : menuStyle2,
            //                         onClick : () => navigate(`/reports/${Sector.LAND}/${FormEnum.LAND_1}`)
            //                     },
            //                     {
            //                         key : FormEnum.LAND_2,
            //                         label : "Table 2. Patrimonial Properties",
            //                         style  : menuStyle2,
            //                         onClick : () => navigate(`/reports/${Sector.LAND}/${FormEnum.LAND_2}`)
            //                     },
            //                 ]
            //             },
            //             {
            //                 key: "Land Management Disposition",
            //                 label: "B. Land Management Disposition",
            //                 style: menuStyle2,
            //                 children : [
            //                     {
            //                         key : "Patentatable Land Disposition",
            //                         label : "a. Patentatable Land Disposition",
            //                         children : [
            //                             {
            //                                 key : FormEnum.LAND_3,
            //                                 label : "Table 3. Residential Free Patent Issued",
            //                                 style  : menuStyle2,
            //                                 onClick : () => navigate(`/reports/${Sector.LAND}/${FormEnum.LAND_3}`)
            //                             },
            //                             {
            //                                 key : FormEnum.LAND_4,
            //                                 label : "Table 4. Agricultural Free Patent Issued",
            //                                 style  : menuStyle2,
            //                                 onClick : () => navigate(`/reports/${Sector.LAND}/${FormEnum.LAND_4}`)
            //                             },
            //                             {
            //                                 key : FormEnum.LAND_5,
            //                                 label : "Table 5. Homestead",
            //                                 style  : menuStyle2,
            //                                 onClick : () => navigate(`/reports/${Sector.LAND}/${FormEnum.LAND_5}`)
            //                             },
            //                         ]
            //                     },
            //                     {
            //                         key: "Non-Patentatable Land Disposition",
            //                         label: "b. Non-Patentatable Land Disposition",
            //                         children : [
            //                             {
            //                                 key : FormEnum.LAND_6,
            //                                 label : "Table 6. List of Special Patent of LGUs and NGAs",
            //                                 style  : menuStyle2,
            //                                 onClick : () => navigate(`/reports/${Sector.LAND}/${FormEnum.LAND_6}`)
            //                             },
            //                             {
            //                                 key : FormEnum.LAND_7,
            //                                 label : "Table 7. Management of Foreshore Areas",
            //                                 style  : menuStyle2,
            //                                 onClick : () => navigate(`/reports/${Sector.LAND}/${FormEnum.LAND_7}`)
            //                             },
            //                         ]
            //                     }
            //                 ]
            //             },
            //         ]
            //     })
            // }
            // if(sectorAccess.includes(Sector.FORESTRY) || ["planning officer", "admin"].includes(authStore.user?.role!)){
            //     it.push({
            //         key: Sector.FORESTRY,
            //         label: "Forestry Sector",
            //         icon: <FontAwesomeIcon icon={faList} />,
            //         style: menuStyle1,
            //         role : ["admin", "planning officer", "chief", "focal"],
            //         children: [
            //             {
            //                 key : "Forest Resources",
            //                 label : "A. Forest Resources",
            //                 style  : menuStyle2,
            //                 children : [
            //                     {
            //                         key : FormEnum.FORESTRY_1,
            //                         label : "Table 1. Land Classification",
            //                         style  : menuStyle2,
            //                         onClick : () => navigate(`/reports/${Sector.FORESTRY}/${FormEnum.FORESTRY_1}`)
            //                     },
            //                     {
            //                         key : FormEnum.FORESTRY_2,
            //                         label : "Table 2. Land Cover",
            //                         style  : menuStyle2,
            //                         onClick : () => navigate(`/reports/${Sector.FORESTRY}/${FormEnum.FORESTRY_2}`)
            //                     },
            //                     {
            //                         key : FormEnum.FORESTRY_3,
            //                         label : "Table 3. Production and Protection Forest (Hectares)",
            //                         style  : menuStyle2,
            //                         onClick : () => navigate(`/reports/${Sector.FORESTRY}/${FormEnum.FORESTRY_3}`)
            //                     },
            //                     {
            //                         key : FormEnum.FORESTRY_4,
            //                         label : "Table 4. Proclaimed Watershed Forest Reserve",
            //                         style  : menuStyle2,
            //                         onClick : () => navigate(`/reports/${Sector.FORESTRY}/${FormEnum.FORESTRY_4}`)
            //                     },
            //                     {
            //                         key : FormEnum.FORESTRY_5,
            //                         label : "Table 5. Priority Critical Watershed Supporting National Irrigation System",
            //                         style  : menuStyle2,
            //                         onClick : () => navigate(`/reports/${Sector.FORESTRY}/${FormEnum.FORESTRY_5}`)
            //                     },
            //                 ]
            //             },
            //             {
            //                 key: "Tenural Instruments",
            //                 label: "B. Tenural Instruments",
            //                 style  : menuStyle2,
            //                 children: [
            //                     {
            //                         key: FormEnum.FORESTRY_6,
            //                         label: "Table 6. Existing Community-Based Forest Management Agreement",
            //                         style: menuStyle2,
            //                         onClick: () => navigate(`/reports/${Sector.FORESTRY}/${FormEnum.FORESTRY_6}`)
            //                     },
            //                     {
            //                         key: FormEnum.FORESTRY_7,
            //                         label: "Table 7. Community Forest Stewardship Agreement",
            //                         style: menuStyle2,
            //                         onClick: () => navigate(`/reports/${Sector.FORESTRY}/${FormEnum.FORESTRY_7}`)
            //                     },
            //                     {
            //                         key: FormEnum.FORESTRY_8,
            //                         label: "Table 8. Existing Agroforestry Land Management Agreement",
            //                         style: menuStyle2,
            //                         onClick: () => navigate(`/reports/${Sector.FORESTRY}/${FormEnum.FORESTRY_8}`)
            //                     },
            //                     {
            //                         key: FormEnum.FORESTRY_9,
            //                         label: "Table 9. Existing Integrated Social Forestry (ISF)",
            //                         style: menuStyle2,
            //                         onClick: () => navigate(`/reports/${Sector.FORESTRY}/${FormEnum.FORESTRY_9}`)
            //                     },
            //                     {
            //                         key: FormEnum.FORESTRY_10,
            //                         label: "Table 10. Forest land Grazing Lease Agreement (FLGLA)",
            //                         style: menuStyle2,
            //                         onClick: () => navigate(`/reports/${Sector.FORESTRY}/${FormEnum.FORESTRY_10}`)
            //                     },
            //                     {
            //                         key: FormEnum.FORESTRY_11,
            //                         label: "Table 11. Existing Forest Land Grazing Management Agreement (FLGMA)",
            //                         style: menuStyle2,
            //                         onClick: () => navigate(`/reports/${Sector.FORESTRY}/${FormEnum.FORESTRY_11}`)
            //                     },
            //                     {
            //                         key: FormEnum.FORESTRY_12,
            //                         label: "Table 12. Existing Forest Land Management Agreement (FLMA)",
            //                         style: menuStyle2,
            //                         onClick: () => navigate(`/reports/${Sector.FORESTRY}/${FormEnum.FORESTRY_12}`)
            //                     },
            //                     {
            //                         key: FormEnum.FORESTRY_13,
            //                         label: "Table 13. Existing Forest Land Protection Agreement (FLPA)",
            //                         style: menuStyle2,
            //                         onClick: () => navigate(`/reports/${Sector.FORESTRY}/${FormEnum.FORESTRY_13}`)
            //                     },
            //                     {
            //                         key: FormEnum.FORESTRY_14,
            //                         label: "Table 14. Existing Forest Land Use Agreement for Tourism Purposes (FLAgT)",
            //                         style: menuStyle2,
            //                         onClick: () => navigate(`/reports/${Sector.FORESTRY}/${FormEnum.FORESTRY_14}`)
            //                     },
            //                     {
            //                         key: FormEnum.FORESTRY_15,
            //                         label: "Table 15. Existing Integrated Forest Management Agreement (IFMA)",
            //                         style: menuStyle2,
            //                         onClick: () => navigate(`/reports/${Sector.FORESTRY}/${FormEnum.FORESTRY_15}`)
            //                     },
            //                     {
            //                         key: FormEnum.FORESTRY_16,
            //                         label: "Table 16. Industrial Tree Plantation Lease Agreement (ITPLA)",
            //                         style: menuStyle2,
            //                         onClick: () => navigate(`/reports/${Sector.FORESTRY}/${FormEnum.FORESTRY_16}`)
            //                     },
            //                     {
            //                         key: FormEnum.FORESTRY_17,
            //                         label: "Table 17. Gratuitous Permit for the Special Uses of Forest Lands (GSUP)",
            //                         style: menuStyle2,
            //                         onClick: () => navigate(`/reports/${Sector.FORESTRY}/${FormEnum.FORESTRY_17}`)
            //                     },
            //                     {
            //                         key: FormEnum.FORESTRY_18,
            //                         label: "Table 18. Socialized Industrial Forest Management Agreement (SIFMA)",
            //                         style: menuStyle2,
            //                         onClick: () => navigate(`/reports/${Sector.FORESTRY}/${FormEnum.FORESTRY_18}`)
            //                     },
            //                     {
            //                         key: FormEnum.FORESTRY_19,
            //                         label: "Table 19. Special Land Use Permit (SLUP)",
            //                         style: menuStyle2,
            //                         onClick: () => navigate(`/reports/${Sector.FORESTRY}/${FormEnum.FORESTRY_19}`)
            //                     }
                                
                                
            //                 ]
            //             },
                        
            //             {
            //                 key : FormEnum.FORESTRY_24,
            //                 label : "Table 24. Issued Chainsaw Registration",
            //                 style  : menuStyle2,
            //                 onClick : () => navigate(`/reports/${Sector.FORESTRY}/${FormEnum.FORESTRY_24}`)
            //             },
            //         ]
            //     })
            // }
            // if(sectorAccess.includes(Sector.BIODIVERSITY) || ["planning officer", "admin"].includes(authStore.user?.role!)){
            //     it.push({
            //         key: Sector.BIODIVERSITY,
            //         label: "Biodiversity Sector",
            //         icon: <FontAwesomeIcon icon={faList} />,
            //         style: menuStyle1,
            //         role : ["admin", "planning officer", "chief", "focal"],
            //         children: [
            //             {
            //                 key: "Coastal Resource Management",
            //                 label: "B. Coastal Resource Management",
            //                 style: menuStyle2,
            //                 children : [
            //                     {
            //                         key : FormEnum.BIODIVERSITY_2,
            //                         label : "Table 2. Area Distribution of Coastal Resources",
            //                         style  : menuStyle2,
            //                         onClick : () => navigate(`/reports/${Sector.BIODIVERSITY}/${FormEnum.BIODIVERSITY_2}`)
            //                     },
            //                     {
            //                         key : FormEnum.BIODIVERSITY_3,
            //                         label : "Table 3. Inventory of Coral Reef",
            //                         style  : menuStyle2,
            //                         onClick : () => navigate(`/reports/${Sector.BIODIVERSITY}/${FormEnum.BIODIVERSITY_3}`)
            //                     },
            //                     {
            //                         key : FormEnum.BIODIVERSITY_4,
            //                         label : "Table 4. Inventory of Seagrass",
            //                         style  : menuStyle2,
            //                         onClick : () => navigate(`/reports/${Sector.BIODIVERSITY}/${FormEnum.BIODIVERSITY_4}`)
            //                     },
            //                     {
            //                         key : FormEnum.BIODIVERSITY_5,
            //                         label : "Table 5. Mangrove Assessment",
            //                         style  : menuStyle2,
            //                         onClick : () => navigate(`/reports/${Sector.BIODIVERSITY}/${FormEnum.BIODIVERSITY_5}`)
            //                     },
            //                     {
            //                         key : FormEnum.BIODIVERSITY_6,
            //                         label : "Table 6. Mangrove Area Rehabilitated",
            //                         style  : menuStyle2,
            //                         onClick : () => navigate(`/reports/${Sector.BIODIVERSITY}/${FormEnum.BIODIVERSITY_6}`)
            //                     },
            //                     {
            //                         key : FormEnum.BIODIVERSITY_7,
            //                         label : "Table 7. Livelihood Projects Implemented in Coastal Areas",
            //                         style  : menuStyle2,
            //                         onClick : () => navigate(`/reports/${Sector.BIODIVERSITY}/${FormEnum.BIODIVERSITY_7}`)
            //                     },
            //                 ]
            //             },
            //             {
            //                 key : "Biodiversity Conservation and Wildlife Management",
            //                 label : "C. Biodiversity Conservation and Wildlife Management",
            //                 style  : menuStyle2,
            //                 children : [
            //                     {
            //                         key : "Caves and Inland Wetlands",
            //                         label : "a. Caves and Inland Wetlands",
            //                         children : [
            //                             {
            //                                 key : FormEnum.BIODIVERSITY_8,
            //                                 label : "Table 8. Inland Wetland in the Region",
            //                                 style  : menuStyle2,
            //                                 onClick : () => navigate(`/reports/${Sector.BIODIVERSITY}/${FormEnum.BIODIVERSITY_8}`)
            //                             },
            //                             {
            //                                 key : FormEnum.BIODIVERSITY_9,
            //                                 label : "Table 9. Classified Caves",
            //                                 style  : menuStyle2,
            //                                 onClick : () => navigate(`/reports/${Sector.BIODIVERSITY}/${FormEnum.BIODIVERSITY_9}`)
            //                             },
            //                         ]
            //                     },
            //                     {
            //                         key : "Critical Habitats",
            //                         label : "b. Critical Habitats",
            //                         children : [
            //                             {
            //                                 key : FormEnum.BIODIVERSITY_10,
            //                                 label : "Table 10. Identified/Assessed Critical Habitats",
            //                                 style  : menuStyle2,
            //                                 onClick : () => navigate(`/reports/${Sector.BIODIVERSITY}/${FormEnum.BIODIVERSITY_10}`)
            //                             },
            //                         ]
            //                     },
            //                     {
            //                         key : "Wildlife Registration and Permits",
            //                         label : "c. Wildlife Registration and Permits",
            //                         children : [
            //                             {
            //                                 key : FormEnum.BIODIVERSITY_11,
            //                                 label : "Table 11. Certificate of Wildlife Registration",
            //                                 style  : menuStyle2,
            //                                 onClick : () => navigate(`/reports/${Sector.BIODIVERSITY}/${FormEnum.BIODIVERSITY_11}`)
            //                             },
            //                             {
            //                                 key : FormEnum.BIODIVERSITY_12,
            //                                 label : "Table 12. Wildlife Import/Export/Re-Export Permit",
            //                                 style  : menuStyle2,
            //                                 onClick : () => navigate(`/reports/${Sector.BIODIVERSITY}/${FormEnum.BIODIVERSITY_12}`)
            //                             },
            //                             {
            //                                 key : FormEnum.BIODIVERSITY_15,
            //                                 label : "Table 15. Wildlife Collector's Permit (WCP)",
            //                                 style  : menuStyle2,
            //                                 onClick : () => navigate(`/reports/${Sector.BIODIVERSITY}/${FormEnum.BIODIVERSITY_15}`)
            //                             },
            //                             {
            //                                 key : FormEnum.BIODIVERSITY_16,
            //                                 label : "Table 16. Gratuitous Permit (GP)",
            //                                 style  : menuStyle2,
            //                                 onClick : () => navigate(`/reports/${Sector.BIODIVERSITY}/${FormEnum.BIODIVERSITY_16}`)
            //                             },
            //                             {
            //                                 key : FormEnum.BIODIVERSITY_17,
            //                                 label : "Table 17. Wildlife Special Use Permit",
            //                                 style  : menuStyle2,
            //                                 onClick : () => navigate(`/reports/${Sector.BIODIVERSITY}/${FormEnum.BIODIVERSITY_17}`)
            //                             },
            //                             {
            //                                 key : FormEnum.BIODIVERSITY_19,
            //                                 label : "Table 19. Wildlife Farm Permit",
            //                                 style  : menuStyle2,
            //                                 onClick : () => navigate(`/reports/${Sector.BIODIVERSITY}/${FormEnum.BIODIVERSITY_19}`)
            //                             },
            //                             {
            //                                 key : FormEnum.BIODIVERSITY_20,
            //                                 label : "Table 20. Wildlife Culture Permit",
            //                                 style  : menuStyle2,
            //                                 onClick : () => navigate(`/reports/${Sector.BIODIVERSITY}/${FormEnum.BIODIVERSITY_20}`)
            //                             },
            //                             {
            //                                 key : FormEnum.BIODIVERSITY_21,
            //                                 label : "Table 21. Clearance to Operate (for Zoological Parks and Botanical Gardens)",
            //                                 style  : menuStyle2,
            //                                 onClick : () => navigate(`/reports/${Sector.BIODIVERSITY}/${FormEnum.BIODIVERSITY_21}`)
            //                             },
            //                         ]
            //                     },
            //                     {
            //                         key : "Flora and Fauna", 
            //                         label : "d. Flora and Fauna",
            //                         children : [
            //                             {
            //                                 key : FormEnum.BIODIVERSITY_22,
            //                                 label : "Table 22. Known Fauna Species by Taxonomic Group",
            //                                 style  : menuStyle2,
            //                                 onClick : () => navigate(`/reports/${Sector.BIODIVERSITY}/${FormEnum.BIODIVERSITY_22}`)
            //                             },
            //                             {
            //                                 key : FormEnum.BIODIVERSITY_23,
            //                                 label : "Table 23. Known Flora Species by Taxonomic Group",
            //                                 style  : menuStyle2,
            //                                 onClick : () => navigate(`/reports/${Sector.BIODIVERSITY}/${FormEnum.BIODIVERSITY_23}`)
            //                             },
            //                             {
            //                                 key : FormEnum.BIODIVERSITY_24,
            //                                 label : "Table 24. Endemic Fauna Species by Taxonomic Group",
            //                                 style  : menuStyle2,
            //                                 onClick : () => navigate(`/reports/${Sector.BIODIVERSITY}/${FormEnum.BIODIVERSITY_24}`)
            //                             },
            //                             {
            //                                 key : FormEnum.BIODIVERSITY_25,
            //                                 label : "Table 25. Endemic Flora Species by Taxonomic Group",
            //                                 style  : menuStyle2,
            //                                 onClick : () => navigate(`/reports/${Sector.BIODIVERSITY}/${FormEnum.BIODIVERSITY_25}`)
            //                             },
            //                             {
            //                                 key : FormEnum.BIODIVERSITY_26,
            //                                 label : "Table 26. Wild Flora Confiscation",
            //                                 style  : menuStyle2,
            //                                 onClick : () => navigate(`/reports/${Sector.BIODIVERSITY}/${FormEnum.BIODIVERSITY_26}`)
            //                             },
            //                             {
            //                                 key : FormEnum.BIODIVERSITY_27,
            //                                 label : "Table 27. Wild Fauna Confiscation",
            //                                 style  : menuStyle2,
            //                                 onClick : () => navigate(`/reports/${Sector.BIODIVERSITY}/${FormEnum.BIODIVERSITY_27}`)
            //                             },
            //                             {
            //                                 key : FormEnum.BIODIVERSITY_28,
            //                                 label : "Table 28. Wild Fauna Retrieval and Donation",
            //                                 style  : menuStyle2,
            //                                 onClick : () => navigate(`/reports/${Sector.BIODIVERSITY}/${FormEnum.BIODIVERSITY_28}`)
            //                             },
            //                             {
            //                                 key : FormEnum.BIODIVERSITY_29,
            //                                 label : "Table 29. Wild Flora Retrieval and Donation",
            //                                 style  : menuStyle2,
            //                                 onClick : () => navigate(`/reports/${Sector.BIODIVERSITY}/${FormEnum.BIODIVERSITY_29}`)
            //                             },
            //                         ]
            //                     },
            //                     {
            //                         key : "Wildlife Rescue and Retrieval",
            //                         label : "e. Wildlife Rescue and Retrieval",
            //                         children : [
            //                             {
            //                                 key : FormEnum.BIODIVERSITY_30,
            //                                 label : "Table 30. Inventory of Wildlife at DENR Established Wildlife Rescue Centers",
            //                                 style  : menuStyle2,
            //                                 onClick : () => navigate(`/reports/${Sector.BIODIVERSITY}/${FormEnum.BIODIVERSITY_30}`)
            //                             },
            //                             {
            //                                 key : FormEnum.BIODIVERSITY_31,
            //                                 label : "Table 31. Population of Threatened Species",
            //                                 style  : menuStyle2,
            //                                 onClick : () => navigate(`/reports/${Sector.BIODIVERSITY}/${FormEnum.BIODIVERSITY_31}`)
            //                             },
            //                             {
            //                                 key : FormEnum.BIODIVERSITY_32,
            //                                 label : "Table 32. Marine Turtles Tagged and Released",
            //                                 style  : menuStyle2,
            //                                 onClick : () => navigate(`/reports/${Sector.BIODIVERSITY}/${FormEnum.BIODIVERSITY_32}`)
            //                             },
            //                             {
            //                                 key : FormEnum.BIODIVERSITY_33,
            //                                 label : "Table 33. Stranded Marine Turtle",
            //                                 style  : menuStyle2,
            //                                 onClick : () => navigate(`/reports/${Sector.BIODIVERSITY}/${FormEnum.BIODIVERSITY_33}`)
            //                             },
            //                         ]
            //                     }
            //                 ]
            //             }, 
            //         ]
            //     })
            // }
    
            setItems(it);
        } catch (error) {
            message.error(parseResError(error).msg)
        }
    }

    useEffect(()=>{
        initSidebar();
    }, [authStore.user, year, reportCountStore.refresh]);

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
                        <div className="w-full " >
                            <Select   value={year} className="block ms-auto me-0 w-fit"    options={generateYearOptionsFixed} onChange={e => setYear(e)} />
                        </div>
                        <Menu
                            className="w-full"
                            mode="inline"
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['sub1']}
                            style={{ borderRight: 0}}
                            items={items}
                            
                        />
                    </div>
                </Sider>
            </ConfigProvider>
        </>
    )
}

export default ReportsSidebar;