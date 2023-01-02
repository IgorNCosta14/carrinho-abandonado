const userId = Date.now();
let date = new Date();
let dateFormatted = `${date.getFullYear()}-${((date.getMonth()+1)<10?'0':'') + (date.getMonth()+1)}-${(date.getDate()<10?'0':'') + date.getDate()} ${date.getHours()}:${(date.getMinutes()<10?'0':'') + date.getMinutes()}`;

let socket;
let completeCart;
    
if(!socket) {
    socket = new io('https://carrinho-abandonado-yic75.ondigitalocean.app/');
}

socket.on("connected", (arg) => {
  console.log(arg);
});

socket.on("infoSent", (arg) => {
  console.log(arg);
});

const checkoutButton = document.getElementById("finalizarCompra");

checkoutButton.addEventListener("click",  purchaseComplete);

function purchaseComplete () {
    const purchaseCompleteError = document.querySelectorAll("div.fancybox-overlay.fancybox-overlay-fixed");
    
    if(purchaseCompleteError.length === 0) {
        socket.emit("checkoutComplete");
    }
}

function getDataToSend() {
    const userInfoObject = {
        reference_id: userId.toString(),
        reason_type: null,
        admin_url: "https://www.lojadabruna.com/",
        number: userId.toString(),
        customer_name: userObject.customer_name,
        customer_email: userObject.customer_email,
        customer_phone: userObject.customer_phone,
        billing_address: {
            name: userObject.customer_name,
            first_name: userObject.first_name,
            last_name: userObject.last_name,
            company: null,
            phone: userObject.customer_phone,
            address1: addressObject.address1,
            address2: addressObject.address2,
            city: addressObject.city,
            province: addressObject.province,
            province_code: addressObject.province_code,
            country: "Brazil",
            country_code: "BR",
            zip: addressObject.zip,
        },
        shipping_address: {
            name: userObject.customer_name,
            first_name: userObject.first_name,
            last_name: userObject.last_name,
            company: null,
            phone: userObject.customer_phone,
            address1: addressObject.address1,
            address2: addressObject.address2,
            city: addressObject.city,
            province: addressObject.province,
            province_code: addressObject.province_code,
            country: "Brazil",
            country_code: "BR",
            zip: addressObject.zip,
            latitude: null,
            longitude: null
        },
        line_items: productObject.userCart,
        currency: "BRL",
        total_price: productObject.totalPrice,
        subtotal_price: productObject.subtotalPrice,
        referring_site: "https://www.lojadabruna.com/",
        checkout_url: "https://www.lojadabruna.com/checkout",
        completed_at: dateFormatted,
        original_created_at: dateFormatted
    };
    
    return userInfoObject;
}

function getCartData() {
    productObject.userCart = [];
    const productArray = Array.from(document.querySelectorAll("tbody tr"));
    productArray.forEach(product => {
        if(!product.classList.contains('bg-dark')) {
            let listedProduct = {
                title: "",
                variant_title: "",
                quantity: 0,
                price: 0,
                path: "",
                image_url: "https://example.com/products/5678/image.jpg", 
                tracking_number: null
            };
            
            let productTitle = product.querySelector('div.produto-info');
            listedProduct.title = productTitle.textContent.split("\n                      ")[1];
            
            let productPrice = product.querySelector('div.preco-produto strong');
            listedProduct.price = parseFloat(productPrice.innerText.split("R$ ")[1]);
            
            let productSku = Array.from(product.querySelectorAll('div.produto-info ul li'));
            //listedProduct.tracking_number = productSku[0].querySelector("strong").textContent.split("\n                              ")[1].split("\n                            ")[0];
            let productVariantTitle = productSku[1].outerText.split("Tamanho: ")[1];
            
            let productQuantity = product.querySelector("td.conteiner-qtd div");
            listedProduct.quantity = parseInt(productQuantity.textContent);
            
            let productPath = listedProduct.title.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/ /g, "-");
            listedProduct.path = `https://www.lojadabruna.com/${productPath}`;
            
            productObject.userCart.push(listedProduct);
            
        } else {
            
            if (product.classList.contains('tr-checkout-total')) {
                productObject.totalPrice = parseFloat(product.querySelector('div.total').outerText.replace("R$ ", "").replace(".", "").replace(",",".")).toFixed(2);
            } else if (product.classList.contains('esconder-mobile')){
                if(!product.classList.contains('desconto-tr')) {
                    productObject.subtotalPrice = parseFloat(product.querySelector('div.subtotal').dataset.float).toFixed(2);
                }
            }
        }
    });
}

let isUpdate = false;

function getInfoWhenNewUser() {
    let inputChanged = false;
    
    const userEmailInput = document.querySelector("input#id_email");
    if(userObject.customer_email !== userEmailInput.value) {
        userObject.customer_email = userEmailInput.value;
        inputChanged = true;
    }
    
    const userNameInput = document.querySelector("input#id_nome");
    if(userObject.customer_name !== userNameInput.value) {
        userObject.customer_name = userNameInput.value;
        userObject.first_name = userObject.customer_name.split(" ")[0];
        userObject.last_name = userObject.customer_name.split(" ")[userObject.customer_name.split(" ").length - 1];
        inputChanged = true;
    }
    
    const userPhoneInput = document.querySelector("input#id_telefone_celular");
    if(userObject.customer_phone !== userPhoneInput.value) {
        userObject.customer_phone = `+55${userPhoneInput.value.replace(/\D/g,'')}`;
        inputChanged = true;
    }
    
    const userZipCodeInput = document.querySelector("input#id_cep");
    if(addressObject.zip !== userZipCodeInput.value) {
        addressObject.zip = userZipCodeInput.value.replace(/\D/g,'');
        inputChanged = true;
    }
    
    if(userZipCodeInput.value === "") {
        addressObject.address1 = "";
        addressObject.city = "";
        addressObject.province = "";
        addressObject.provinceCode = "";
        
    } else {
    
        const userAddressInput = document.querySelector("input#id_endereco");
        const userAddressNumberInput = document.querySelector("input#id_numero");
        if(addressObject.address1 !== `${userAddressInput.value}, ${userAddressNumberInput.value}`) {
            addressObject.address1 = `${userAddressInput.value}, ${userAddressNumberInput.value}`;
            addressObject.address2 = `${userAddressInput.value}, ${userAddressNumberInput.value}`;
            inputChanged = true;
        }
        
        const userCityInput = document.querySelector("input#id_cidade");
        if(addressObject.city !== userCityInput.value) {
            addressObject.city = userCityInput.value;
            inputChanged = true;
        }
            
        const userProvinceInput = document.querySelector("select#id_estado");
        if(addressObject.province !== userProvinceInput.options[userProvinceInput.selectedIndex].text) {
            addressObject.province = userProvinceInput.options[userProvinceInput.selectedIndex].text;
            inputChanged = true;
        }
        
        const userProvinceCodeInput = document.querySelector("select#id_estado").value;
        if(addressObject.provinceCode !== userProvinceCodeInput) {
            console.log(addressObject.provinceCode);
            addressObject.provinceCode = userProvinceCodeInput;
            inputChanged = true;
        }
        
    }
    
    let dataToSend;
    
    if(inputChanged === true) {
        if((userObject.customer_name !== '') && (userObject.customer_email !== '') && (userObject.customer_phone !== '')) {
            if(isUpdate === false) {
                dataToSend = getDataToSend();
                socket.emit("sendAbandonedCartInfo", dataToSend);
                isUpdate = true;
            } else {
                dataToSend = getDataToSend();
                socket.emit("updateAbandonedCartInfo", dataToSend);
            }
        } 
    }
}

const userInfo = Array.from(document.querySelectorAll("ul.caixa-info li"));

const userObject = {
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    first_name: "",
    last_name: "",
};

if(userInfo.length !== 0) {
    userObject.customer_name = userInfo[0].innerText.split("Nome: ")[1];
    userObject.customer_email = userInfo[1].innerText.split("Email: ")[1];
    userObject.customer_phone = `+55${userInfo[2].innerText.split("Celular: ")[1].replace(/\D/g,'')}`;
    userObject.first_name = userObject.customer_name.split(" ")[0];
    userObject.last_name = userObject.customer_name.split(" ")[userObject.customer_name.split(" ").length - 1];
}
//Get address data

const addressArray = Array.from(document.querySelectorAll("div.endereco.accordion-group"));
const addressObject = {
    address1: "",
    address2: "",
    city: "",
    province: "",
    province_code: "",
    country: "Brazil",
    country_code: "BR",
    zip: "",
};

function getAddress() {
    Array.from(document.querySelectorAll("input.endereco-principal")).forEach(function(input) {
        if(input.checked) {
            const address = document.querySelector(`div#e${input.id.split("idE")[1]} div.accordion-inner`).textContent.split("<br>")[0].split("\n                      ");
            addressObject.address1 = address[1].split("        ")[1];
            addressObject.address2 = address[1].split("        ")[1];
            addressObject.city = address[3].split("        ")[1].split(", ")[1].split(" / ")[0];
            addressObject.province = convertProvince(address[3].split("        ")[1].split(", ")[1].split(" / ")[1]);
            addressObject.province_code = address[3].split("        ")[1].split(", ")[1].split(" / ")[1];
            addressObject.zip = address[4].split("        ")[1];
        }
    });
}

//Get cart data
const productObject = {
    totalPrice: 0,
    subtotalPrice: 0,
    userCart: [],
};

let updateAbandonedCart = false;

const shippingShippingMethods = document.querySelector("div#formas-envio-wrapper");
shippingShippingMethods.addEventListener("click", function() {
    if(updateAbandonedCart === true) {
        setTimeout(function() {
            getAddress();
            getCartData();
            let dataToSend = getDataToSend();
            console.log(dataToSend);
            
            socket.emit("updateAbandonedCartInfo", dataToSend);
        }, 2000);
    }
});

if(userInfo.length !== 0) {
    getAddress();
    getCartData();
    let dataToSend = getDataToSend();
    
    socket.emit("sendAbandonedCartInfo", dataToSend);
    updateAbandonedCart = true;

} else {
    let inputsArray = [];
    
    inputsArray.push(document.querySelector('input#id_email'));
    inputsArray.push(document.querySelector('input#id_nome'));
    inputsArray.push(document.querySelector('input#id_telefone_celular'));
    inputsArray.push(document.querySelector('input#id_cep'));
    inputsArray.push(document.querySelector('input#id_numero'));
    
    inputsArray.forEach(function(elem) {
        elem.addEventListener("focusout", function() {
            getCartData();
            getInfoWhenNewUser();
        });
    });
}