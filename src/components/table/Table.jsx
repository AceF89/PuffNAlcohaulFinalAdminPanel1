import { useNavigate } from "react-router-dom"


const Table = ({columns,tableData}) => {
const navigate=useNavigate()
  
  return (
    <div>
        <table className="table ">
  <thead>
    <tr>
      {columns?.map((col)=><th scope="col" key={col.id}>{col}</th>)}
    
    
    </tr>
  </thead>
 
    <tbody>
    {tableData?.map((rowData) => (
          <tr style={{cursor:'pointer'}}key={rowData.id} className={rowData.isPrimary ? 'primary_color' : ''} onClick={()=>navigate("/userdetails")}>
            <th scope="row">{rowData.id}</th>
            <td>{rowData.name}</td>
            <td>{rowData.email}</td>
            <td>{rowData.role}</td>
            <td>{rowData.date}</td>
            <td>{rowData.description}</td>
          </tr>
        ))}
   
  </tbody>
</table>
    </div>
  )
}

export default Table