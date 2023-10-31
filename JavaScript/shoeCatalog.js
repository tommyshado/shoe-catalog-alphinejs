// Elements references
const signupErrorMsg = document.querySelector(".errorMsg");
const loginErrorMsg = document.querySelector(".errorMsg");
const paymentMsg = document.querySelector(".payment");

document.addEventListener("alpine:init", () => {
    Alpine.data("catalog", () => {
        return {
            title: "Shesha store",
            shoes: [],
            cart: [],
            total: 0.00,

            // payment
            cartPay: 0.00,

            // Headers
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage["token"]
            },

            // user login
            getLogin: {
                name: "",
                email: "",
                password: ""
            },
            login() {
                const loginUrl = "https://api-for-shoes.onrender.com/api/user/login";
                return axios.post(loginUrl, this.getLogin);
            },

            // GET the token from the API
            getToken() {
                this.login().then(result => {
                    // get the error
                    const { error } = result.data;
                    if (error) {
                        signupErrorMsg.innerHTML = error;
                        // Set the values in the signup input areas to default
                        this.getLogin.name = "";
                        this.getLogin.email = "";
                        this.getLogin.password = "";
                        return;
                    };

                    localStorage["token"] = result.data.token;
                    // Redirect to the home page
                    if (localStorage["token"]) {
                        window.location.href = "index.html";
                    } else {
                        window.location.href = "login.html";
                    };
                });
            },

            // user signup
            getSignup: {
                name: "",
                email: "",
                password: ""
            },
            signup() {
                const signupUrl = "https://api-for-shoes.onrender.com/api/user/signup";
                return axios.post(signupUrl, this.getSignup).then(result => {

                    // get the error
                    const { error } = result.data;
                    if (error) {
                        errorMsg.innerHTML = error;
                        // Set the values in the signup input areas to default
                        this.getSignup.name = "";
                        this.getSignup.email = "";
                        this.getSignup.password = "";
                        return;
                    };

                    const response = result.data;
                    if (response.status === "success") {
                        window.location.href = "login.html";
                    };
                });
            },

            // Cart functionality
            getCart() {
                const cartUrl = "https://api-for-shoes.onrender.com/api/cart";
                return axios.get(cartUrl, {
                    headers: this.headers
                });
            },
            addShoe(shoeId) {
               const addUrl = `https://api-for-shoes.onrender.com/api/cart/shoeId/${shoeId}/add`;
               return axios.post(addUrl, {}, {
                    headers: this.headers
               });
            },
            removeShoe(shoeId) {
                const removeUrl = `https://api-for-shoes.onrender.com/api/cart/shoeId/${shoeId}/remove`;
                return axios.post(removeUrl, {}, {
                    headers: this.headers
               });
            },
            addShoeToCart(shoeId) {
                this.addShoe(shoeId).then(result => {
                        const response = result.data;
                        if(response.status === "success") {
                            this.showCart();
                        };
                    })
            },
            removeShoeFromCart(shoeId) {
                this.removeShoe(shoeId).then(result => {
                        const response = result.data;
                        if(response.status === "success") {
                            this.showCart();
                        };
                    })
            },
            showCart() {
                this.getCart().then(result => {
                    // Cart data
                    const data = result.data;
                    const cartTotal = data.total;

                    // Set global variables
                    this.cart = data.cart;
                    this.total = cartTotal;
                })
            },

            pay() {
                const paymentUrl = "https://api-for-shoes.onrender.com/api/cart/payment";
                return axios.post(paymentUrl, { payment: this.cartPay }, {
                    headers: this.headers
                });
            },

            paymentForCart() {
                this.pay().then(result => {
                    // get the error
                    const { error } = result.data;
                    if (error) {
                        paymentMsg.innerHTML = error;
                        return;
                    };
                    
                    const response = result.data;
                    if (response.status === "success") {
                        paymentMsg.innerHTML = "Payment successful.";
                        // Set the total to zero
                        this.total = 0.00
                    };
                });
            },

            init() {
                axios
                    .get("https://api-for-shoes.onrender.com/api/shoes")
                    .then(result => this.shoes = result.data.data)

                // SHOW the cart
                this.showCart();
            },
        };
    });
});