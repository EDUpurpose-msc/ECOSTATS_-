import { Avatar, Space } from "antd";
import { useAuthStore } from "../stores/useAuthStore";


const SidebarUser = () => {

    const {user} = useAuthStore();

    return (
        <>
<           div className="p-2">
                <Space>
                    <Avatar src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${user?.name}`} size="large" />
                    <h3 className="text-gray-200 ">
                        <div className="font-bold">{user?.name}</div>
                        <div className="">{user?.email}</div>
                    </h3>
                </Space>
            </div>
        </>
    )
}

export default SidebarUser;