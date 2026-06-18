import { useEffect, useState } from "react"
import Header from "./Header"
import { temas } from "../temas"

const URL_NOTAS = "https://miapp-ludi-backend.onrender.com/routes/notas_route.php"
const URL_USUARIOS = "https://miapp-ludi-backend.onrender.com/routes/usuario_route.php"

const categorias = ["Escolar", "Trabajo", "Hogar", "Personal", "Ideas", "Otro"]

const Notas = ({ salir, tema, setTema }) => {
  const [notas, setNotas] = useState([])
  const [titulo, setTitulo] = useState("")
  const [contenido, setContenido] = useState("")
  const [categoria, setCategoria] = useState("")
  const [urgencia, setUrgencia] = useState("")
  const [vistaNotas, setVistaNotas] = useState(false)
  const [notaSeleccionada, setNotaSeleccionada] = useState(null)
  const [plan, setPlan] = useState("")
  const [categoriaAbierta, setCategoriaAbierta] = useState(null)

  const obtenerNotas = async () => {
    try {
      const token = localStorage.getItem("token")
      const respuesta = await fetch(URL_NOTAS, {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token
        }
      })
      const datos = await respuesta.json()
      setNotas(datos)
    } catch (error) { }
  }

  const obtenerUsuario = async () => {
    try {
      const correo = localStorage.getItem("correo")
      const respuesta = await fetch(URL_USUARIOS, { method: "GET" })
      const datos = await respuesta.json()
      const usuario = datos.filter((u) => u.email === correo)[0]
      if (usuario) {
        setPlan(usuario.plan)
      }
    } catch (error) { }
  }

  const agregarNota = async (evt) => {
    evt.preventDefault()
    if (plan !== "premium" && notas.length >= 5) return
    try {
      const token = localStorage.getItem("token")
      const respuesta = await fetch(URL_NOTAS, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ titulo, contenido, categoria, urgencia })
      })
      if (respuesta.status === 201) {
        setTitulo("")
        setContenido("")
        setCategoria("")
        setUrgencia("")
        obtenerNotas()
      }
    } catch (error) { }
  }

  const eliminarNota = async (id) => {
    try {
      const token = localStorage.getItem("token")
      await fetch(URL_NOTAS, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ id })
      })
      obtenerNotas()
    } catch (error) { }
  }

  const guardarCambios = async (evt) => {
    evt.preventDefault()
    try {
      const token = localStorage.getItem("token")
      const respuesta = await fetch(URL_NOTAS, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
          id: notaSeleccionada.id,
          titulo: notaSeleccionada.titulo,
          contenido: notaSeleccionada.contenido,
          categoria: notaSeleccionada.categoria,
          urgencia: notaSeleccionada.urgencia
        })
      })
      if (respuesta.status === 200) {
        setNotaSeleccionada(null)
        obtenerNotas()
      }
    } catch (error) { }
  }

  useEffect(() => {
    obtenerNotas()
    obtenerUsuario()
  }, [])

  if (notaSeleccionada) {
    return (
      <div className="w-screen min-h-screen bg-white">
        <Header salir={salir} tema={tema} setTema={setTema} />
        <div className="flex justify-center px-4 mt-4">
          <div className="w-full max-w-2xl">
            <button
              onClick={() => setNotaSeleccionada(null)}
              className={`${temas[tema].texto} mb-4 cursor-pointer hover:underline`}
            >
              ← Volver
            </button>
            <form onSubmit={guardarCambios} className={`flex flex-col gap-3 border ${temas[tema].borde} rounded-lg p-4 shadow`}>
              <h2 className={`text-xl font-bold ${temas[tema].texto}`}>Editar nota</h2>
              <input
                type="text"
                value={notaSeleccionada.titulo}
                onChange={(e) => setNotaSeleccionada({ ...notaSeleccionada, titulo: e.target.value })}
                className={`border ${temas[tema].borde} rounded px-4 py-2 outline-none focus:shadow-lg placeholder-slate-500`}
              />
              <input
                type="text"
                value={notaSeleccionada.contenido}
                onChange={(e) => setNotaSeleccionada({ ...notaSeleccionada, contenido: e.target.value })}
                className={`border ${temas[tema].borde} rounded px-4 py-2 outline-none focus:shadow-lg placeholder-slate-500`}
              />
              <select
                value={notaSeleccionada.categoria || ""}
                onChange={(e) => setNotaSeleccionada({ ...notaSeleccionada, categoria: e.target.value })}
                className={`border ${temas[tema].borde} rounded px-4 py-2 outline-none focus:shadow-lg text-slate-500`}
              >
                <option value="">Selecciona categoría</option>
                <option value="Escolar">Escolar</option>
                <option value="Trabajo">Trabajo</option>
                <option value="Hogar">Hogar</option>
                <option value="Personal">Personal</option>
                <option value="Ideas">Ideas</option>
                <option value="Otro">Otro</option>
              </select>
              <select
                value={notaSeleccionada.urgencia || ""}
                onChange={(e) => setNotaSeleccionada({ ...notaSeleccionada, urgencia: e.target.value })}
                className={`border ${temas[tema].borde} rounded px-4 py-2 outline-none focus:shadow-lg text-slate-500`}
              >
                <option value="">Selecciona prioridad</option>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
              <button
                type="submit"
                className={`${temas[tema].boton} text-white font-semibold px-4 py-2 rounded-lg shadow-lg cursor-pointer transition duration-300`}
              >
                Guardar cambios
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  if (vistaNotas) {
    return (
      <div className="w-screen min-h-screen bg-white">
        <Header salir={salir} tema={tema} setTema={setTema} />
        <div className="flex justify-center px-4 mt-4">
          <div className="w-full max-w-2xl">
            <button
              onClick={() => setVistaNotas(false)}
              className={`${temas[tema].texto} mb-4 cursor-pointer hover:underline`}
            >
              ← Volver
            </button>
            <h2 className={`text-2xl font-bold text-center ${temas[tema].texto} mb-6`}>Mis notas</h2>
            {plan === "premium" ? (
              <div className="flex flex-col gap-3">
                {categorias.map((cat) => {
                  const notasDeCategoria = notas.filter((n) => n.categoria === cat)
                  return (
                    <div key={cat} className={`border ${temas[tema].borde} rounded-lg shadow`}>
                      <button
                        onClick={() => setCategoriaAbierta(categoriaAbierta === cat ? null : cat)}
                        className={`w-full flex justify-between items-center px-4 py-3 cursor-pointer ${temas[tema].texto} font-bold`}
                      >
                        <span>{cat} ({notasDeCategoria.length})</span>
                        <span>{categoriaAbierta === cat ? "−" : "+"}</span>
                      </button>
                      {categoriaAbierta === cat && (
                        <div className="p-4">
                          {notasDeCategoria.length === 0 && (
                            <p className="text-slate-500 text-center">No hay notas en esta categoría</p>
                          )}
                          <ul className="flex flex-col gap-3">
                            {notasDeCategoria.map((nota) => (
                              <li key={nota.id} className={`border ${temas[tema].borde} rounded-lg p-4 shadow`}>
                                <h2 className={`text-xl font-bold ${temas[tema].texto}`}>{nota.titulo}</h2>
                                <p className="text-slate-600">{nota.contenido}</p>
                                <div className="flex gap-2 mt-2">
                                  {nota.urgencia && (
                                    <span className={`text-xs ${temas[tema].etiqueta} px-2 py-1 rounded-full`}>{nota.urgencia}</span>
                                  )}
                                </div>
                                <div className="flex gap-2 mt-3 justify-end">
                                  <button
                                    onClick={() => setNotaSeleccionada(nota)}
                                    className={`${temas[tema].boton} text-white font-semibold px-4 py-1 rounded-lg cursor-pointer transition duration-300`}
                                  >
                                    Editar
                                  </button>
                                  <button
                                    onClick={() => eliminarNota(nota.id)}
                                    className={`${temas[tema].botonClaro} text-white font-semibold px-4 py-1 rounded-lg cursor-pointer transition duration-300`}
                                  >
                                    Eliminar
                                  </button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div>
                {notas.length === 0 && (
                  <p className="text-slate-500 text-center">Aún no tienes ninguna nota</p>
                )}
                <ul className="flex flex-col gap-3">
                  {notas.map((nota) => (
                    <li key={nota.id} className={`border ${temas[tema].borde} rounded-lg p-4 shadow`}>
                      <h2 className={`text-xl font-bold ${temas[tema].texto}`}>{nota.titulo}</h2>
                      <p className="text-slate-600">{nota.contenido}</p>
                      <div className="flex gap-2 mt-2">
                        {nota.categoria && (
                          <span className={`text-xs ${temas[tema].etiqueta} px-2 py-1 rounded-full`}>{nota.categoria}</span>
                        )}
                        {nota.urgencia && (
                          <span className={`text-xs ${temas[tema].etiqueta} px-2 py-1 rounded-full`}>{nota.urgencia}</span>
                        )}
                      </div>
                      <div className="flex gap-2 mt-3 justify-end">
                        <button
                          onClick={() => setNotaSeleccionada(nota)}
                          className={`${temas[tema].boton} text-white font-semibold px-4 py-1 rounded-lg cursor-pointer transition duration-300`}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => eliminarNota(nota.id)}
                          className={`${temas[tema].botonClaro} text-white font-semibold px-4 py-1 rounded-lg cursor-pointer transition duration-300`}
                        >
                          Eliminar
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-screen h-screen bg-white">
      <Header salir={salir} tema={tema} setTema={setTema} />
      <div className="flex flex-col items-center justify-center h-5/6 px-4">
        <div className="w-full max-w-2xl">
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setVistaNotas(true)}
              className={`border ${temas[tema].borde} ${temas[tema].texto} font-semibold px-6 py-2 rounded-lg cursor-pointer transition duration-300`}
            >
              Ver mis notas
            </button>
          </div>
          {plan !== "premium" && notas.length >= 5 && (
            <p className={`${temas[tema].texto} text-sm text-center mb-2`}>
              Alcanzaste el límite de 5 notas, cámbiate a Pro para agregar más
            </p>
          )}
          <form onSubmit={agregarNota} className={`flex flex-col gap-3 border ${temas[tema].borde} rounded-lg p-4 shadow`}>
            <h2 className={`text-xl font-bold ${temas[tema].texto}`}>Nueva nota</h2>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título"
              required
              className={`border ${temas[tema].borde} rounded px-4 py-2 outline-none focus:shadow-lg placeholder-slate-500`}
            />
            <input
              type="text"
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              placeholder="Contenido"
              required
              className={`border ${temas[tema].borde} rounded px-4 py-2 outline-none focus:shadow-lg placeholder-slate-500`}
            />
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className={`border ${temas[tema].borde} rounded px-4 py-2 outline-none focus:shadow-lg text-slate-500`}
            >
              <option value="">Selecciona categoría</option>
              <option value="Escolar">Escolar</option>
              <option value="Trabajo">Trabajo</option>
              <option value="Hogar">Hogar</option>
              <option value="Personal">Personal</option>
              <option value="Ideas">Ideas</option>
              <option value="Otro">Otro</option>
            </select>
            <select
              value={urgencia}
              onChange={(e) => setUrgencia(e.target.value)}
              className={`border ${temas[tema].borde} rounded px-4 py-2 outline-none focus:shadow-lg text-slate-500`}
            >
              <option value="">Selecciona prioridad</option>
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>
            <button
              type="submit"
              className={`${temas[tema].boton} text-white font-semibold px-4 py-2 rounded-lg shadow-lg cursor-pointer transition duration-300`}
            >
              Agregar
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Notas