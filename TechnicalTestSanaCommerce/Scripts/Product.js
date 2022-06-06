//variable para almecenar temporalmente los productos
let products = [];

$(document).ready(function () {
    //cuando la pagina cargue invocamos la funcion getProducts para obtener todos los productos
    getProducts();
});

//events
$("#btnSaveProduct").click(function () {
    saveProduct();
});

$("#btnDeleteProduct").click(function () {
    deleteProduct();
});

$("#btnAddProduct").click(function () {
    $('#formProduct')[0].reset();
    $("#txtIdProduct").val("0");
});

$('#confirmDeleteModal').on('hidden.bs.modal', function () {
    $("#txtIdProduct").val("0");
});

$('#selStorage').on('change', function () {
    getProducts();
});

//funcion para guardar los productos ya sea almacenamiento temporal o csv
function saveProduct() {
    if ($("#txtPath").val() === "" && $("#selStorage").val() === "1") {
        $('#errorPathModal').modal();
        $('#modalProduct').modal('toggle');
        return;
    }
    //construimos el objeto a guardar
    let product = {
        IdProduct: $("#txtIdProduct").val() === "undefined" ? 0 : $("#txtIdProduct").val(),
        Number: $("#txtNumber").val(),
        Title: $("#txtTitle").val(),
        Price: $("#txtPrice").val()
    }
    if ($("#selStorage").val() === "1") {
        //si el tipo de almacenamiento es csv invocamos el metodo en el controlador para almacenar el producto
        $.ajax({
            type: "POST",
            url: "/Product/SaveProduct",
            data: JSON.stringify({ "Product": product, "path": $("#txtPath").val() }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data) {
                    getProducts();
                    $('#formProduct')[0].reset();
                    $('#modalProduct').modal('toggle');
                }
                else {
                    alert(data);
                }
            }
        });
    }
    else if (product.IdProduct === '0') {
        //variable para determinar el id a crear en el objeto "products"
        var accumulator = 0;
        if (products.length === 0) {
            accumulator = 1;
        }
        else {
            $.each(products, function (index, x) {
                if (x.IdProduct >= accumulator) {
                    accumulator = x.IdProduct + 1;
                }
            });
        }
        product.IdProduct = accumulator;
        products.push(product);
        getProducts();
        $('#formProduct')[0].reset();
        $('#modalProduct').modal('toggle');
    }
    else {
        //iteramos los productos y actualizamos el producto correspondiente
        $.each(products, function (index, x) {
            if (x.IdProduct + "" === product.IdProduct) {
                products[index] = product;
            }
        });
        getProducts();
        $('#formProduct')[0].reset();
        $('#modalProduct').modal('toggle');
    }
    
}

//funcion para eliminar los productos ya sea almacenamiento temporal o csv
function deleteProduct() {
    if ($("#txtPath").val() === "" && $("#selStorage").val() === "1") {
        $('#errorPathModal').modal();
        $('#confirmDeleteModal').modal('toggle');
        return;
    }
    if ($("#selStorage").val() === "1") {
        $.ajax({
            type: "POST",
            url: "/Product/DeleteProduct",
            data: JSON.stringify({ "idProduct": $("#txtIdProduct").val(), "path": $("#txtPath").val() }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data) {
                    $('#confirmDeleteModal').modal('toggle');
                    getProducts();
                }
                else {
                    alert(data);
                }
            }
        });
    }
    else {
        //variable temporal para almacenar productos
        var indiceDelete = 0;
        //iteramos los productos y eliminamos el que corresponde del objeto "products"
        $.each(products, function (index, x) {
            if (x.IdProduct + "" === $("#txtIdProduct").val()) {
                indiceDelete = index;
            }
        });
        products.splice(indiceDelete, 1);
        $('#confirmDeleteModal').modal('toggle');
        getProducts();
    }
}

//funcion para obtener los productos ya sea almacenamiento temporal o csv
function getProducts() {
    if ($("#txtPath").val() === "" && $("#selStorage").val() === "1") {
        $('#errorPathModal').modal();
        return;
    }
    if ($("#selStorage").val() === "1") {
        $.ajax({
            type: "POST",
            url: "/Product/GetProducts",
            data: JSON.stringify({ "path": $("#txtPath").val() }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                showProducts(data);
            }
        });
    }
    else {
        showProducts(products);
    }
}

//funcion para mostrar los productos en la tabla
function showProducts(data) {
    $("#bodyProducts").empty();
    $.each(data, function (i, item) {
        $("#bodyProducts").append("<tr><th scope=\"row\">" + item.IdProduct + "</th><td>" + item.Number + "</td><td>" + item.Title + "</td><td>" + Intl.NumberFormat('es-ES').format(item.Price) +
            "</td><td><button type=\"button\" data-toggle=\"modal\" onclick='editProduct(" + JSON.stringify(item) + ")' data-target=\"#modalProduct\" class=\"btn btn-success\">Edit</button></td>" +
            "<td><button type=\"button\" data-toggle=\"modal\" onclick='$(\"#txtIdProduct\").val(" + item.IdProduct + ")' data-target=\"#confirmDeleteModal\" class=\"btn btn-danger\">Delete</button></td></tr>")
    });
}

//funcion para traer los datos de un producto al formulario
function editProduct(product) {
    $("#txtIdProduct").val(product.IdProduct);
    $("#txtNumber").val(product.Number);
    $("#txtTitle").val(product.Title);
    $("#txtPrice").val(product.Price);
}