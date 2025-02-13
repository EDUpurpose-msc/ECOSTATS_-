import { Button, Flex, Layout } from "antd"
import { Content } from "antd/es/layout/layout"
import Title from "antd/es/typography/Title";
import { Link } from "react-router-dom";

const ErrorPage = ({code, message}) => {
    return (
        <>
            <Layout style={{
                height: "100vh"
            }}>
                <Content >
                    <Flex  align="center" style={{height: "100%"}}>
                        <Flex vertical align="center" style={{width: "100%"}}>
                            <Title type="danger" style={{marginBottom: "0px"}}>{code}</Title>
                            <Title level={4}>{message}</Title>
                            <Link to="/">
                                <Button size="large">Go to Home</Button>
                            </Link>
                        </Flex>
                    </Flex>
                </Content>
            </Layout>
        </>
    )
}

export default ErrorPage;