import { Checkbox, Col, Form, Input, Row } from "antd";
import Title from "antd/es/typography/Title";


const AddNewRole = () => {
    const lands = [
        {
            label : "Table 1",
            name : "land_1",
        },
        {
            label : "Table 2",
            name : "land_2",
        },
        {
            label : "Table 3",
            name : "land_3",
        },
        {
            label : "Table 4",
            name : "land_4",
        },
        {
            label : "Table 5",
            name : "land_5",
        },
        {
            label : "Table 6",
            name : "land_6",
        },
        {
            label : "Table 7",
            name : "land_7",
        },
    ];

    const forestry = [
        {
            label : "Table 1",
            name : "forestry_1",
        },
        {
            label : "Table 2",
            name : "forestry_2",
        },
        {
            label : "Table 3",
            name : "forestry_3",
        },
        {
            label : "Table 4",
            name : "forestry_4",
        },
        {
            label : "Table 5",
            name : "forestry_5",
        },
        {
            label : "Table 24",
            name : "forestry_24",
        },
    ];

    const biodiversity = [
        // {
        //     label : "Table 1",
        //     name : "biodiversity_1",
        // },
        {
            label : "Table 2",
            name : "biodiversity_2",
        },
        {
            label : "Table 3",
            name : "biodiversity_3",
        },
        {
            label : "Table 4",
            name : "biodiversity_4",
        },
        {
            label : "Table 5",
            name : "biodiversity_5",
        },
        {
            label : "Table 6",
            name : "biodiversity_6",
        },
        {
            label : "Table 7",
            name : "biodiversity_7",
        },
        {
            label : "Table 8",
            name : "biodiversity_8",
        },
        {
            label : "Table 9",
            name : "biodiversity_9",
        },
    ];
    return (
        <>
            <Form title="Create New Role">
                <Form.Item name="name" label="Role Name">
                    <Input />
                </Form.Item>
                <Title level={5}>Land Management</Title>
                <Row>
                {
                    lands.map(l => {
                        return (
                            <Col span={24} key={l.name}>
                                <Form.Item name={l.name} valuePropName="checked" noStyle>
                                <Checkbox>{l.label}</Checkbox>
                                </Form.Item>
                            </Col>
                        )
                    })
                }
                </Row>

                <Title level={5}>Forestry Management</Title>
                <Row>
                {
                    forestry.map(l => {
                        return (
                            <Col span={24} key={l.name}>
                                <Form.Item name={l.name} valuePropName="checked" noStyle>
                                <Checkbox>{l.label}</Checkbox>
                                </Form.Item>
                            </Col>
                        )
                    })
                }
                </Row>
            </Form>
        </>
    )
}

const RolesPermission = () => {
    return (
        <>
            <Title level={3} >Roles & Permissions</Title>

            <AddNewRole />
        </>
    )
}

export default RolesPermission;