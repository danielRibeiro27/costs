import loading from '../../imgs/loading.svg'
import styels from './Loading.module.css'


function Loading(){
    return (
        <div className={styels.loader_container}>
            <img className={styels.loader} src={loading} alt="Loading"/>
        </div>
    )
}

export default Loading;