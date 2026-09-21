import {  useEffect, useState} from 'react'
import request from '../../Api/request';
export default function Base(){
    const [datos, setDatos] = useState(null)
    const carga_datos = async () => {
        const endpoint = `users/data-users`;
        const response = await request({
        endpoint: endpoint,
        method: 'GET',
        body: {}
        
        })
        console.log(response.data)
        setDatos(response.data)
  };
    useEffect(() => {
        carga_datos()
      }, [])
    return(
        <div>
            Control Usuarios
        </div>
    )

}