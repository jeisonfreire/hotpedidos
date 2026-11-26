// PASO 3 - PRODUCTOS DE TU PROYECTO J.A PEDIDOS, BROO
const productos = [
    { id: 1, nombre: "Camaron Apanado", precio: 15.50, categoria: "Mariscos", foto: "imagenes/camaron.jpg" },
    { id: 2, nombre: "Ceviche Mixto", precio: 5.50, categoria: "Mariscos", foto: "imagenes/ceviche.jpg" },
    { id: 3, nombre: "Arroz con Mariscos", precio: 9.00, categoria: "Mariscos", foto: "imagenes/arroz.jpg" },
    { id: 4, nombre: "Brochetas", precio: 6.50, categoria: "Pollos", foto: "imagenes/brochetas.jpg" },
    { id: 5, nombre: "Combo Familiar", precio: 15.00, categoria: "Combos", foto: "imagenes/combo.jpg" }
];

const listaProductos = document.getElementById("listaProductos");

function mostrarProductos(lista) {
    let html = "";
    for (let i = 0; i < lista.length; i++) {
        const p = lista[i];
        html = html + "<li><img src='" + p.foto + "' class='foto-producto'><h3>" + p.nombre + "</h3><p>$" + p.precio.toFixed(2) + "</p><button onclick='agregarAlCarrito(" + p.id + ")'>Agregar</button></li>";
    }
    if (lista.length === 0) {
        html = "<li>No se encontraron productos.</li>";
    }
    listaProductos.innerHTML = html;
}

if (listaProductos != null) {
    mostrarProductos(productos);
}

// PASO 4 - BUSCADOR Y FILTRO POR CATEGORIA, BROO
const campoBuscar = document.getElementById("campoBuscar");
const selCategoria = document.getElementById("selCategoria");
const botonFiltrar = document.getElementById("btnFiltrar");

function filtrarProductos() {
    const texto = campoBuscar.value.trim().toLowerCase();
    const categoria = selCategoria.value;
    const resultado = [];
    for (let i = 0; i < productos.length; i++) {
        const p = productos[i];
        const coincideNombre = p.nombre.toLowerCase().includes(texto);
        const coincideCategoria = categoria === "todas" || p.categoria === categoria;
        if (coincideNombre && coincideCategoria) {
            resultado.push(p);
        }
    }
    mostrarProductos(resultado);
}

if (campoBuscar != null && selCategoria != null && botonFiltrar != null) {
    botonFiltrar.addEventListener("click", filtrarProductos);
}

// PASO 5 - CARRITO CON CANTIDAD Y TOTAL, BROO
let carrito = [];
const textoCarrito = document.getElementById("textoCarrito");
const botonVaciar = document.getElementById("btnVaciar");

function agregarAlCarrito(id) {
    for (let i = 0; i < productos.length; i++) {
        if (productos[i].id === id) {
            carrito.push(productos[i]);
        }
    }
    mostrarCarrito();
}

function mostrarCarrito() {
    if (textoCarrito === null) {
        return;
    }
    if (carrito.length === 0) {
        textoCarrito.textContent = "El carrito está vacío.";
        return;
    }
    let total = 0;
    for (let i = 0; i < carrito.length; i++) {
        total = total + carrito[i].precio;
    }
    textoCarrito.textContent = "Productos: " + carrito.length + " | Total: $" + total.toFixed(2);
}

function vaciarCarrito() {
    carrito = [];
    mostrarCarrito();
}

if (botonVaciar != null) {
    botonVaciar.addEventListener("click", vaciarCarrito);
}

mostrarCarrito();

// PASO 6 - TU PROPIA FUNCIÓN CON PARÁMETROS Y RETURN, BROO
function aplicarDescuento(precio, porcentaje) {
    return precio - precio * porcentaje / 100;
}

// ===== CUENTAS J.A PEDIDOS - PASA SOLO A PAGINA2 =====
const cuUsuario = document.getElementById("cuUsuario");
const cuClave = document.getElementById("cuClave");
const mensajeCuenta = document.getElementById("mensajeCuenta");
const estadoSesion = document.getElementById("estadoSesion");
const listaPedidos = document.getElementById("listaPedidos");
const botonRegistro = document.getElementById("btnRegistro");
const botonEntrar = document.getElementById("btnEntrar");
const botonSalir = document.getElementById("btnSalir");

let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
let usuarioActivo = localStorage.getItem("usuarioActivo");

function avisar(texto, color) {
    if (mensajeCuenta !== null) {
        mensajeCuenta.textContent = texto;
        mensajeCuenta.style.color = color;
    }
}

function buscarUsuario(nombre) {
    for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].usuario === nombre) return usuarios[i];
    }
    return null;
}

function registrar() {
    const nombre = cuUsuario.value.trim();
    const clave = cuClave.value;
    if (nombre === "" || clave.length < 6) {
        avisar("Escribe un usuario y una contraseña de al menos 6 caracteres.", "red");
        return;
    }
    if (buscarUsuario(nombre) !== null) {
        avisar("Ese usuario ya existe. Dale a Iniciar sesión.", "red");
        return;
    }
    usuarios.push({ usuario: nombre, clave: clave });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    avisar("Cuenta creada. Entrando a la tienda...", "green");
    usuarioActivo = nombre;
    localStorage.setItem("usuarioActivo", usuarioActivo);
    setTimeout(function(){ window.location.href = "pagina2.html"; }, 800);
}

function iniciarSesion() {
    const u = buscarUsuario(cuUsuario.value.trim());
    if (u === null || u.clave !== cuClave.value) {
        avisar("Usuario o contraseña incorrectos.", "red");
        return;
    }
    usuarioActivo = u.usuario;
    localStorage.setItem("usuarioActivo", usuarioActivo);
    avisar("Bienvenido, " + usuarioActivo + ". Entrando...", "green");
    actualizarSesion();
    setTimeout(function(){ window.location.href = "pagina2.html"; }, 800);
}

function cerrarSesion() {
    usuarioActivo = null;
    localStorage.removeItem("usuarioActivo");
    avisar("Sesión cerrada.", "green");
    actualizarSesion();
}

function mostrarPedidos() {
    if (listaPedidos === null) return;
    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    let html = "";
    for (let i = 0; i < pedidos.length; i++) {
        if (pedidos[i].usuario === usuarioActivo) {
            html += "<li>" + pedidos[i].fecha + " - " + pedidos[i].cantidad + " producto(s) - $" + pedidos[i].total.toFixed(2) + "</li>";
        }
    }
    if (html === "") html = "<li>Aún no tienes pedidos.</li>";
    listaPedidos.innerHTML = html;
}

function actualizarSesion() {
    if (estadoSesion !== null) {
        estadoSesion.textContent = usuarioActivo === null ? "Sin sesión." : "Sesión activa: " + usuarioActivo;
    }
    mostrarPedidos();
}

if (botonRegistro !== null && botonEntrar !== null && botonSalir !== null) {
    botonRegistro.addEventListener("click", registrar);
    botonEntrar.addEventListener("click", iniciarSesion);
    botonSalir.addEventListener("click", cerrarSesion);
}
actualizarSesion();

// ===== COMPRA =====
const botonComprar = document.getElementById("btnComprar");
const mensajeCompra = document.getElementById("mensajeCompra");

function calcularTotalCarrito() {
    if (typeof carrito === "undefined") return 0;
    let total = 0;
    for (let i = 0; i < carrito.length; i++) total += carrito[i].precio;
    return total;
}

function finalizarCompra() {
    if (mensajeCompra === null) return;
    if (usuarioActivo === null) {
        mensajeCompra.textContent = "Inicia sesión para comprar.";
        mensajeCompra.style.color = "red";
        return;
    }
    if (typeof carrito === "undefined" || carrito.length === 0) {
        mensajeCompra.textContent = "Tu carrito está vacío.";
        mensajeCompra.style.color = "red";
        return;
    }
    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    const pedido = { usuario: usuarioActivo, cantidad: carrito.length, total: calcularTotalCarrito(), fecha: new Date().toLocaleDateString() };
    pedidos.push(pedido);
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
    mensajeCompra.textContent = "Gracias, " + usuarioActivo + ". Pedido registrado por $" + pedido.total.toFixed(2) + ".";
    mensajeCompra.style.color = "green";
    if (typeof vaciarCarrito === "function") vaciarCarrito();
    mostrarPedidos();
}

if (botonComprar !== null) botonComprar.addEventListener("click", finalizarCompra);
// SCRIPT SUPER SEGURO - HOT PEDIDOS - BROO
var miLista = [];

function limpiar(t){
  return String(t).replace(/</g,"").replace(/>/g,"").replace(/"/g,"").replace(/'/g,"").slice(0,50);
}

function agregar(nombre, precio){
  nombre = limpiar(nombre);
  precio = Number(precio);
  if(!precio || precio <= 0) return;
  miLista.push({nombre:nombre, precio:precio});
  actualizar();
  alert(nombre + " agregado a tu Nave");
}

function actualizar(){
  var suma = 0;
  for(var i=0;i<miLista.length;i++){ suma += miLista[i].precio; }
  var totalFinal = miLista.length>0 ? suma+0.15 : 0;
  var e1 = document.getElementById('totalArriba');
  if(e1) e1.innerText = totalFinal.toFixed(2);
  var e2 = document.getElementById('subtotal');
  if(e2) e2.innerText = suma.toFixed(2);
  var e3 = document.getElementById('total');
  if(e3) e3.innerText = totalFinal.toFixed(2);
  var texto = "";
  for(var j=0;j<miLista.length;j++){ texto += "<p>"+limpiar(miLista[j].nombre)+" - $"+miLista[j].precio+"</p>"; }
  var lista = document.getElementById('lista');
  if(lista) lista.innerHTML = texto || "<p>vacio</p>";
}

function miUbicacion(){
  var t = document.getElementById('textoUbi');
  if(t) t.innerText = "Buscando tu ubicación...";
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(pos){
      var lat = pos.coords.latitude;
      var lon = pos.coords.longitude;
      var link = "https://www.google.com/maps?q="+lat+","+lon;
      document.getElementById('linkUbi').value = link;
      if(t) t.innerText = "✅ Ubicación lista";
    }, function(){ if(t) t.innerText = "Activa el GPS porfa"; });
  }
}

function pedir(){
  if(miLista.length==0){ alert("Tu Nave esta vacia"); return; }
  var nombre = limpiar(document.getElementById('nombreCliente').value);
  var dir = limpiar(document.getElementById('direccion').value);
  var ref = limpiar(document.getElementById('referencia').value);
  var ubi = document.getElementById('linkUbi').value;
  var m = "Hola HOT PEDIDOS quiero pedir:%0A";
  for(var k=0;k<miLista.length;k++){ m += "- "+limpiar(miLista[k].nombre)+" $"+miLista[k].precio+"%0A"; }
  m += "%0A Total: $"+document.getElementById('total').innerText+"%0A Nombre: "+nombre+"%0A Direccion: "+dir+"%0A Referencia: "+ref;
  if(ubi!=""){ m += "%0A Mi ubicación: "+ubi; }
  window.open("https://wa.me/593999999999?text="+m);
}