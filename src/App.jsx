import { useState } from "react"
import Login from "./components/Login"
import Notas from "./components/Notas"

const App = () => {
  const [logueado, setLogueado] = useState(false)
  const [tema, setTema] = useState("lila")

  const salir = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("correo")
    setLogueado(false)
  }

  return (
    <>
      {logueado ? (
        <Notas salir={salir} tema={tema} setTema={setTema} />
      ) : (
        <Login entrar={() => setLogueado(true)} />
      )}
    </>
  )
}

export default App