const userInfo = Array.from(document.querySelectorAll("ul.caixa-info li"));
const userInfoFormatted = {
    name: "",
    email: "",
    phone: "",
    //cpf
    // razaoSocial 
};
const userAddressFormatted = {
    address: "",
    zip: "",
    city: "",
    province: "",
    provinceCode: "",
};
const userCart = [];
let userNameArray = [];
let totalPrice = 0;
let subtotalPrice = 0;
let date = new Date();
let dateFormatted = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()} ${date.getHours()}:${(date.getMinutes()<10?'0':'') + date.getMinutes()}`;

const cartProducts = document.querySelectorAll("tbody tr");

cartProducts.forEach(product => {
    if(!product.classList.contains('bg-dark')) {
        let listedProduct = {
            title: "",
            variant_title: "",
            quantity: 0,
            price: 0,
            path: "",
            image_url: "", 
            tracking_number: null
        };
        
        let productTitle = product.querySelector('div.produto-info');
        listedProduct.title = productTitle.textContent.split("\n                      ")[1];
        
        let productVarianttitle = product.querySelector('span.atributo-cor-carrinho span');
        listedProduct.variant_title = productVarianttitle.style.backgroundColor;
        
        let productPrice = product.querySelector('div.preco-produto strong');
        listedProduct.price = parseFloat(productPrice.textContent.split("\n                        ")[1].split("\n                      ")[0].split(" ")[1]);
        
        let productSku = Array.from(product.querySelectorAll('div.produto-info ul li'));
        listedProduct.tracking_number = productSku[0].querySelector("strong").textContent.split("\n                              ")[1].split("\n                            ")[0];
        
        let productQuantity = product.querySelector("td.conteiner-qtd div");
        listedProduct.quantity = parseInt(productQuantity.textContent);
        
        userCart.push(listedProduct);
        
    } else {
        
        if (product.classList.contains('tr-checkout-total')) {
            totalPrice = parseFloat(product.querySelector('div.total').dataset.total);
            
        } else if (product.classList.contains('esconder-mobile')){
            if(!product.classList.contains('desconto-tr')) {
                subtotalPrice = parseFloat(product.querySelector('div.subtotal').dataset.float);
                
            }
        }
    }
});

if(userInfo.length !== 0) {
    const userInfoNotFormatted = [];
    const userAddressNotFormatted = [];

    userInfo.forEach(info => {
        let myArray = info.textContent.split(": ");
        userInfoNotFormatted.push(myArray[1]);
    
    });
    
    userInfoFormatted.name = userInfoNotFormatted[0].split("\n")[0];
    userInfoFormatted.email = userInfoNotFormatted[1].split("\n")[0];
    userInfoFormatted.phone = userInfoNotFormatted[2].split("\n")[0];
    
    userNameArray = userInfoFormatted.name.split(" ");
    
    const address = document.getElementById("enderecoPrincipal2").getElementsByClassName("accordion-inner")[0];
    
    const myAddress = address.textContent.split("<br>");
    userAddressNotFormatted.push(myAddress[0]);
    
    let myAddressSplited = userAddressNotFormatted[0].split("\n                              ");
    myAddressSplited = myAddressSplited.filter(function (i) {
        return i;
    });
    
    userAddressFormatted.address =  myAddressSplited[0];
    
    const getProvinceInfo = myAddressSplited[1].split(", ");
    let getCity = getProvinceInfo[1].split(" / ");
    userAddressFormatted.city = getCity[0];
    userAddressFormatted.province = getCity[1];
    userAddressFormatted.provinceCode = getCity[1];
    
    const getZipCode = myAddressSplited[2].split("\n            ");
    userAddressFormatted.zip = getZipCode[0];
    
    const phoneFormatted = userInfoFormatted.phone.replace(/\D/g,'');
    userInfoFormatted.phone = `+55${phoneFormatted}`;
    
    getUserInfoObject();

} else {
    
    document.body.addEventListener("click", () => {

        const userEmailInput = document.querySelector("input#id_email");
        userInfoFormatted.email = userEmailInput.value;
        
        const userNameInput = document.querySelector("input#id_nome");
        userInfoFormatted.name = userNameInput.value;
        
        const userPhoneInput = document.querySelector("input#id_telefone_celular");
        userInfoFormatted.phone = userPhoneInput.value;
        
        const userZipCodeInput = document.querySelector("input#id_cep");
        userAddressFormatted.zip = userZipCodeInput.value;
        
        const userAddressInput = document.querySelector("input#id_endereco");
        userAddressFormatted.address = userAddressInput.value;
        
        const userAddressNumberInput = document.querySelector("input#id_numero");
        userAddressFormatted.address = `${userAddressFormatted.address}, ${userAddressNumberInput.value}`;
        
        const userCityInput = document.querySelector("input#id_cidade");
        userAddressFormatted.City = userCityInput.value;
        
        const userProvinceInput = document.querySelector("input#id_estado");
        userAddressFormatted.province = "ES";
        console.log(userProvinceInput.value)
        
        const userProvinceCodeInput = document.querySelector("input#id_estado");
        userAddressFormatted.provinceCode = "ES";

        getUserInfoObject();
    });
    
}

function getUserInfoObject() {
    const userInfoObject = {
        reference_id: Date.now(),
        reason_type: null,
        admin_url: "https://www.google.com.br/",
        number: Date.now(),
        customer_name: userInfoFormatted.name,
        customer_email: userInfoFormatted.email,
        customer_phone: userInfoFormatted.phone,
        billing_address: {
            name: userInfoFormatted.name,
            first_name: userNameArray[0],
            last_name: userNameArray[userNameArray.length - 1],
            company: null,
            phone: userInfoFormatted.phone,
            address1: userAddressFormatted.address,
            address2: userAddressFormatted.address,
            city: userAddressFormatted.city,
            province: userAddressFormatted.province,
            province_code: userAddressFormatted.provinceCode,
            country: "Brazil",
            country_code: "BR",
            zip: userAddressFormatted.zip,
        },
        shipping_address: {
            name: userInfoFormatted.name,
            first_name: userNameArray[0],
            last_name: userNameArray[userNameArray.length - 1],
            company: null,
            phone: userInfoFormatted.phone,
            address1: userAddressFormatted.address,
            address2: userAddressFormatted.address,
            city: userAddressFormatted.city,
            province: userAddressFormatted.province,
            province_code: userAddressFormatted.provinceCode,
            country: "Brazil",
            country_code: "BR",
            zip: userAddressFormatted.zip,
            latitude: null,
            longitude: null
        },
        line_items: userCart,
        currency: "BRL",
        total_price: totalPrice,
        subtotal_price: subtotalPrice,
        referring_site: "https://www.google.com/",
        checkout_url: "https://www.google.com/",
        completed_at: dateFormatted,
        original_created_at: dateFormatted
    };   

    console.log(userInfoObject);
}