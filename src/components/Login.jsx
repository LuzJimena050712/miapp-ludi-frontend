import { useState } from "react"

const URL_LOGIN = "https://miapp-ludi-backend.onrender.com/routes/usuario_route.php?action=login"
const URL_REGISTRO = "https://miapp-ludi-backend.onrender.com/routes/usuario_route.php?action=register"

const Login = ({ entrar }) => {
  const [esRegistro, setEsRegistro] = useState(false)
  const [nombre, setNombre] = useState("")
  const [correo, setCorreo] = useState("")
  const [password, setPassword] = useState("")
  const [mensaje, setMensaje] = useState("")

  const cambiarEstado = () => {
    setEsRegistro(!esRegistro)
    setMensaje("")
  }

  const manejarFormulario = async (evt) => {
    evt.preventDefault()
    try {
      if (esRegistro) {
        const respuesta = await fetch(URL_REGISTRO, {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify({
            nombre,
            email: correo,
            password
          })
        })
        const datos = await respuesta.json()
        if (respuesta.status === 201) {
          setMensaje("Registrado correctamente")
        } else {
          setMensaje(datos.message)
        }
      } else {
        const respuesta = await fetch(URL_LOGIN, {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify({
            email: correo,
            password
          })
        })
        const datos = await respuesta.json()
        if (respuesta.status === 200) {
          localStorage.setItem("token", datos.token)
          localStorage.setItem("correo", correo)
          setMensaje("¡Login exitoso!")
          entrar()
        } else {
          setMensaje(datos.message)
        }
      }
    } catch (error) {
      setMensaje("No se pudo conectar con el servidor")
    }
  }

  return (
    <div className="w-screen h-screen bg-white flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-lg border border-rose-200 p-8 w-full max-w-md mx-4">
        <h1 className="text-3xl font-bold text-center text-purple-400 mb-1">
          {esRegistro ? "Registrarse" : "Iniciar sesión"}
        </h1>
        <small className="text-rose-400 text-xs">Los campos con (*) son obligatorios</small>
        <form className="flex flex-col gap-3 mt-4" onSubmit={manejarFormulario}>
          {esRegistro && (
            <>
              <label className="text-slate-600">Nombre <span className="text-rose-300 font-bold">*</span></label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Diego Carlos"
                required
                className="border border-rose-300 rounded px-4 py-2 outline-none focus:border-purple-400 focus:shadow-lg"
              />
            </>
          )}
          <label className="text-slate-600">Correo <span className="text-rose-300 font-bold">*</span></label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="correo@dominio.com"
            required
            className="border border-rose-200 rounded px-4 py-2 outline-none focus:border-purple-400 focus:shadow-lg"
          />
          <label className="text-slate-600">Contraseña <span className="text-rose-300 font-bold">*</span></label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="**********"
            required
            className="border border-rose-200 rounded px-4 py-2 outline-none focus:border-purple-400 focus:shadow-lg"
          />
          <button
            type="submit"
            className="bg-purple-400 text-white font-semibold px-4 py-2 mt-3 rounded-lg shadow-lg cursor-pointer hover:bg-purple-500 transition duration-300"
          >
            {esRegistro ? "Registrarse" : "Ingresar"}
          </button>
          {mensaje && <p className="text-sm mt-2 text-center text-purple-400">{mensaje}</p>}
          <p className="text-sm mt-3 text-center text-slate-600">
            {esRegistro ? "¿Ya tienes una cuenta?" : "¿Aún no tienes una cuenta?"}
            <button
              type="button"
              onClick={cambiarEstado}
              className="text-purple-400 ml-1 hover:underline cursor-pointer"
            >
              {esRegistro ? "Inicia sesión aquí" : "Regístrate aquí"}
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login