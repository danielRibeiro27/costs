import Message from '../layout/Message.js'
import Container from '../layout/Container.js'
import Loading from '../layout/Loading.js';
import LinkButton from '../layout/LinkButton.js'
import ProjectCard from '../project/ProjectCard.js';

import {useLocation} from 'react-router-dom';
import {useState, useEffect} from 'react';

import styles from './Projects.module.css';

function Projects(){
    const [projects, setProjects] = useState([]);
    const [removeLoading, setRemoveLoading] = useState(false);
    const [projectMessage, setProjectMessage] = useState('');

    const location = useLocation();
    let message = '';
    if(location.state){
        console.log('Existe um state');
        message = location.state.message;
    }

    useEffect(() => {

        setTimeout(() => {

            fetch('http://localhost:5000/projects',{ 
            method:'GET',
            headers:{
                'Content-Type': 'application/json'
            }    
            })
            .then(resp => resp.json())
            .then((data) => {
                
                setProjects(data);
                setRemoveLoading(true);
            })
            .catch((err) => console.log(err))
            }, 3000);

    }, [])

    function removeProject(id){
        fetch(`http://localhost:5000/projects//${id}`,{
            method: 'DELETE',
            headers: {
                'Content-Type' : 'application/json'
            }
        })
        .then(resp => resp.json())
        .then(() => {
            setProjects(projects.filter((x) => x.id !== id));
            setProjectMessage("Project removed successfully.");
        })
        .catch((err) => console.log(err))
    }

    return (
        <div className={styles.project_container}>
            <div className={styles.title_container}>
                <h1>My projects</h1>
                <LinkButton to="/newproject" text="Create Project"/>
            </div>
            
            {message && <Message msg={message} type="success"/>}
            {projectMessage && <Message msg={projectMessage} type="error"/>}

            <Container customClass="start">

                {projects.length > 0 && 

                    projects.map((project) => (
                        <ProjectCard name={project.name} id={project.id} budget={project.budget} category={project.category.name} key={project.id} handleRemove={removeProject} />
                    ))
                }

                {!removeLoading && <Loading/>}

                {removeLoading && projects.length === 0 && (
                    <p>There is no projects</p>

                )}
            </Container>
            
        </div>
    )
}

export default Projects;