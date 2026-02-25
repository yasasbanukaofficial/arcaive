package tech.yasasbanuka.backend.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.yasasbanuka.backend.dto.SubscriptionDTO;
import tech.yasasbanuka.backend.service.SubscriptionService;
import tech.yasasbanuka.backend.util.APIResponse;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/subscriptions")
@CrossOrigin(origins = "http://localhost:8080")
public class SubscriptionController {
    private final SubscriptionService subscriptionService;

    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @GetMapping
    public ResponseEntity<APIResponse<List<SubscriptionDTO>>> getAllSubscriptions() {
        return new ResponseEntity<>(new APIResponse<>(true, HttpStatus.OK.value(), "Fetched all subscriptions successfully", subscriptionService.getAllSubscriptions()), HttpStatus.OK);
    }

    @GetMapping("/{subscriptionId}")
    public ResponseEntity<APIResponse<SubscriptionDTO>> getSubscription(@PathVariable UUID subscriptionId) {
        return new ResponseEntity<>(new APIResponse<>(true, HttpStatus.OK.value(), "Fetched subscription successfully", subscriptionService.getSubscription(subscriptionId)), HttpStatus.OK);
    }

    @PutMapping
    public ResponseEntity<APIResponse<SubscriptionDTO>> updateSubscription(@RequestBody @Valid SubscriptionDTO subscription) {
        return new ResponseEntity<>(new APIResponse<>(true, HttpStatus.OK.value(), "Subscription updated successfully", subscriptionService.updateSubscription(subscription)), HttpStatus.OK);
    }

    @DeleteMapping("/{subscriptionId}")
    public ResponseEntity<APIResponse<Boolean>> deleteSubscription(@PathVariable UUID subscriptionId) {
        subscriptionService.deleteSubscription(subscriptionId);
        return new ResponseEntity<>(new APIResponse<>(true, HttpStatus.OK.value(), "Subscription deleted successfully", null), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<APIResponse<SubscriptionDTO>> createSubscription(@RequestBody @Valid SubscriptionDTO subscription) {
        return new ResponseEntity<>(new APIResponse<>(true, HttpStatus.CREATED.value(), "Subscription created successfully", subscriptionService.createSubscription(subscription)), HttpStatus.CREATED);
    }

}
