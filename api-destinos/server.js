//con este archivo se busca crear el server de la app//

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT ||3000;

app.use(cors());

// Permite recibir datos JSON en las solicitudes
app.use(express.json());

// Datos temporales de nuestra API
let destinos = [
  {
    id: 1,
    nombre: "Jardín",
    departamento: "Antioquia",
    descripcion: "Pueblo cafetero de fachadas coloridas, montañas y cascadas.",
    imagen: "https://images.unsplash.com/photo-1565969142815-787d35173249?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
  },
  {
    id: 2,
    nombre: "Cartagena",
    departamento: "Bolívar",
    descripcion: "Ciudad amurallada del Caribe con historia, playas y calles coloniales.",
    imagen: "https://images.unsplash.com/photo-1583531352515-8884af319dc1?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
  },
  {
    id: 3,
    nombre: "Salento",
    departamento: "Quindío",
    descripcion: "Puerta de entrada al Valle de Cocora y sus palmas de cera.",
    imagen: "https://images.unsplash.com/photo-1613498248726-8922766cebdb?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
  }
];

// GET: consultar todos los destinos
app.get("/api/destinos", (req, res) => {
  res.json(destinos);
});

// GET: consultar un destino por su ID
app.get("/api/destinos/:id", (req, res) => {
  const id = Number(req.params.id);

  const destino = destinos.find(d => d.id === id);

  if (!destino) {
    return res.status(404).json({
      mensaje: "Destino no encontrado"
    });
  }

  res.json(destino);
});

// POST: crear un destino
app.post("/api/destinos", (req, res) => {
  const { nombre, departamento, descripcion, imagen } = req.body;

  if (!nombre || !departamento ) {
    return res.status(400).json({
      mensaje: "Debes enviar nombre y departamento"
    });
  }

  const nuevoDestino = {
    id: Date.now(),
    nombre,
    departamento,
    descripcion: descripcion || "",
    imagen: imagen || ""
  };

  destinos.push(nuevoDestino);
  res.status(201).json(nuevoDestino);
});



// DELETE: eliminar un destino
app.delete("/api/destinos/:id", (req, res) => {
  const id = Number(req.params.id);

  const existe = destinos.some(destino =>destino.id ===id)

  if (!existe) {
    return res.status(404).json({
      mensaje: "Destino no encontrado"
    });
  }

  destinos = destinos.filter(destino=>destino.id !==id)

  res.json({
    mensaje: "Destino eliminado correctamente"
  });
});

// Iniciar servidor
app.listen(PORT,"0.0.0.0",() => {
  console.log("API activa en http://localhost:" + PORT);
});