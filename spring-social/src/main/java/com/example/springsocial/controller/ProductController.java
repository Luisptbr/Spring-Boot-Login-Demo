package com.example.springsocial.controller;

import com.example.springsocial.model.ApiResponse;
import com.example.springsocial.model.Product;
import com.example.springsocial.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/products")
public class ProductController {
	
	@Autowired
	private ProductService productService;
	
	@GetMapping
	public ResponseEntity<List<Product>> getAllProducts() {
	    List<Product> products = productService.getAllProducts();
	    return ResponseEntity.ok(products);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<?> getProductById(@PathVariable Long id) {
	    Product product = productService.getProductById(id);
	    return ResponseEntity.ok(product);
	}
	
	@PostMapping
	public ResponseEntity<ApiResponse> createProduct(@RequestBody Product product) {
	    productService.createProduct(product);
	    return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse("Produto criado com sucesso", true));
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<ApiResponse> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
	    productService.updateProduct(id, productDetails);
	    return ResponseEntity.ok(new ApiResponse("Produto atualizado com sucesso", true));
	}

	
	@DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteProduct(@PathVariable Long id){
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok(new ApiResponse("Produto excluído com sucesso", true));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(new ApiResponse("Produto não encontrado", false));
        }
    }
}
