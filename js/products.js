/**
 * Product Database for Bharuch Food Products
 * Contains product data structured for search, filter, and modal display.
 * Strictly no prices listed.
 */
export const products = [
    // --- PEANUTS CATEGORY ---
    {
        id: "p1",
        name: "Simply Salted Peanuts",
        category: "peanuts",
        image: "assets/images/peanuts/Simply-Salted-Rs-10-e1706242576672-270x340.png",
        description: "Classic crunchy salted peanuts roasted to absolute perfection. Our signature recipe, packed in a pocket-friendly snack bag, makes the perfect on-the-go choice.",
        ingredients: "Selected Peanut Kernels, Refined Cottonseed Oil, Edible Common Salt.",
        sizes: ["30g Pack", "100g Pouch"],
        storage: "Store in a cool, dry place away from direct sunlight. Once opened, consume immediately."
    },
    {
        id: "p2",
        name: "Masala Peanuts",
        category: "peanuts",
        image: "assets/images/peanuts/Masala-Peanut-Rs-10-e1706242624611.png",
        description: "Coated with an artisanal spice blend, these masala peanuts deliver a zesty punch of traditional Gujarati flavors in a handy serving pack.",
        ingredients: "Peanuts, Refined Oil, Red Chilli Powder, Black Salt, Dry Mango Powder, Cumin, Edible Common Salt.",
        sizes: ["30g Pack", "150g Pouch"],
        storage: "Store in a cool, dry place. Keep in an airtight container once opened."
    },
    {
        id: "p3",
        name: "Lemon Pudina Peanuts",
        category: "peanuts",
        image: "assets/images/peanuts/Lemon-Pudina-Peanut-Rs-10-e1706242644495.png",
        description: "A refreshing combination of tangy lemon and cool mint (pudina) seasoning on perfectly roasted crunchy peanuts. An exquisite afternoon snack.",
        ingredients: "Peanut Kernels, Mint Powder, Lemon Extract Powder, Black Pepper, Citric Acid, Spices, Edible Salt.",
        sizes: ["30g Pack", "150g Pouch"],
        storage: "Store in a dry place. Keep away from humidity."
    },
    {
        id: "p4",
        name: "Lemon Black Pepper Peanuts",
        category: "peanuts",
        image: "assets/images/peanuts/Lemon-Black-Pepper-Peanut-Rs-10-e1706242668619.png",
        description: "Zesty lemon hints paired with the bold heat of fresh black pepper on our signature roasted peanuts. A savory snack that hits all the right notes.",
        ingredients: "Peanuts, Freshly Ground Black Pepper, Lemon Oil Essence, Citric Acid, Edible Common Salt.",
        sizes: ["30g Pack", "150g Pouch"],
        storage: "Store in a cool and dry environment."
    },
    {
        id: "p5",
        name: "Chilly Garlic Peanuts",
        category: "peanuts",
        image: "assets/images/peanuts/Chilly-Garlic-Peanut-Rs-10-e1706242686775.png",
        description: "A spicy kick of red chilli flakes combined with the rich, savory depth of roasted garlic. Truly addictive and highly aromatic.",
        ingredients: "Peanut Kernels, Garlic Powder, Red Chilli Powder, Onion Powder, Spices and Condiments, Edible Salt.",
        sizes: ["30g Pack", "150g Pouch"],
        storage: "Store in a cool place, protect from humidity."
    },
    {
        id: "p6",
        name: "Masala Peanuts (Premium)",
        category: "peanuts",
        image: "assets/images/peanuts/Masala-Peanut-200g.png",
        description: "Our famous spice-dusted masala peanuts in a family-sized stand-up zipper pouch. Prepared using organic spices and slow-roasted for rich consistency.",
        ingredients: "Peanut Kernels, Red Chilli Powder, Black Salt, Mango Powder, Cumin, Spices, Edible Oil, Salt.",
        sizes: ["200g Pouch", "500g Pack"],
        storage: "Store in a cool, dry place. Reseal the zipper tightly after opening."
    },
    {
        id: "p7",
        name: "Lemon Black Pepper Peanuts (Premium)",
        category: "peanuts",
        image: "assets/images/peanuts/Lemon-Black-Pepper.png",
        description: "A larger sharing package of our premium lemon and black pepper seasoned peanuts. Designed for sharing during tea time or gatherings.",
        ingredients: "Peanuts, Black Pepper, Natural Lemon Extract, Spices, Salt.",
        sizes: ["200g Pouch", "400g Pack"],
        storage: "Keep in a dry container. Reseal the package after use."
    },
    {
        id: "p8",
        name: "Hajma Peanut",
        category: "peanuts",
        image: "assets/images/peanuts/Hajma-Peanut-200g.png",
        description: "Seasoned with digestion-friendly spices like asafoetida (hing), cumin, and black salt. This unique flavor profile offers an incredibly savory taste with digestive benefits.",
        ingredients: "Peanut Kernels, Asafoetida (Hing), Cumin Powder, Black Salt, Dry Mango Powder, Spices, Edible Salt.",
        sizes: ["200g Pouch"],
        storage: "Store in a cool, dry place. Seal tightly to preserve the digestive spices' potency."
    },
    {
        id: "p9",
        name: "Premium Salted Peanuts",
        category: "peanuts",
        image: "assets/images/peanuts/peanut.png",
        description: "A larger sharing pack of our gold-standard salted peanuts. Slow-roasted in traditional small batches to guarantee that signature crunch.",
        ingredients: "Peanuts, Refined Oil, Edible Salt.",
        sizes: ["200g Pouch", "400g Pouch"],
        storage: "Store in a cool, dry place. Keep in an airtight container once opened."
    },
    {
        id: "p10",
        name: "Roasted Peanuts (Heritage Pack)",
        category: "peanuts",
        image: "assets/images/peanuts/peanuts-2.jpg",
        description: "Whole peanuts roasted in their shell or as split halves following our vintage 1960 recipes. Brings you the authentic smoky taste of Bharuch's soil.",
        ingredients: "Whole Selected Peanuts, Edible Salt.",
        sizes: ["250g Box", "500g Family Box"],
        storage: "Keep in an airtight jar to protect against atmospheric moisture."
    },

    // --- CHANA CATEGORY ---
    {
        id: "c1",
        name: "Roasted Salted Chana",
        category: "chana",
        image: "assets/images/chana/Salted-Chana.png",
        description: "Rich in fiber and protein, our roasted salted chana offers a guilt-free crunch. Prepared without oil, using traditional sand-roasting methods.",
        ingredients: "Chickpeas (Chana), Edible Salt.",
        sizes: ["100g Pouch", "200g Pouch", "400g Pouch"],
        storage: "Store in a cool, dry place. Protect from moisture to preserve crispness."
    },
    {
        id: "c2",
        name: "Masala Chana",
        category: "chana",
        image: "assets/images/chana/Masala-Chana.jpg",
        description: "Roasted chickpeas tossed in a blend of hot red chillies, coriander, dry mango powder, and black salt. A tangy, spicy, high-protein treat.",
        ingredients: "Chickpeas, Red Chilli Powder, Black Salt, Mango Powder, Spices, Salt.",
        sizes: ["100g Pack", "200g Pack", "400g Pack"],
        storage: "Keep in an airtight container once opened."
    },
    {
        id: "c3",
        name: "Salted Haldi Chana",
        category: "chana",
        image: "assets/images/chana/Salted-Haldi-Chana.png",
        description: "Traditional chickpeas roasted with turmeric (haldi) and edible salt. Highly nutritious and loaded with wellness properties.",
        ingredients: "Selected Chickpeas, Turmeric Powder, Edible Common Salt.",
        sizes: ["100g Pack", "200g Pack", "400g Pack"],
        storage: "Keep away from moisture and direct sunlight."
    },
    {
        id: "c4",
        name: "Tandoori Chana",
        category: "chana",
        image: "assets/images/chana/Tandoori-Chana.jpg",
        description: "Infused with smoky clay-oven tandoori spices. These crunchy chickpeas offer a robust, barbecue-style flavor profile perfect for party platters.",
        ingredients: "Chickpeas, Tandoori Spice Masala, Garlic Essence, Onion Powder, Red Chilli, Salt.",
        sizes: ["100g Pouch", "200g Pouch"],
        storage: "Store in an airtight container."
    },
    {
        id: "c5",
        name: "Salted Chana (Snack Pack)",
        category: "chana",
        image: "assets/images/chana/Roasted-Simply-Solted-Rs-10.png",
        description: "Pocket-sized pack of our classic sand-roasted salted chana. A healthy, high-protein snack for busy school or office days.",
        ingredients: "Chickpeas, Edible Salt.",
        sizes: ["30g Pack"],
        storage: "Consume immediately after opening."
    },
    {
        id: "c6",
        name: "Hing Jeera Chana",
        category: "chana",
        image: "assets/images/chana/Hing-Jeera-Chana.jpg",
        description: "A delightful fusion of strong asafoetida (hing) and roasted cumin seed powder (jeera) on crispy chickpeas. Promotes digestion and tastes delicious.",
        ingredients: "Chickpeas, Asafoetida (Hing), Cumin Powder, Black Pepper, Salt.",
        sizes: ["100g Pack", "200g Pack", "400g Pack"],
        storage: "Keep in a cool, dry place in an airtight jar."
    },

    // --- CHIKKI CATEGORY ---
    {
        id: "k1",
        name: "Premium Pista Chikki",
        category: "chikki",
        image: "assets/images/chikki/Pista-Chikki-1536x1097.png",
        description: "A luxury Indian sweet brittle made from premium sliced pistachios, green cardamoms, and clarified liquid jaggery. Paper-thin, crispy, and meltingly sweet.",
        ingredients: "Pistachio Slices, Cardamom, Sugar, Liquid Glucose, Clarified Jaggery.",
        sizes: ["200g Gift Box", "400g Gift Box"],
        storage: "Store in a cool, dry place. Avoid heat exposure to prevent melting."
    },
    {
        id: "k2",
        name: "Rich Dry Fruits Chikki",
        category: "chikki",
        image: "assets/images/chikki/dry-fruits-1536x1097.png",
        description: "An opulent blend of sliced almonds, pistachios, cashews, and saffron bound in clean jaggery syrup. Perfect for festive gifting.",
        ingredients: "Almonds, Cashews, Pistachios, Saffron, Sugar, Jaggery, Liquid Glucose.",
        sizes: ["200g Box", "400g Box"],
        storage: "Store in a dry place. Keep sealed."
    },
    {
        id: "k3",
        name: "Crunchy Coconut Chikki Bar",
        category: "chikki",
        image: "assets/images/chikki/Coconut-Chikki-Bar.png",
        description: "Individually wrapped single-serving coconut chikki bars. Made with dry grated coconut flakes and rich jaggery, perfect for quick energy.",
        ingredients: "Grated Coconut Flakes, Jaggery, Sugar, Liquid Glucose.",
        sizes: ["Single Bar (40g)", "Box of 12 Bars"],
        storage: "Store in a dry place. Protect from heat."
    },
    {
        id: "k4",
        name: "Roasted Peanut Chikki Bar",
        category: "chikki",
        image: "assets/images/chikki/Peanut-Chikki-Bar.png",
        description: "The classic peanut chikki formatted as a handy grab-and-go energy bar. Contains rich, slow-roasted peanuts cracked and sweetened with jaggery.",
        ingredients: "Roasted Peanuts, Jaggery, Sugar, Liquid Glucose.",
        sizes: ["Single Bar (40g)", "Box of 12 Bars"],
        storage: "Keep in a cool, dry place."
    },
    {
        id: "k5",
        name: "Peanut Crush Chikki",
        category: "chikki",
        image: "assets/images/chikki/Peanut-Crush-525x375.png",
        description: "Made from finely crushed roasted peanuts and jaggery. Provides a softer bite while retaining that rich roasted peanut aroma. Loved by kids and elders alike.",
        ingredients: "Crushed Peanuts, Jaggery, Sugar, Cardamom.",
        sizes: ["250g Pack", "500g Pack"],
        storage: "Keep in an airtight container to maintain crispiness."
    },
    {
        id: "k6",
        name: "Classic Sesame Chikki",
        category: "chikki",
        image: "assets/images/chikki/Sesame-Chikki.png",
        description: "Rich sesame seeds (Til) roasted and set in premium jaggery. Packed with calcium, warm iron, and authentic traditional flavors.",
        ingredients: "Roasted White Sesame Seeds, Sugar, Jaggery, Cardamom.",
        sizes: ["200g Pack", "400g Pack"],
        storage: "Store in a dry place. Keep sealed after opening."
    },
    {
        id: "k7",
        name: "Traditional Coconut Chikki",
        category: "chikki",
        image: "assets/images/chikki/Coconut-Chikki.png",
        description: "Classic coconut slabs sweetened with organic jaggery. Provides a rich flavor with a crisp, fibrous crunch.",
        ingredients: "Coconut Shreds, Jaggery, Liquid Glucose, Cardamom.",
        sizes: ["200g Pack"],
        storage: "Store in a cool, dry place."
    },
    {
        id: "k8",
        name: "Traditional Peanut Chikki",
        category: "chikki",
        image: "assets/images/chikki/Peanut-Chikki.png",
        description: "The timeless standard. Whole roasted peanuts locked in golden-brown jaggery syrup. Highly crisp, sweet, and nutty.",
        ingredients: "Split Roasted Peanuts, Jaggery, Sugar, Liquid Glucose.",
        sizes: ["250g Pack", "500g Pack"],
        storage: "Keep in an airtight jar to maintain snap."
    },
    {
        id: "k9",
        name: "Creamy Peanut Butter Chikki",
        category: "chikki",
        image: "assets/images/chikki/Peanut-Butter-Chikki.png",
        description: "A modern innovation. Incorporates peanut butter paste alongside roasted splits, giving it an intensely rich, melt-in-the-mouth texture.",
        ingredients: "Peanuts, Peanut Butter Paste, Jaggery, Liquid Glucose, Sugar.",
        sizes: ["200g Box"],
        storage: "Keep in a cool, dry place. Refrigerate during extreme summer to maintain firmness."
    }
];
