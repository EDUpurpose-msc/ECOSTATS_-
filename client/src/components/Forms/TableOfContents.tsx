
import { Button, Table } from "antd"
import Title from "antd/es/typography/Title"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

interface Content {
    title : string,
    name : string
    url : string
}

interface Props {
    contents : Content[]
}

const TableOfContents = (props : Props) => {

    const [dataSource, setDataSource] = useState<any[]>([]);

    const columns  = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (val) => {
                console.log(val)
                return <span className="font-semibold">{val}</span>
            }
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '',
            dataIndex: 'url',
            key: 'url',
            render: (val) => {
                return <Link to={val} ><Button variant="text" color="primary">View</Button></Link>
            }
        },
    ]

    useEffect(() => {
        setDataSource(props.contents.map((p, i) => {
            return {
                key : i,
                title : p.title,
                name : p.name,
                url : p.url
            }
        }))
    }, props.contents)

    return (
        <>
            <Title level={4} >Reports</Title>
            <Table
            pagination={false}
            dataSource={dataSource}
            columns={columns} /> 
        </>
    )
}

export default TableOfContents;