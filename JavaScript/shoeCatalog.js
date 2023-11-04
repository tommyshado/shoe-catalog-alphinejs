// Elements references
const errorMsg = document.querySelector(".errorMsg");
const paymentMsg = document.querySelector(".payment");

document.addEventListener("alpine:init", () => {
    Alpine.data("catalog", () => {
        return {
            shoes: [],
            cart: [],
            total: 0.00,

            // Add shoe
            createShoe: false,

            // Logged in
            loggedIn: false,

            // payment
            cartPay: 0.00,

            // Headers
            headers: {
                'Content-Type': 'application/json',
                'auth-token':   localStorage["token"] || localStorage["adminToken"]
            },

            // User
            getUser: {
                name: "",
                email: "",
                password: ""
            },

            // user login
            login() {
                const loginUrl = "https://api-for-shoes.onrender.com/api/user/login";
                return axios.post(loginUrl, this.getUser);
            },

            // GET the token from the API
            getToken() {
                this.login().then(result => {
                    // get the error
                    const { error } = result.data;
                    if (error) {
                        errorMsg.innerHTML = error;
                        errorMsg.classList.add("text-[#ff4a1c]");
                        // Set the values in the signup input areas to default
                        this.getUser.name = "";
                        this.getUser.email = "";
                        this.getUser.password = "";

                        setTimeout(() => {
                            errorMsg.innerHTML = "";
                        }, 3000);

                        return;
                    };

                    const token = result.data.token;
                    const checkName = this.getUser.name === "tendani";

                    if (checkName) {
                        localStorage["adminToken"] = token;
                        // Redirect to the home page
                        if (localStorage["adminToken"]) {
                            window.location.href = "index.html";
                        } else {
                            window.location.href = "login.html";
                        };

                    } else if (!checkName) {
                        localStorage["token"] = token;
                        window.location.href = "index.html";
                    };
                });
            },

            // user signup
            signup() {
                const signupUrl = "https://api-for-shoes.onrender.com/api/user/signup";
                return axios.post(signupUrl, this.getUser).then(result => {

                    // get the error
                    const { error } = result.data;
                    if (error) {
                        errorMsg.innerHTML = error;
                        errorMsg.classList.add("text-[#ff4a1c]");
                        // Set the values in the signup input areas to default
                        this.getUser.name = "";
                        this.getUser.email = "";
                        this.getUser.password = "";

                        setTimeout(() => {
                            errorMsg.innerHTML = "";
                        }, 3000);

                        return;
                    };

                    const response = result.data;
                    if (response.status === "success") {
                        window.location.href = "login.html";
                    };
                });
            },

            // Logout
            logout() {
                localStorage["token"] = "";
                localStorage["adminToken"] = "";
                window.location.href = "index.html";
            },

            // Shoes display functionality
            getShoes() {
                const shoesUrl = "https://api-for-shoes.onrender.com/api/shoes";
                return axios.get(shoesUrl);
            },
            showShoes() {
                this.getShoes().then(result => {
                    const shoes = result.data.data;
                    this.shoes = shoes;
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
            decrementShoe(shoeId) {
                const decreaseQtyUrl = `https://api-for-shoes.onrender.com/api/cart/shoeId/${shoeId}/remove`;
                return axios.post(decreaseQtyUrl, {}, {
                    headers: this.headers
               });
            },
            addShoeToCart(shoeId) {
                if (!this.headers["auth-token"]) {
                    errorMsg.innerHTML = "Log in please";
                    errorMsg.classList.add("text-[#ff4a1c]");

                    setTimeout(() => {
                        errorMsg.innerHTML = "";
                    }, 3000);
                };

                this.addShoe(shoeId).then(result => {
                        const response = result.data;
                        if(response.status === "success") {
                            this.showShoes();
                            this.showCart();
                        };
                    })
            },
            decrementShoeQty(shoeId) {
                this.decrementShoe(shoeId).then(result => {
                        const response = result.data;
                        if(response.status === "success") {
                            this.showShoes();
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
            
            // Payment

            proceed: false,
    
            pay() {
                const paymentUrl = "https://api-for-shoes.onrender.com/api/cart/payment";
                return axios.post(paymentUrl, { payment: this.cartPay }, {
                    headers: this.headers
                });
            },
            paymentForCart() {
                if (this.proceed) {
                    this.pay().then(result => {
                        // get the error
                        const { error } = result.data;
                        if (error) {
                            paymentMsg.innerHTML = error;
                            paymentMsg.classList.add("text-[#ff4a1c]");
    
                            setTimeout(() => {
                                paymentMsg.innerHTML = "";
                            }, 3000);
    
                            return;
                        };

                        // Store the shoes added to the cart in localStorage
                            // store the time of the transation, shoe name
                        
                        const response = result.data;
                        if (response.status === "success") {
                            paymentMsg.innerHTML = "Payment successful.";
                            paymentMsg.classList.add("text-[#1ed760]");
                            // Set the total to zero
                            this.total = 0.00
    
                            setTimeout(() => {
                                paymentMsg.innerHTML = "";
                            }, 3000);
                        };
                    });
                };
            },

            // Remove a shoe in the cart
            removeShoe(shoeId) {
                const removeUrl = `https://api-for-shoes.onrender.com/api/cart/shoeId/${shoeId}/removeAShoe`;
                return axios.post(removeUrl, {}, {
                    headers: this.headers
               });
            },
            removeShoeFromCart(shoeId) {
                this.removeShoe(shoeId).then(result => {
                    const response = result.data;
                    if(response.status === "success") {
                        this.showShoes();
                    };
                })
            },

            // Make a shoe to display in the catalog
            shoe: {
                shoeName: "",
                description: "",
                ageGroup: "",
                image: "",
                qty: "",
                shoePrice: "",
                shoeColor: "",
                shoeSize: ""
            },
            makeAShoe() {
                const shoes = "https://api-for-shoes.onrender.com/api/shoes";
                return axios.post(shoes, this.shoe);
            },
            showShoe() {
                this.makeAShoe().then(result => {
                    const response = result.data;
                    if (response.status === "success") {
                        this.showShoes();
                    };
                });
            },

            increaseShoeQty(shoeId) {
                if (this.proceed) {
                    const increaseShoeQtyUrl = `https://api-for-shoes.onrender.com/api/shoes/shoeId/${shoeId}/add`;
                    return axios.post(increaseShoeQtyUrl).then(result => {
                        const response = result.data;
                        if (response.status === "success") {
                            this.showShoes();
                        };
                    });
                };
            },
            removeShoeInDispay(shoeId) {
                if (this.proceed) {
                    const increaseShoeQtyUrl = `https://api-for-shoes.onrender.com/api/shoes/shoeId/${shoeId}/remove`;
                    return axios.post(increaseShoeQtyUrl).then(result => {
                        const response = result.data;
                        if (response.status === "success") {
                            this.showShoes();
                        };
                    });
                };
            },

            // create a function to retrieve the purchases of shoes in localStorage then...
                // return the shoes from the localStorage

            init() {
                // SHOW shoes
                this.showShoes();

                // SHOW the cart
                this.showCart();

                if (localStorage["adminToken"]) {
                    this.createShoe = true;
                    this.loggedIn = true;

                } else if (localStorage["token"]) {
                    this.loggedIn = true;
                };
            },
        };
    });
});