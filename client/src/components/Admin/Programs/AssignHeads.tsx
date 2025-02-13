import { Button, Card, Input, message, Select, SelectProps } from "antd";
import Title from "antd/es/typography/Title";
import { useCallback, useState } from "react";
import { assignTo, getByQuery, searchUserByName } from "../../../services/api/userApi";
import debounce from 'lodash.debounce';
import { searchProgramByName } from "../../../services/api/programApi";
import { ValidationError } from "../../../types/ApiValidationError";
import FieldError from "../../FieldError";
import {  getUnitsByQuery, searchUnitByName } from "../../../services/api/unitApi";
import { parseResError } from "../../../services/errorHandler";

const AssignHeads = () => {
    const [userOptions, setUserOptions] = useState([]);
    const [unitOptions, setUnitOptions] = useState([]);
    const [programOptions, setProgramOptions] = useState([]);
    const [selectUserloading, setSelectUserloading] = useState(false);
    const [selectUnitloading, setSelectUnitloading] = useState(false);
    const [selectProgramloading, setSelectProgramloading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [formData, setFormData] = useState<{unitId:string|null, userId:string|null, programId:string|null}>({
        userId: null,
        unitId : null,
        programId: null
    });
    const [validationErrors , setValidationErrors] = useState<ValidationError[]>([]);
    

    const debouncedUserSearch = useCallback(
        debounce((value) => {
            setSelectUserloading(true)
            searchUserByName(value)
            .then(res => {
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
            setSelectProgramloading(true)
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
                setSelectProgramloading(false)
            })
        }, 500)
    ,[]);

    const debouncedUnitSearch = useCallback(
        debounce((value) => {
            setSelectUnitloading(true)
            getUnitsByQuery({
                name : {
                    $regex : value,
                    $options : "i"
                },
                deletedAt : null
            }, [])
            .then(res => {
                console.log(res.data)
                const options = res.data.map(val => {
                    return {
                        value : val._id,
                        label : val.name,
                    }
                });
                setUnitOptions(options)
            })
            .catch(err => {
                messageApi.error("Unexpected Error occured")
            })
            .finally(()=>{
                setSelectUnitloading(false)
            })
        }, 500)
    ,[]);

    const searchUser = (e) => {
        debouncedUserSearch(e)
    }

    const searchProgram = (e) => {
        debouncedProgramSearch(e)
    }

    const searchUnit = (e) => {
        debouncedUnitSearch(e)
    }

    const onSave = () => {
        setIsSaving(true)
        setValidationErrors([])
        assignTo(formData.userId!, formData.programId, formData.unitId!)
        .then(res => {
            setFormData({userId: null, unitId : null, programId: null})
            messageApi.success("User successfully assigned.")
        })
        .catch(err => {
            console.log(err)
            if(err.response.status == 422){
                setValidationErrors(err.response.data.errors)
            }
            else{
                messageApi.error(parseResError(err).msg)
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

    return (
        <>
            {contextHolder}
            <Card >
                <Title level={4}>Assign Heads upon User Account RegistrationRegister Division</Title>
                <div className="mb-2">
                    <Title level={5}>User Account</Title>
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

                <div className="mb-2">
                    <Title level={5}>Assign to Division</Title>
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
                    <Title level={5}>Assign to Unit</Title>
                    <Select 
                    showSearch
                    allowClear
                    value={formData.unitId}
                    onSelect={(e)=>setFormData({...formData, unitId:e})}
                    loading={selectUnitloading}
                    className="w-full" 
                    placeholder="Search Unit"
                    filterOption={false}
                    onSearch={searchUnit} 
                    onClear={()=>{
                        setUnitOptions([])
                        setFormData({...formData, unitId:null})
                    }}  
                    options={unitOptions.map(opt => opt)} />
                    <FieldError errors={validationErrors} name={"unitId"} />
                </div>

                
                <br />
                <Button className="w-full" type="primary" onClick={onSave} loading={isSaving}>Assign User</Button>
            </Card>
        </>
    )
}

export default AssignHeads;