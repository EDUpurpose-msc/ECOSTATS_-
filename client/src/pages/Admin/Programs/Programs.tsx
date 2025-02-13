import { Button, Card, Col, Drawer, Flex, Grid, Input, Layout, message, Row, Select, Space, Statistic } from "antd";
import Title from "antd/es/typography/Title";
import CreateProgram from "../../../components/Admin/Programs/CreateProgram";
import CreateUnit from "../../../components/Admin/Programs/CreateUnit";
import AssignHeads from "../../../components/Admin/Programs/AssignHeads";
import { useEffect, useState } from "react";
import ProgramLists from "../../../components/Admin/Programs/ProgramLists";
import { countPrograms } from "../../../services/api/programApi";
import { countUnits } from "../../../services/api/unitApi";
import UnitsList from "../../../components/Admin/Programs/UnitsList";
import RoleGuard from "../../../components/Guards/RoleGuard";
import { generateYearOptionsFixed } from "../../../services/helper";
import { parseResError } from "../../../services/errorHandler";
import { sectorGetByQuery } from "../../../services/api/sectorApi";


const Programs = () => {

    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [sectors, setSectors] = useState<any[]>([]);    

    const [drawerStates, setDraweStates] = useState({
        newProgram : false,
        newUnit : false,
        assignHead : false
    });
    
    const [messageApi, contextHolder] = message.useMessage();

    const [count, setCount] = useState({
        programs : 0,
        units : 0
    })
    

    useEffect(() => {
        (async () => {

            try {
                const program = (await countPrograms(year)).data
                const unit = (await countUnits(year)).data
                setCount({
                        programs : program,
                        units : unit
                })
            } catch (err) {
                console.log(err)
                messageApi.error("Unexpected Error Occured")
            } 

        })()
    }, [year])

    const fetchSectors = async () => {
        try {
            const _sectors = (await sectorGetByQuery({ calendar_year : year}, [])).data;
            console.log(_sectors);
            setSectors(_sectors);
        } catch (error) {
            message.error(parseResError(error).msg);
        }
    }

    useEffect(() => {
        fetchSectors();
    }, [year]);

    return (
        <RoleGuard role={["admin", "planning officer"]}>
            { contextHolder }
            <Flex className="w-full" justify="end">
                <Select  value={year} onChange={(e) => setYear(e)} options={generateYearOptionsFixed} />
            </Flex>
            <Title level={3} >Division</Title>
            <div className="">
                <Layout>
                    <Layout>
                        <Space>
                            <Card bordered={false}>
                                <Statistic
                                title="Divisions"
                                value={count.programs}
                                valueStyle={{ color: '#3f8600' }}
                                />
                            </Card>
                            <Card bordered={false}>
                                <Statistic
                                title="Units"
                                value={count.units}
                                valueStyle={{ color: '#3f8600' }}
                                />
                            </Card>
                        </Space>
                    </Layout>
                    <br />
                    <Layout>
                        <Space className="mb-4">
                            <Button  type="primary" className="w-fit" onClick={() => setDraweStates({...drawerStates, newProgram:true})}>Create Division</Button>
                            <Button type="primary" className="w-fit" onClick={() => setDraweStates({...drawerStates, newUnit:true})}>Create Unit</Button>
                            <Button className="w-fit" onClick={() => setDraweStates({...drawerStates, assignHead:true})}>Assign Head</Button>
                        </Space>
                        <ProgramLists year={year}  />
                        <div id="units">
                            <UnitsList />
                        </div>
                    </Layout>
                </Layout>
            </div>

            <Drawer open={drawerStates.newProgram} onClose={() => setDraweStates({...drawerStates, newProgram:false})} >
                <CreateProgram sectors={sectors} />
            </Drawer>
            <Drawer open={drawerStates.newUnit} onClose={() => setDraweStates({...drawerStates, newUnit:false})} >
                <CreateUnit />
            </Drawer>
            <Drawer open={drawerStates.assignHead} onClose={() => setDraweStates({...drawerStates, assignHead:false})} >
                <AssignHeads />
            </Drawer>
        </RoleGuard>
    );
}

export default Programs;