const { privateDecrypt } = require('crypto');
const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
const writeProducts = (data) => fs.writeFileSync(productsFilePath, JSON.stringify(data), 'utf-8');


const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		res.render('products', {
			products,
			toThousand,
		})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		let productId = +req.params.id;
		let product = products.find(product => product.id === productId);

		res.render('detail', {
			product,
			toThousand,
		})
	},

	// Create - Form to create
	create: (req, res) => {
		res.render('product-create-form');
	},
	
	// Create -  Method to store
	store: (req, res) => {
		let lastId = 0;
		products.forEach(product => {
			if(product.id > lastId){
				lastId = product.id;
			}
		});

		let newProduct = {
			...req.body,
			id: lastId + 1,
			image: "default-image.png",
		}

		products.push(newProduct);
		
		writeProducts(products);

		res.send(`El producto ${req.body.name} a sido creado exitosamente`);
	},

	// Update - Form to edit
	edit: (req, res) => {
		let productId = +req.params.id;
		let product = products.find(product => product.id == productId);

		res.render('product-edit-form', {
			product,
		})
	},
	// Update - Method to update
	update: (req, res) => {
		let productId = +req.params.id;

		const {name, price, discount, category, description} = req.body;
		products.forEach(product => {
			if(product.id === productId) {
				product.name = name
				product.price = price
				product.discount = discount 
				product.category = category
				product.description = description 
				
			}
		})

		writeProducts(products);

		res.send(`Modificaste el producto ${req.body.name} exitosamente`)

	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		let productId = +req.params.id;
		let productToDelete;

		products.forEach(product => {
			if(product.id === productId){
				productToDelete = product.name
				let productToDeleteIndex = products.indexOf(product);
				products.splice(productToDeleteIndex, 1);
			}
		})

		writeProducts(products)

		res.send(`Eliminaste el producto ${productToDelete}`)
	}
};

module.exports = controller;