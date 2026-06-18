import { useEffect, useState } from "react"
import { temas } from "../temas"

const URL_USUARIOS = "https://miapp-ludi-backend.onrender.com/routes/usuario_route.php"
const URL_PAGO = "https://miapp-ludi-backend.onrender.com/routes/pago_route.php?action=crear_preferencia"

const Header = ({ salir, tema, setTema }) => {
  const [abierto, setAbierto] = useState(false)
  const [nombre, setNombre] = useState("")
  const [plan, setPlan] = useState("")
  const [usuarioId, setUsuarioId] = useState(null)
  const correo = localStorage.getItem("correo")

  const obtenerPerfil = async () => {
    try {
      const respuesta = await fetch(URL_USUARIOS, { method: "GET" })
      const datos = await respuesta.json()
      const usuario = datos.filter((u) => u.email === correo)[0]
      if (usuario) {
        setNombre(usuario.nombre)
        setPlan(usuario.plan)
        setUsuarioId(usuario.id)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const pagar = async () => {
    if (!usuarioId) return
    try {
      const respuesta = await fetch(URL_PAGO, {
        method: "POST",
        body: JSON.stringify({ usuario_id: usuarioId })
      })
      const datos = await respuesta.json()
      if (datos.init_point) {
        window.location.href = datos.init_point
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    obtenerPerfil()
  }, [])

  return (
    <>
      <header className={`${temas[tema].header} p-4 mb-4 shadow-lg flex flex-col justify-center items-center relative`}>
        {plan === "premium" && (
          <div className="flex gap-2 absolute left-4">
            <button onClick={() => setTema("lila")} className="w-7 h-7 rounded-full bg-purple-400 border-2 border-white cursor-pointer"></button>
            <button onClick={() => setTema("azul")} className="w-7 h-7 rounded-full bg-sky-400 border-2 border-white cursor-pointer"></button>
            <button onClick={() => setTema("menta")} className="w-7 h-7 rounded-full bg-teal-400 border-2 border-white cursor-pointer"></button>
            <button onClick={() => setTema("durazno")} className="w-7 h-7 rounded-full bg-orange-300 border-2 border-white cursor-pointer"></button>
          </div>
        )}
        <h1 className="text-white text-4xl font-bold">LuDi</h1>
        <p className="text-white text-sm">Tus notas, siempre a la mano</p>
        <button
          onClick={() => setAbierto(!abierto)}
          className="flex items-center gap-2 bg-white rounded-full px-3 py-1 cursor-pointer absolute right-4"
        >
          <span className={`${temas[tema].header} w-8 h-8 rounded-full text-white flex items-center justify-center font-bold`}>
            {nombre ? nombre[0] : "?"}
          </span>
          <span className={temas[tema].texto}>{nombre || "Perfil"}</span>
        </button>
      </header>
      {abierto && (
        <div className={`fixed top-20 right-4 bg-white border ${temas[tema].borde} rounded-lg shadow-lg p-4 w-64`}>
          <div className="flex justify-center mb-3">
            <span className={`${temas[tema].header} w-16 h-16 rounded-full text-white flex items-center justify-center text-3xl font-bold`}>
              {nombre ? nombre[0] : "?"}
            </span>
          </div>
          <p className={`${temas[tema].texto} text-xs`}>Nombre</p>
          <p className="text-slate-700 mb-2">{nombre}</p>
          <p className={`${temas[tema].texto} text-xs`}>Correo</p>
          <p className="text-slate-700 mb-2">{correo}</p>
          <p className={`${temas[tema].texto} text-xs`}>Plan</p>
          <p className="text-slate-700">{plan || "Gratis"}</p>
          {plan !== "premium" && (
            <button
              onClick={pagar}
              className={`flex items-center justify-center ${temas[tema].botonClaro} text-white font-semibold px-4 py-2 rounded-lg shadow-lg cursor-pointer transition duration-300 w-full mt-3`}
            >
              Cambiar a Pro
            </button>
          )}
        </div>
      )}
      <button
        onClick={salir}
        className={`fixed bottom-4 right-4 ${temas[tema].botonClaro} text-white font-semibold px-4 py-2 rounded-lg shadow-lg cursor-pointer transition duration-300`}
      >
        Cerrar sesión
      </button>
    </>
  )
}

export default Header