import styles from './ProjectEdit.module.css';

import {useParams} from 'react-router-dom';
import {useState, useEffect} from 'react';
import {parse, v4 as uuidv4} from 'uuid';

import Loading from '../layout/Loading.js';
import Container from '../layout/Container';
import Message from '../layout/Message.js';
import ProjectForm from '../project/ProjectForm';
import ServiceForm from '../services/ServiceForm';
import ServiceCard from '../services/ServiceCard';


function ProjectEdit(){
    const {id} = useParams();
    const [project, setProject] = useState([]);
    const [services, setServices] = useState([]);
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [showServiceForm, setShowServiceForm] = useState(false);
    const [message, setMessage] = useState();
    const [type, setType] = useState();

    useEffect(() => {
        setTimeout(() => {
            fetch(`http://localhost:5000/projects/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type' : 'application/json'
            }
        })
        .then(resp => resp.json())
        .then((data) => {
            setProject(data);
            setServices(data.services);
        })
        .catch((err) => console.log(err))
        }, 1000)

    }, [id]);

    function createService(project){
        setMessage('');

        //last service
        const lastService = project.services[project.services.length - 1];
        lastService.id = uuidv4();

        const lastServiceCost = lastService.cost;
        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost);

        //maximum value validation
        if(newCost > parseFloat(project.budget)){
            setMessage('Service cost exceeds the max budget');
            setType('error');
            project.services.pop();
            return false;
        }

        //update project
        project.cost = newCost;
        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(project)
        })
        .then((resp) => resp.json())
        .then((data) => {
            setShowServiceForm(false);
        })
        .catch((err) => console.log(err));
    }

    function removeService(id, cost){
        
        const servicesUpdated = project.services.filter((s) => s.id !== id);
        const projectUpdated = project;
        projectUpdated.services = servicesUpdated;
        projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost);

        fetch(`http://localhost:5000/projects/${projectUpdated.id}`, {
            method: 'PATCH',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectUpdated)
        })
        .then((r) => r.json())
        .then((data) => {
            setProject(projectUpdated);
            setServices(servicesUpdated);

            setMessage("Service removed successfully !");
        })
        .catch((err) => console.log(err));
    }

    function toggleProjectForm(){
        setShowProjectForm(!showProjectForm);
    }

    function toggleShowServiceForm(){
        setShowServiceForm(!showServiceForm);
    }
    
    function editPost(project){
        setMessage('');

        //budget validation
        if(project.budget < project.cost){
            setMessage("Budget cannot be lower than the project cost !")
            setType('error');
            return false;
        }

        fetch(`http://localhost:5000/projects/${project.id}`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project)
        })
        .then((resp) => resp.json())
        .then((data) => {
            setProject(data);
            setShowProjectForm(false);

            setMessage("Project updated !")
            setType('success');
        })
        .catch((err) => console.log(err));
    }

    return (
        <>
            {project.name ? (
                <div className={styles.project_details}>
                    <Container customClass="column">
                        {message && <Message type={type} msg={message}/>}

                        <div className={styles.details_container}>
                            <h1>Project: {project.name}</h1>
                            <button className={styles.btn} onClick={toggleProjectForm}>
                                {!showProjectForm ? 'Edit' : 'Close'}
                            </button>

                            {!showProjectForm ? (
                                <div className={styles.project_info}>
                                    <p><span>Category: </span> {project.category.name}</p>
                                    <p><span>Total Budget: </span> R${project.budget}</p>
                                    <p><span>Total Used: </span> {project.cost}</p>
                                </div>
                            ) : (
                                <div className={styles.project_info}>
                                    <ProjectForm handleSubmit={editPost} btnText="Finish Edit" projectData={project}/>
                                </div>
                            )}
                        </div>

                        <div className={styles.service_form_container}>
                            <h2>Add service:</h2>
                            <button className={styles.btn} onClick={toggleShowServiceForm}>
                                {!showServiceForm ? 'Add' : 'Close'}
                            </button>     

                            <div className={styles.project_info}>
                                {showServiceForm && (<ServiceForm handleSubmit={createService} btnText="Add service" projectData={project}/>)}    
                            </div>                   
                        </div>


                        <h2>Service</h2>
                        <Container customClass="start">
                            {services.length > 0 &&
                                services.map((service) => (
                                    <ServiceCard id={service.id} name={service.name} cost={service.cost} description={service.description} key={service.key} handleRemove={removeService} />
                                ))
                            }
                            {services.length == 0 && <p>No services</p>}
                        </Container>
                    </Container>
                </div>
            ) : (<Loading/>)}
        </>
    )
}

export default ProjectEdit;