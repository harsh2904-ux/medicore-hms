package com.medicore.hms.inventory;

import com.medicore.hms.common.ApiResponse;
import com.medicore.hms.common.ResourceNotFoundException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Tag(name = "Inventory", description = "Endpoints for managing hospital supplies, consumables, and low-stock replenishment")
@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryRepository inventoryRepository;

    @Operation(summary = "List all inventory items")
    @GetMapping
    public ResponseEntity<ApiResponse<List<InventoryItem>>> getAllItems(
            @RequestParam(required = false) String category) {
        if (category != null) {
            return ResponseEntity.ok(ApiResponse.ok(inventoryRepository.findByCategory(category)));
        }
        return ResponseEntity.ok(ApiResponse.ok(inventoryRepository.findAll()));
    }

    @Operation(summary = "List low stock items")
    @GetMapping("/low-stock")
    public ResponseEntity<ApiResponse<List<InventoryItem>>> getLowStockItems() {
        return ResponseEntity.ok(ApiResponse.ok(inventoryRepository.findByQuantityLessThanEqual(20)));
    }

    @Operation(summary = "Add new inventory item")
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<InventoryItem>> addItem(@RequestBody InventoryItem item) {
        InventoryItem saved = inventoryRepository.save(item);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Inventory item added", saved));
    }

    @Operation(summary = "Adjust item stock quantity")
    @PatchMapping("/{id}/stock")
    @PreAuthorize("hasAnyRole('ADMIN', 'PHARMACIST')")
    public ResponseEntity<ApiResponse<InventoryItem>> updateStock(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> body) {
        InventoryItem item = inventoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("InventoryItem", "id", id));

        int newQty = body.getOrDefault("quantity", item.getQuantity());
        item.setQuantity(newQty);
        item.setStatus(newQty <= item.getReorderLevel() ? "LOW_STOCK" : "IN_STOCK");

        InventoryItem updated = inventoryRepository.save(item);
        return ResponseEntity.ok(ApiResponse.ok("Stock updated", updated));
    }
}
