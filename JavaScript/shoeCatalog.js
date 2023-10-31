document.addEventListener("alpine:init", () => {
    Alpine.data("catalog", () => {
        return {
            title: "Shesha store",
            shoes: [],
            cart: [],
            total: 0.00,

            // Headers
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage["token"]
            },

            // user loggin in
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
                    localStorage["token"] = result.data.token;
                    // Redirect to the home page
                    if (localStorage["token"]) {
                        window.location.href = "index.html";
                    } else {
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
               return axios.post(addUrl, {
                    headers: this.headers
               });
            },
            removeShoe() {
                const removeUrl = `https://api-for-shoes.onrender.com/api/cart/shoeId/${shoeId}/remove`;
                return axios.post(removeUrl, {
                    headers: this.headers
               });
            },
            addShoeToCart(shoeId) {
                this
                    .addShoe(shoeId)
                    .then(result => {
                        const response = result.data;
                        if(response.status === "success") {
                            this.showCart();
                        };
                    })
            },
            removeShoeFromCart() {
                this
                    .removeShoe(shoeId)
                    .then(result => {
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