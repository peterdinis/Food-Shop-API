import {z} from "zod";

const productSchema = z.object({
    name: z.string({
        required_error: "Name is required"
    }),

    description: z.string({
        required_error: "Description is required"
    }),

    status: z.string({
        required_error: "Status is required"
    }),

    price: z.string({
        required_error: "Price is required"
    }),

    image: z.string({
        required_error: "Image is required"
    }),

    avaiable: z.boolean({
        description: "Avaiable value must be true or false"
    })
});


export default productSchema