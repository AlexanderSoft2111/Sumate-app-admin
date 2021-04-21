import { } from './interfaces';

export interface Usuario{
    id: string;
    nombre: string;
    apellido: string;
    celular: string;
    email: string;
    rol: Rol;
    contrasena: string;
    cedula: string;
    FechaCreacion: Date;
    estado: Estado,
}

export interface Cliente{
    id: string;
    codigo: string;
    cedula: string;
    nombre: string;
    apellido: string;
    email: string;
    direccion: string,
    latitud: number,
    longitud: number,
    telefono: string;
    FechaCreacion: any;
    rol: Rol;
    imagenBig: string;
    imagenSmall: string;
    tipoCliente: Tipo;
    contrasena: string;
    emailRegistro: string;
    estado: Estado;
}

export interface identificacionCliente{
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    direccion: string,
    latitud: number,
    longitud: number,
    telefono: string;
    FechaCreacion: any;
    tipoVisita: Visita;
    estado: Estado;
}

export interface Producto{
    id: string;
    codigo: string;
    descripcion: string;
    cantidadDisponible: number;
    FechaCreacion: Date;
    precio: number;
    imagen: string;
    imagenSmall: string;
    calificacion: number;
    detalle: string;
    cpVenta: number;
} 

export interface Pedido{
    id: string;
    cliente: Cliente;
    productos: ProductoPedido[];
    precioTotal: number;
    estado: EstadoPedido;
    fecha: any;
    fechaEnvio: any;
    valorCobrado: number;
} 

export interface ProductoPedido{
    producto: Producto;
    cantidad: number;
    precio: number;
}

export interface Transporte{
    id: string;
    nombre: string;
    cedula: string;
    celular: string;
    placa: string;
    correo: string;
    pedidos: Pedido[]
}


export type Visita = "Visitado" | "Volver a visitar" | "inactivo"
export type Rol = "Administrador" | "Vendedor" | 'Cliente'
export type Tipo = "Mayorista" | "Minorista"
export type EstadoPedido = "Pendiente" | "Alistamiento" | "Preparado" | "Enviado" | "Entregado"
export type Estado = "activo" | "inactivo"