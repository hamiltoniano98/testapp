import React,{useEffect,useState} from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { showalerta } from '../function';

const ShowTask = () => {
    const url ='http://localhost:3001/task/';
    const [task,setTask]=useState([]);
    const [nom,setNom]=useState('');
    const [op,setOp]=useState(1);
    const [id,setId]=useState('');
    const [nompro,setNompro]=useState('');
    const [desscripcion,setDesscripcion]=useState('');

    useEffect(()=>{
        getTask();
    },[])

    const getTask = async()=>{
        const res = await axios.get(url , 
                  
          );
        
        setTask(res.data.result);
    }

    const openModal = (op,id,nompro,desscripcion)=>{

        setNompro('');
        setDesscripcion('');
        setOp(op);
        if(op===1){
            setNom('Añadir Tarea');
        }
        else if (op===2){
            setNom('Editar Tarea');
            setId(id);
            setNompro(nompro);
            setDesscripcion(desscripcion);
        }
    }

    const validar = ()=>{
        var parametros;
        var metodo;
        var idw;

        if(nompro.trim()===''){
            showalerta('Escribe el nombre de la tarea','warning')
        }
        else if(desscripcion.trim()===''){
            showalerta('Escribe una descripcion','warning')
        }
        else{
            if(op===1){
                parametros={"nompro":nompro.trim(),"desscripcion":desscripcion.trim()};
                metodo='POST';
                var urls=url
            }
            else{
                idw={id:id}
                parametros={id:id,"nompro":nompro.trim(),"desscripcion":desscripcion.trim()};
                metodo='PUT';
                var urls=url+parametros.id
            }
            enviarsolicitud(parametros,metodo,urls);
        }
        
    }

    const eliminar =(id,nompro)=>{
        const Swwal=withReactContent(Swal);
        Swwal.fire({
            title:'Seguro q quieres eliminar la tarea '+nompro+'?',
            icon:'question',
            showCancelButton:true,confirmButtonText:'Si,eliminar',cancelButtonText:'Cancelar'
        }).then((res)=>{
            if(res.isConfirmed){
                setId(id);
                var urls=url+id
                enviarsolicitud('','DELETE',urls)
            }
            else{
                showalerta('Casi','info')
            }
        })
    }




    const enviarsolicitud=async(parametros,metodo,urls)=>{
        
        
        await axios({method:metodo,url:urls,data:parametros,}
        ).then(function(res){
            console.log(url)
            var tipo= res.data[0];
            var msj=res.data[1];
            showalerta(msj,'success');
            getTask();
            document.getElementById('btnCerrar').click();
               

        })
        .catch(function(error){
            showalerta('Error','error')
            
        })
    }

  return (
    <div className='App'>
        <div className='container-fluid'>
            <div className='row mt-3'>
                <div className='col-md offset'>
                    <div className='d-grid mx-auto'>
                        <button onClick={()=>openModal(1)} className='btn btn-dark' data-bs-toggle="modal" data-bs-target="#taskModal">
                            <i className='fa-solid fa-circle-plus'></i>  Añadir
                        </button>
                    </div>
                </div>
            </div>
            <div className='row mt-3'>
                <div className='col-12 col-lg'>
                    <div className='tale-responsive'>
                        <table className='table table-bordered'>
                            <thead>
                                <tr><th>#</th><th>Task</th><th>Description</th></tr>
                            </thead>
                            <tbody className='tale-group-divider'>
                                {task.map((task,i)=>(
                                    <tr key={task._id}>
                                        <td>{(i+1)}</td>
                                        <td>{task.nompro}</td>
                                        <td>{task.desscripcion}</td>
                                        <td>
                                            <button onClick={()=>openModal(2,task._id,task.nompro,task.desscripcion)}  className='btn btn-warning' data-bs-toggle="modal" data-bs-target="#taskModal">
                                                <i className='fa-solid fa-edit'></i>
                                            </button>
                                            &nbsp;
                                            <button onClick={()=>eliminar(task._id,task.nompro)} className='btn btn-danger'>
                                                <i className='fa-solid fa-trash'></i>
                                            </button>
                                        </td>
                                    </tr>

                                ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div id='taskModal' className='modal fade'>
            <div className='modal-dialog'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <label className='hs'> {nom}</label>
                        <button id='btnCerrar' type='button' className='btn-close' data-bs-dismiss='modal' aria-label='close'></button>
                    </div>
                    <div className='modal-body'>
                        <input type='hidden' id='id'></input>
                        <div className='input-group mb-3'>
                            <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                            <input type='text' id='nombre' className='form-control' placeholder='Tarea' value={nompro}
                            onChange={(e)=>setNompro(e.target.value)}></input>
                        </div>
                    
                        <input type='hidden' id='id'></input>
                        <div className='input-group mb-1'>
                            <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                            <input type='text' id='descripcion' className='form-control' placeholder='Descripcion' value={desscripcion}
                            onChange={(e)=>setDesscripcion(e.target.value)}></input>
                        </div>
                    </div>
                    <div className='d-grid col-6 mx-auto mb-3'>
                        <button onClick={()=>validar()} className='btn btn-success'>
                            <i className='fa-solid fa-floppy-disk' ></i> Guardar
                        </button>   
                    </div>
                </div>
            </div>
        </div>                        

    </div>
  )
}

export default ShowTask