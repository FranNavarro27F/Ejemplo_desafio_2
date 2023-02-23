const fs = require("fs")

class ProductManager{
   
    #path = ":/products.json";


    constructor(path){
        this.#path = path;
    }

    async getProducts(){
        try{
            const products = await fs.promises.readFile(this.#path, "utf-8")
            return JSON.parse(products)
        }catch{
            return []
        }
    }

    async getIDs(){
        let products = await this.getProducts()
        let ids = products.map( prods => prods.id)
        let mayorID = Math.max(...ids)
        if (mayorID === -Infinity) {
            return 0
        } else {
            return mayorID
        }
    }
    
     
        async addProduct(title, description, price, thumbail, code, stock){
       
            let mayorID = await this.getIDs()

    const product = {
        title,
        description,
        price: `$ ${price}`,
        thumbail,
        code,
        stock,
        id : ++mayorID
    }


    let products = await this.getProducts()
    let verificar = Object.values(product)
    let sameCode = products.find( prod => prod.code === code)

    if (verificar.includes(undefined)){
        throw new Error(`El producto ${product.title} NO ha sido cargado, debe completar todos los datos.`)
    }
     if(sameCode){
        throw new Error(`El producto ${product.title} NO ha sido cargado ya que la propiedad "code" está repetida, ${sameCode.title} tiene el mismo valor.`)
    }
    products = [...products, product]
        console.log(`${product.title} cargado correctamente.`)
        await fs.promises.writeFile(this.#path, JSON.stringify(products))
    }

    async updateProduct(id, propModify){
        let products = await this.getProducts()
        let productModify = products.find(i => i.id === id)

        if (!productModify){
            throw new Error('No se encontró ningún producto con ese ID.')
        }

        if (Object.keys(propModify).includes('id')){
            throw new Error('No es posible modificar el ID de un producto.')
        }

        if (Object.keys(propModify).includes('code')){
            let sameCode = products.some(i => i.code === propModify.code)
            if (sameCode){
                throw new Error('No es posible modificar la propiedad code por una que ya exista.')
            }
        }

        productModify = {...productModify, ...propModify}
        let newArray = products.filter( prods => prods.id !== id)
        newArray = [...newArray, productModify]
        await fs.promises.writeFile(this.#path, JSON.stringify(newArray))
        console.log('Modificación realizada con éxito.')
    }

    async getProductById(id){
        let products = await this.getProducts()
        let element = products.find(elem => elem.id === id)
        if (element){
            return element
        } else {
            throw new Error('No se encuentra producto con ese ID.')
        }
    }
   async deleteProduct(id){
        let products = await this.getProducts()
        let check = products.some(prod => prod.id === id)
        
        if (!check){
            throw new Error('No existe producto con ese ID.')
        }

        let newArray = products.filter(prods => prods.id !== id)
        await fs.promises.writeFile(this.#path, JSON.stringify(newArray))
        console.log('Producto eliminado con éxito')
    }
}


async function main(){

    const manager = new ProductManager('./products.json')
    const manager1= new ProductManager("./products1.json")

    const products = await manager.getProducts();
    const products1 = await manager1.getProducts();
    await manager1.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc12345", 25)
    // await manager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc1235", 25)
    // console.log(await manager.deleteProduct(3))
    console.log(products1)

}

main()


