import { Button, Card, Input, message, Select, SelectProps } from "antd";
import Title from "antd/es/typography/Title";
import { useCallback, useEffect, useState } from "react";
import { getByQuery, searchUserByName } from "../../../services/api/userApi";
import debounce from 'lodash.debounce';
import { createProgram, searchProgramByName } from "../../../services/api/programApi";
import { ValidationError } from "../../../types/ApiValidationError";
import FieldError from "../../FieldError";
import { createUnit } from "../../../services/api/unitApi";

interface ProgramOption {
    value : string,
    label : string
}

const CreateUnit = (props  : { program? : ProgramOption} ) => {
    const [userOptions, setUserOptions] = useState([]);
    const [programOptions, setProgramOptions] = useState<any[]>([]);
    const [selectUserloading, setSelectUserloading] = useState(false);
    const [selectProgramloading, setSelectProgramloading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [formData, setFormData] = useState<{name:string, userId:string|null, programId:string|null}>({
        userId: null,
        name : "",
        programId: null
    });
    const [validationErrors , setValidationErrors] = useState<ValidationError[]>([]);
    

    const debouncedUserSearch = useCallback(
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
        }, 500)
    ,[]);

    const debouncedProgramSearch = useCallback(
        debounce((value) => {
            setSelectUserloading(true)
            searchProgramByName(value)
            .then(res => {
                const options = res.data.map(val => {
                    return {
                        value : val._id,
                        label : val.name
                    }
                });
                setProgramOptions(options)
            })
            .catch(err => {
                messageApi.error("Unexpected Error occured")
            })
            .finally(()=>{
                setSelectUserloading(false)
            })
        }, 500)
    ,[]);

    const searchUser = (e) => {
        debouncedUserSearch(e)
    }

    const searchProgram = (e) => {
        debouncedProgramSearch(e)
    }

    const onSave = () => {
        setIsSaving(true)
        setValidationErrors([])
        createUnit(formData.userId!, formData.name, formData.programId!)
        .then(res => {
            setFormData({userId: null, name : "", programId: null})
            messageApi.success("Unit successfully created.")
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
        .finally(() => setIsSaving(false))
    }

    const optionRenderer = (option) => {
        return (
            <>
                <p>{option.label}</p>
                <p className="opacity-80">{option.data.email}</p>
            </>
        )
    }

    useEffect(() => {
        console.log(props.program)
        if(props.program){
            setProgramOptions([props.program])
            setFormData({...formData, programId:props.program.value})
        }
    }, [props.program])

    return (
        <>
            {contextHolder}
            <Card >
                <Title level={4}>Create Units under Division</Title>

                <div className="mb-2">
                    <Title level={5}>Select Division</Title>
                    <Select 
                    showSearch
                    allowClear
                    value={formData.programId}
                    onSelect={(e)=>setFormData({...formData, programId:e})}
                    loading={selectProgramloading}
                    className="w-full" 
                    placeholder="Search Program"
                    filterOption={false}
                    onSearch={searchProgram} 
                    onClear={()=>{
                        setProgramOptions([])
                        setFormData({...formData, programId:null})
                    }}  
                    options={programOptions.map(opt => opt)} />
                    <FieldError errors={validationErrors} name={"programId"} />
                </div>

                <div className="mb-2">
                    <Title level={5}>Unit Name</Title>
                    <Input placeholder="Enter Unit Name" onChange={(e)=>setFormData({...formData, name:e.target.value})} value={formData.name} />
                    <FieldError errors={validationErrors} name={"name"} />
                </div>

                <div className="mb-2">
                    <Title level={5}>Assign Unit Head</Title>
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
                <Button className="w-full" type="primary" onClick={onSave} loading={isSaving}>Register Unit</Button>
            </Card>
        </>
    )
}

export default CreateUnit;