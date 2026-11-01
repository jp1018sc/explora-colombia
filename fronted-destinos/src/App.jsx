import { useEffect, useState } from "react";
import "./App.css";

// En producción usa la API de Render; en tu PC puedes definir VITE_API_URL
// en un archivo .env.local para apuntar a http://localhost:3000/api/destinos
const API =
  import.meta.env.VITE_API_URL ||
  "https://explora-colombia-7iks.onrender.com/api/destinos";

function App() {
  const [destinos, setDestinos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Consultar los destinos
  const cargarDestinos = async () => {
    try {
      setError("");
      const respuesta = await fetch(API);

      if (!respuesta.ok) {
        throw new Error("No se pudieron cargar los destinos");
      }

      const datos = await respuesta.json();
      setDestinos(datos);
    } catch (error) {
      console.error("Error:", error);
      setError("No se pudo conectar con el servidor. Intenta de nuevo en unos segundos.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDestinos();
  }, []);

  // Agregar un destino
  const agregarDestino = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombre,
          departamento,
          descripcion,
          imagen
        })
      });

      if (!respuesta.ok) {
        throw new Error("No se pudo agregar el destino");
      }

      setNombre("");
      setDepartamento("");
      setDescripcion("");
      setImagen("");

      cargarDestinos();
    } catch (error) {
      alert(error.message);
    }
  };

  // Eliminar un destino
  const eliminarDestino = async (id) => {
    if (!window.confirm("¿Deseas eliminar este destino?")) {
      return;
    }

    try {
      const respuesta = await fetch(`${API}/${id}`, {
        method: "DELETE"
      });

      if (!respuesta.ok) {
        throw new Error("No se pudo eliminar");
      }

      cargarDestinos();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="contenedor">
      <header>
        <h1>Explora Colombia</h1>
        <p>Descubre los mejores destinos turísticos</p>
      </header>

      <section className="formulario">
        <h2>Agregar nuevo destino</h2>

        <form onSubmit={agregarDestino}>
          <input
            type="text"
            placeholder="Nombre del destino"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Departamento"
            value={departamento}
            onChange={(e) => setDepartamento(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Breve descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />

          <input
            type="text"
            placeholder="URL de la imagen (opcional)"
            value={imagen}
            onChange={(e) => setImagen(e.target.value)}
          />

          <button type="submit">Agregar destino</button>
        </form>
      </section>

      <section className="lista">
        <h2>Destinos disponibles</h2>

        {cargando && (
          <p>Cargando destinos... (la primera carga puede tardar hasta un minuto)</p>
        )}

        {error && <p>{error}</p>}

        {!cargando && !error && destinos.length === 0 && (
          <p>No hay destinos todavía. ¡Agrega el primero!</p>
        )}

        {destinos.map((destino) => (
          <article className="destino" key={destino.id}>
            {destino.imagen && (
              <img
                className="foto"
                src={destino.imagen}
                alt={destino.nombre}
                onError={(e) => (e.target.style.display = "none")}
              />
            )}

            <div className="info">
              <h3>{destino.nombre}</h3>
              <p className="departamento">{destino.departamento}</p>
              <p className="descripcion">{destino.descripcion}</p>
            </div>

            <button
              className="eliminar"
              onClick={() => eliminarDestino(destino.id)}
            >
              Eliminar
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}

export default App;