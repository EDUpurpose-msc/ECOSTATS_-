import { Card, Flex, Result } from "antd"


const EmailVerifiedResult = () => {
    return (
        <>
            <Flex align="center" justify="center" className="h-full">
                
                <Card className="w-fit">
                    <Result status="success" title="Verification Success" subTitle="Account verified successfully" />
                </Card>
            </Flex>
        </>
    )
}

export default EmailVerifiedResult;