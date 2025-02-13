import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import { Content } from "antd/es/layout/layout";


const HomePage = () => {
    const layoutStyle : React.CSSProperties = {
        background: "url('/bg.jpg') no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh"
    }
    return (
        <>
            <Layout style={layoutStyle} >
                <Content style={{
                    height: "100%",
                }}>
                    <Outlet />
                </Content>
            </Layout>
        </>
    )
}

export default HomePage;