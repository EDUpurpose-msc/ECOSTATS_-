import { Button, Card, Input, message, Select, SelectProps } from "antd";
import Title from "antd/es/typography/Title";
import { useCallback, useEffect, useState } from "react";
import { getByQuery, searchUserByName } from "../../../services/api/userApi";
import debounce from 'lodash.debounce';
import { createProgram } from "../../../services/api/programApi";
import { ValidationError } from "../../../types/ApiValidationError";
import FieldError from "../../FieldError";



const CreateProgram = ({ sectors } : {sectors : any[]}) => {
    const [userOptions, setUserOptions] = useState([]);
    const [selectUserloading, setSelectUserloading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [formData, setFormData] = useState<{name:string, userId:string|null, sector_id : string}>({
        userId: null,
        name : "",
        sector_id : ""
    });
    const [validationErrors , setValidationErrors] = useState<ValidationError[]>([]);
    

    const debouncedSearch = useCallback(
        debounce((value) => {
            setSelectUserloading(true)
            getByQuery({
                name : {
                    $regex : value,
                    $options : "i"
                },
                role : "chief"
            })
            .then(res => {
                console.log(res.data)
                const options = res.data.map(val => {
                    return {
                        value : val._id,
                        label : val.name,
                        email : val.email
                    }
                });
                setUserOptions(options)
            })
            .catch(err => {
                messageApi.error("Unexpected Error occured")
            })
            .finally(()=>{
                setSelectUserloading(false)
            })
        }, 500),[]);

    const searchUser = (e) => {
        debouncedSearch(e)
    }

    const onSave = async () => {
        setIsSaving(true)
        setValidationErrors([]);
        console.log(formData)
        try {
            await createProgram(formData.userId!, formData.name, formData.sector_id)
            setFormData({userId: null, name : "", sector_id : ""})
            messageApi.success("Program successfully created.")
        } catch (err : any) {
            if(err.response.status == 422){
                setValidationErrors(err.response.data.errors)
            }
            else{
                messageApi.error(err.response.data.msg)
            }
        } finally {
            setIsSaving(false)
        }

    }


    const optionRenderer = (option) => {
        return (
            <>
                <p>{option.label}</p>
                <p className="opacity-80">{option.data.email}</p>
            </>
        )
    }

    return (
        <>
            {contextHolder}
            <Card >
                <Title level={4}>Register Division</Title>
                <div className="mb-2">
                    <Title level={5}>Division Name</Title>
                    <Input placeholder="Enter Division Name" onChange={(e)=>setFormData({...formData, name:e.target.value})} value={formData.name} />
                    <FieldError errors={validationErrors} name={"name"} />
                </div>

                <div className="mb-2">
                    <Title level={5}>Assign Management</Title>
                    {/* <Input placeholder="Assign" onChange={(e)=>setFormData({...formData, name:e.target.value})} value={formData.name} /> */}
                    <Select 
                        className="w-full" 
                        placeholder="Assign Management"
                        value={formData.sector_id}
                        onChange={(e)=>setFormData({...formData, sector_id: e})}
                        options={sectors.map(sector => {return {label : sector.name, value : sector._id}})} />
                    <FieldError errors={validationErrors} name={"sector_id"} />
                </div>

                <div className="mb-2">
                    <Title level={5}>Assign Division Head</Title>
                    <Select 
                    showSearch
                    allowClear
                    value={formData.userId}
                    onSelect={(e)=>setFormData({...formData, userId:e})}
                    loading={selectUserloading}
                    className="w-full" 
                    placeholder="Search User Account"
                    filterOption={false}
                    onSearch={searchUser} 
                    onClear={()=>{
                        setUserOptions([])
                        setFormData({...formData, userId:null})
                    }}  
                    options={userOptions.map(opt => opt)} 
                    optionRender={(option) => optionRenderer(option)}/>
                    <FieldError errors={validationErrors} name={"userId"} />
                </div>

                <br />
                <Button className="w-full" type="primary" onClick={onSave} loading={isSaving}>Register Division</Button>
            </Card>
        </>
    )
}

export default CreateProgram;