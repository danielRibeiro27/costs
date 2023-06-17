import {useState} from 'react';
import Input from '../form/Input';
import SubmitButton from '../form/SubmitButton';

import styles from '../project/ProjectForm.module.css';

function ServiceForm({handleSubmit, btnText, projectData}){
    
    const [service, setService] = useState({});
    
    function submit(e){
        e.preventDefault();
        projectData.services.push(service);
        handleSubmit(projectData);
    }

    function handleChange(e){
        e.preventDefault();
        setService({...service, [e.target.name]: e.target.value});
    }

    return (
        <form onSubmit={submit} className={styles.form}>
            <Input type="text" text="Name" name="name" placeholder="Insert the service name" handleOnChange={handleChange} />
            <Input type="NUMBER" text="Cost" name="cost" placeholder="Insert total cost" handleOnChange={handleChange} />
            <Input type="text" text="Description" name="description" placeholder="Insert the description" handleOnChange={handleChange} />

            <SubmitButton text={btnText}/>
        </form>
    )

}

export default ServiceForm;