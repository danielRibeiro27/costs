import {useEffect, useState} from 'react';

import Input from '../form/Input';
import Select from '../form/Select';
import SubmitButton from '../form/SubmitButton';
import styles from './ProjectForm.module.css'

function ProjectForm({handleSubmit, btnText, projectData}){
    const [categories, setCategories] = useState([])
    const [project, setProject] = useState(projectData || []);

    useEffect(() => {
        fetch('http://localhost:5000/categories', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        })
        .then((resp) => resp.json())
        .then((data) => {
            setCategories(data);
        })
    }, []);

    const submit = (e) => {
        e.preventDefault();
        handleSubmit(project);
    }

    function handleChange(e){
        setProject({...project, [e.target.name]: e.target.value});
    }
    
    function handleCategory(e){
        setProject({...project, category: { id: e.target.value, name: e.target.options[e.target.selectedIndex].text }});
        console.log(project);
    }


    return (
        <form onSubmit={submit} className={styles.form}>
            <Input handleOnChange={handleChange} type="text" text="Project name" name="name" placeholder="Insert the project name" value={project.name ? project.name : ""}/>
            <Input handleOnChange={handleChange} type="number" text="Project budget" name="budget" placeholder="Insert the project budget" value={project.budget ? project.budget : ""}/>

            <Select handleOnChange={handleCategory} name="category_id" text="Select a category" options={categories} value={project.category ? project.category.id : ''}/>

            <SubmitButton text={btnText} />
        </form>
    )
}

export default ProjectForm;