import ProjectForm from '../project/ProjectForm';
import styles from './NewProject.module.css';

function NewProject(){
    return (
        <div className={styles.newproject_container}>
            <h1>Create Project</h1>
            <p>Create your project and then add services</p>

            <ProjectForm btnText="Create project"/>
        </div>

    )
}

export default NewProject;