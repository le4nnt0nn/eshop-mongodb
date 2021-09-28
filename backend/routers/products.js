const { Product } = require('../models/product');
const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');


const FILE_TYPE_MAP = {
    'image/png' : 'png',
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpeg'
}

/* Redirige los archivos a public/uploads
y añade nombre y fecha ej. imagen-19082021.jpg */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValidFile = FILE_TYPE_MAP[file.mimetype]
        let uploadError = new Error('invalid image type');

        if(isValidFile) {
            uploadError = null
        }
      cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
        /* Cambiar espacios por - */
      const fileName = file.originalname.split(' ').join('-')
      const extension = FILE_TYPE_MAP[file.mimetype]
      cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
  })
  
  const uploadOptions = multer({ storage: storage })

/* use .select('name image -_id'); 
for display only name, image and not id */
router.get(`/`, async (req, res)=>{
    // localhost:3000/api/v1/products?categories=idCategory
    let filter = {};
    if(req.query.categories) 
    {
        filter = {category: req.query.categories.split(',')}
    }
    const productList = await Product.find(filter).populate('category');
    if(!productList) {
        res.status(500).json({success : false})
    }
    res.send(productList);
})

/* populate shows category fields on get */
router.get(`/:id`, async (req, res)=>{
    const product = await Product.findById(req.params.id).populate('category');
    if(!product) {
        res.status(500).json({success : false})
    }
    res.send(product);
})

router.post(`/`, uploadOptions.single('image'), async (req, res)=>{
    const category = await Category.findById(req.body.category)
    if(!category) return res.status(400).send('Invalid Category')

    /* Error si no hay ninguna imagen seleccionada en la req */
    const file = req.file;
    if(!file) return res.status(400).send('No image in the request')
    const fileName = req.file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/upload`;
    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: `${basePath}${fileName}`, //"http://localhost:3000/public/upload/image-123114"
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    })

    product = await product.save();

    if(!product)
    return res.status(500).send('The product cannot be created')

    res.send(product);
})

router.put('/:id', uploadOptions.single('image'), async (req, res)=>{
    if(!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid Product Id')
    }
    const category = await Category.findById(req.body.category)
    if(!category) return res.status(400).send('Invalid Category')

    const product = await Product.findById(req.params.id);
    if(!product) return res.status(400).send('Invalid Product')

    /* Si intentas editar la imagen de un producto y añades una nueva, bien.
    Si no, usa la imagen del producto que ya tenía asignada antes (antigua) */

    const file = req.file;
    let imagepath;

    if(file) {
        const fileName = req.file.filename
        const basePath = `${req.protocol}://${req.get('host')}/public/upload`;
        imagepath = `${basePath}${fileName}`
    } else {
        imagepath = product.image;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: imagepath,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        },
        { new: true }
    )

    if(!updatedProduct)
    return res.status(404).send('the product cannot be updated!')

    res.send(product);
})

router.delete('/:id', (req, res)=>{
    Product.findByIdAndRemove(req.params.id).then(product =>{
        if(product) {
            return res.status(200).json({success: true, message: 'the product is deleted!'})
        } else {
            return res.status(404).json({success : false, message:'product not found!'})
        }
    }).catch(err=>{
        return res.status(400).json({success: false, error: err})
    })
})

/* 
Permite contar el numero de productos (en este caso) de la tabla. 
No funciona
router.get(`/get/count`, async (req, res)=>{
    const productCount = await Product.countDocuments((count) => count)
    
    if(!productCount) {
        res.status(500).json({success : false})
    }
    res.send({
        productCount: productCount
    });
})
*/

/* Muestra todos los productos featured 
y puedes pasarle cuántos quieres mostrar */
router.get(`/get/featured/:count`, async (req, res)=>{
    const count = req.params.count ? req.params.count : 0
    const products = await Product.find({isFeatured: true}).limit(+count)
    
    if(!products) {
        res.status(500).json({success : false})
    }
    res.send(products);
})

/* Edita y añade imagenes para un producto */
router.put(
    '/gallery-images/:id', 
    uploadOptions.array('images', 10), 
    async (req, res)=> {
        if(!mongoose.isValidObjectId(req.params.id)) {
            res.status(400).send('Invalid Product Id')
        }

        const files = req.files
        let imagesPaths = [];
        const basePath = `${req.protocol}://${req.get('host')}/public/upload`;

        if(files) {
            files.map(file => {
                imagesPaths.push(`${basePath}${file.fileName}`)
            })
        }
        
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                images: imagesPaths
            },
            { new: true }
        )
        if(!updatedProduct)
            return res.status(500).send('The product cannot be created')
    
        res.send(updatedProduct);
    }
) 



// exporta el modulo router
module.exports = router;