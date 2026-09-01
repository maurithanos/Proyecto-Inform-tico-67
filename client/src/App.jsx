import { useState, useEffect } from "react"
import axios from 'axios'
function App() {
  //INICIO CUERPO DE LA FUNCION
  //aca va toda la logica
  const hobbys = [
    {
      id: 1,
      name: "Karate"
    },
    {
      id: 2,
      name: "Pesca"
    }
  ]
  // const name = "Marcos"
  // let age = 26
  const [age, setAge] = useState(26)
  const [name, setName] = useState("")
  const [users, setUsers] = useState([])

  const fetchUsers = async () => {
    const response = await axios.get('http://localhost:3000/users')
    // console.log(response);
    setUsers(response.data)
  }

  useEffect(() => {
    fetchUsers()
  }, [])


  const cambiarNombre = (event) => {
    // console.log(event.target.value);
    setName(event.target.value)
  }

  const sumarEdad = () => {
    // age = age + 1
    // console.log(age);
    setAge(age + 1)
  }

  const test = () => {
    console.log("asñdljhflkajdfhs");

  }

  //FIN CUERPO DE LA FUNCION
  return (// aca esta todo el "componente" las tags que se ven en el front
    <>
      <h1>{name}</h1>
      <h2>{age}</h2>
      <button onClick={test}>saaaaaaaaaaaaaaaaaa</button>
      {/* <ul>
        {hobbys.map((hobby) => {
          return(<li>
            {hobby.name}
          </li>)
        })}
      </ul> */}
      <ul>
        {users.map((user) => {
          return (<li>
            {user.id} - {user.name}
          </li>)
        })}
      </ul>
      <input type="text" onChange={cambiarNombre} />
      <button onClick={sumarEdad}>presionar</button>
    </>
  )
}

export default App
