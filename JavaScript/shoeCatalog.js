document.addEventListener("alpine:init", () => {
    Alpine.data("catalog", () => {
        return {
            title: "Shesha store",
            shoes: [],
            cart: [],
            total: 0.00,
            getCart() {
                const headers = {
                    'Content-Type': 'application/json',
                    'auth-token': 'JWT token...'
                };
                const cart = "https://api-for-shoes.onrender.com/api/cart";
                return axios.get(cart, {
                    headers: headers
                });
            },
            init() {
                axios
                    .get("https://api-for-shoes.onrender.com/api/shoes")
                    .then(result => this.shoes = result.data.data)

                this.getCart().then(result => {
                    // Cart data
                    const data = result.data;
                    const cart__ = data.data;
                    const cartTotal = data.total;

                    // Set global variables
                    this.cart = cart__;
                    this.total = cartTotal;
                })
            },
        };
    });
});