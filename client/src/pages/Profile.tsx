import Title from "antd/es/typography/Title";
import RouteGuard from "../components/Guards/RouteGuard"
import { Avatar, Card, Flex, List, Result, Select } from "antd";
import { useAuthStore } from "../stores/useAuthStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUser } from "@fortawesome/free-solid-svg-icons";
import Case from "case";
import { useEffect, useState } from "react";
import { getUnitsByQuery } from "../services/api/unitApi";
import { getProgramByQuery } from "../services/api/programApi";
import { focalPersonGetByQuery } from "../services/api/focalPersonApi";
import { generateYearOptionsFixed } from "../services/helper";
import { sectorGetByQuery } from "../services/api/sectorApi";
import _ from "lodash";

const Profile = () => {

    const authStore = useAuthStore();

    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [units, setUnits] = useState<any>([]);
    const [programs, setPrograms] = useState<any>([]);
    const [focals, setFocals] = useState<any>([]);

    const initUserMembership = async () => {
        try {
            const _sectors = await sectorGetByQuery({calendar_year : year}, [{
                path : "programs",
                populate : {
                    path : "units"
                }
            }]);
            const programIds = _.flatMap(_sectors.data, "programs").map(a => a._id);
            const unitIds = _.flatMap(_sectors.data, "programs").flatMap(a => a.units).map(a => a._id);

            const _units = await getUnitsByQuery(
                {
                    unitHead: authStore.user?._id, 
                    deletedAt: null,
                    _id : {
                        $in : unitIds
                    }
                }, []);
            const _programs = await getProgramByQuery(
                {
                    programHead: authStore.user?._id, 
                    deletedAt: null,
                    _id : {
                        $in : programIds
                    }
                }, []);
            const _focals = await focalPersonGetByQuery({
                userId : authStore.user?._id, 
                deletedAt: null,
                unitId : {
                    $in : unitIds
                }
            }, ["unitId"]);

            setUnits(_units.data);
            setPrograms(_programs.data);
            setFocals(_focals.data);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        setFocals([]);
        setUnits([]);
        setPrograms([]);
        initUserMembership();
    }, [year]);
    
    return (
        <RouteGuard>
            <div className="h-full bg-gray-100 p-4">
                <div style={{maxWidth: 800}} className="mx-auto">
                    <Title level={2}>User Profile</Title>
                    <Card className="mb-4">
                        <Flex gap={30} align="center">
                            <Avatar size={80} className="cursor-pointer " src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${authStore.user?.name}`} /> 
                            <div>
                                <Title level={4}>{authStore.user?.name}</Title>
                                <p className="text-gray-500"><FontAwesomeIcon className="me-2" icon={faEnvelope} /> {authStore.user?.email}</p>
                                <p className="text-gray-500"><FontAwesomeIcon className="me-2" icon={faUser} />  {Case.title(authStore.user?.role!)} </p>
                                
                            </div>
                        </Flex>
                    </Card>

                    <Card className="mb-4">
                        <div className="float-right">
                            <Select
                                style={{ width: 100 }}
                                value={year}
                                onChange={(value) => setYear(value)}
                                options={[...generateYearOptionsFixed]}
                                placeholder="Select Year"
                            />
                        </div>
                        <Title level={5} >Designation/s</Title>
                        <br />
                        {
                            units.length > 0 &&
                            (
                                <div className="mb-3">
                                    <List
                                        header={<b>Handled Units</b>}
                                        bordered
                                        itemLayout="horizontal"
                                        dataSource={units}
                                        renderItem={(item : any) => (
                                            <List.Item>
                                                { item.name }
                                            </List.Item>
                                        )}
                                    />
                                </div>
                            )
                        }
                        {
                            programs.length > 0 &&
                            (
                                <div className="mb-3">
                                    <List
                                        header={<b>{"Handled Programs"}</b>}
                                        bordered
                                        itemLayout="horizontal"
                                        dataSource={programs}
                                        renderItem={(item:any) => (
                                            <List.Item>
                                                {item.name}
                                            </List.Item>
                                        )}
                                    />
                                </div>
                            )
                        }
                        {
                            focals.length > 0 &&
                            (
                                <div className="mb-3">
                                    <List
                                        bordered
                                        header={<b>{"Units Assigned"}</b>}
                                        itemLayout="horizontal"
                                        dataSource={focals}
                                        renderItem={(item:any) => (
                                            <List.Item>
                                                {item.unitId.name}
                                            </List.Item>
                                        )}
                                    />
                                </div>
                            )
                        }

                        { 
                            (units.length == 0 && programs.length == 0 && focals.length == 0) && (<Result extra="No Designations Found"  />)
                        }
                    </Card>

                    
                </div>
            </div>  
        </RouteGuard>
    )
}

export default Profile;