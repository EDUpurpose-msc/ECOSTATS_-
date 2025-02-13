import { Button, Drawer, Input, message, Select, Space, Tag } from "antd";
import { useEffect, useState } from "react";
import Title from "antd/es/typography/Title";
import { useEditUserStore, useViewUsersStore } from "../../../stores/useUserStore";
import { getUserById, updateUser } from "../../../services/api/userApi";
import { ValidationError } from "../../../types/ApiValidationError";
import FieldError from "../../FieldError";


const EditUserDetails = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false)
    const {userId, user, clear, setUser} = useEditUserStore()
    const [messageApi, contextHolder] = message.useMessage();
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role : ""
    });
    const [validationErrors , setValidationErrors] = useState<ValidationError[]>([]);
    const viewUsersStore = useViewUsersStore();

    const handleFormControlChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleOnSave = () => {
        setIsSaving(true)
        updateUser(user?._id!, formData.name, formData.email, formData.role)
        .then((res) => {
            viewUsersStore.setUsers(viewUsersStore.users.map(user => {
                if(user._id == res.data._id){
                    user.email = res.data.email;
                    user.name = res.data.name;
                    return user;
                }
                else {
                    return user;
                }
            }))
            setOpen(false)
        })
        .catch(err => {
            console.log(err)
            if(err.response.status == 422){
                setValidationErrors(err.response.data.errors)
            }
            else{
                messageApi.error(err.response.data.msg)
            }
        })
        .finally(() => {
            setIsSaving(false)
        })
        
    }

    useEffect(() => {
        setValidationErrors([])
        if(userId){
            setOpen(true)
            setLoading(true)
            getUserById(userId)
            .then(res => {
                setUser(res.data)
            })
            .catch(err => {
                console.log(err)
                messageApi.error(err.response.data.msg)
            })
            .finally(() => {
                setLoading(false)
            })
            
        }
        else{
            setOpen(false)
        }
    }, [userId])

    useEffect(() => {
        if(user){
            setFormData({
                name: user!.name,
                email: user!.email,
                role : user.role
            })
        }
    }, [user])

    return (
        <>
            {contextHolder}
            <Drawer 
                loading={loading}
                placement="right" 
                open={open}
                onClose={() => clear()}
                >
                <Title level={4}>Edit User</Title>

                <div className="mb-2">
                    <label className="font-semibold">Name</label>
                    <Input placeholder="Name" value={formData.name} onChange={handleFormControlChange} name="name" />
                    <FieldError errors={validationErrors} name={"name"} />
                </div>
                <div className="mb-2">
                    <label className="font-semibold">Role</label>
                    <Select className="block w-full" placeholder="Select Role" 
                    value={formData.role} 
                    onChange={(e) => setFormData({...formData, role : e})} 
                    options={[
                        {
                            label : "System Admin",
                            value : "admin"
                        },
                        {
                            label : "Planning Officer",
                            value : "planning officer"
                        },
                        {
                            label : "Chief",
                            value : "chief"
                        },
                        {
                            label : "Focal",
                            value : "focal"
                        },
                    ]}/>
                    <FieldError errors={validationErrors} name={"role"} />
                </div>
                <div className="mb-2">
                    <label className="font-semibold">Email</label>
                    <Input placeholder="Email" value={formData.email} name="email" onChange={handleFormControlChange} />
                    <FieldError errors={validationErrors} name={"email"} />
                </div>

                <FieldError errors={validationErrors} name={"id"} />

                <Button className="me-0 ms-auto block" variant="solid" color="primary" onClick={handleOnSave} loading={isSaving}>Save</Button>
            </Drawer>
        </>
    )
}

export default EditUserDetails;