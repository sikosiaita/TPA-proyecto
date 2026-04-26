# 🚚 PinkBox

Sistema web de **Logística y Despacho Inteligente** orientado a la simulación y gestión eficiente de envíos desde centros de distribución hacia clientes finales.  
Desarrollado como proyecto académico para la carrera de Ingeniería Civil en Informática - Universidad de Los Lagos.

---

## 📌 Descripción General

PinkBox permite administrar procesos logísticos modernos mediante una plataforma interactiva que integra:

- Gestión jerárquica de carga
- Cálculo dinámico de costos de despacho
- Selección inteligente de transporte
- Monitoreo en tiempo real en mapa
- Control de estados de entrega

El sistema está diseñado para funcionar **sin base de datos**, utilizando estructuras en memoria y patrones de diseño orientados a objetos.

---

## 🎯 Objetivo del Proyecto

Simular un sistema logístico real capaz de:

- Organizar productos en cajas, pallets y camiones.
- Calcular costos automáticamente según servicios adicionales.
- Elegir el mejor transporte según distancia y peso.
- Visualizar rutas y movimientos.
- Gestionar estados de despacho de forma coherente.

---

# 🧩 Módulos Principales

## 📦 Módulo A: Gestor de Carga Jerárquica

Permite crear estructuras de carga complejas usando contenedores e ítems.

### Ejemplo:

Camión  
└── Pallet  
  └── Caja  
    └── Sobre

### Funcionalidades:

- Calcular peso total recursivamente.
- Calcular volumen total.
- Validar capacidad máxima.
- Organización flexible de carga.

---

## 💰 Módulo B: Calculadora de Costos Dinámicos

Permite agregar costos extra al despacho sin modificar el objeto base.

### Extras disponibles:

- Seguro
- Manejo frágil
- Impuesto territorial
- Servicio prioritario

### Resultado:

Costo Base + Extras = Total Final

---

## 🚛 Módulo C: Selector de Transporte Inteligente

El usuario puede elegir entre distintos medios de transporte.

### Tipos:

| Transporte | Algoritmo |
|----------|-----------|
| Drone | Distancia Euclidiana |
| Motocicleta | Distancia Manhattan |
| Camión | Ruta mínima tipo Dijkstra |

### Consideraciones:

- Peso máximo soportado
- Tiempo estimado
- Distancia recorrida

---

## 📦 Módulo C: Gestión de Estados

Cada envío pasa por un ciclo controlado:

```text
En Preparación → En Tránsito → Entregado
                        ↘
                       Fallido
```
---
## 🛠️ Tecnologías

- TypeScript  
- React  
- Leaflet.js  
- Tailwind CSS  

## 📚 Patrones de Diseño
