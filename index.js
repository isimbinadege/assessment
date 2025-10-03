// Q2
// Fetch 
async function fetchJson(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`Fetch failed ${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

// Fetch from multiple product endpoints, keep only available items, compute total price
// endpoints: array of product endpoint URLs (strings)
async function fetchAvailableProductsAndTotal(endpoints) {
  // 1. fetch all endpoints in parallel, tolerate individual failures
  const promises = endpoints.map(url =>
    fetchJson(url).catch(err => {
      console.error('Product endpoint failed:', url, err);
      return { products: [] }; // align with DummyJSON response shape
    })
  );

  const results = await Promise.all(promises);

  // 2. Flatten product arrays (DummyJSON returns { products: [...] })
  const allProducts = results.flatMap(r => Array.isArray(r.products) ? r.products : []);

  // 3. Normalize availability check and filter available products
  // DummyJSON uses availabilityStatus like "In Stock" / "Low Stock" etc.
  const availableProducts = allProducts.filter(p => {
    if (!p) return false;
    // treat anything that looks like in-stock as available
    const status = String(p.availabilityStatus ?? '').toLowerCase();
    return status.includes('in stock') || status.includes('low stock') || Boolean(p.stock);
  }).map(p => ({
    id: Number(p.id),
    title: String(p.title ?? ''),
    price: Number(p.price ?? 0),
    availabilityStatus: p.availabilityStatus ?? null
  }));

  // 4. Sum prices (ensure numeric)
  const totalPrice = availableProducts.reduce((sum, prod) => sum + (Number(prod.price) || 0), 0);

  return {
    availableProducts,
    totalPrice
  };
}

// Example usage with DummyJSON endpoints (replace or add more specific endpoints as needed)
(async () => {
  try {
    const endpoints = [
      'https://dummyjson.com/products?limit=20',        // page 1
      'https://dummyjson.com/products?skip=20&limit=20',// page 2
      'https://dummyjson.com/products?skip=40&limit=20' // page 3
    ];

    const result = await fetchAvailableProductsAndTotal(endpoints);
    console.log('Available products count:', result.availableProducts.length);
    console.log('Total price:', result.totalPrice);
    console.log(result.availableProducts);
  } catch (err) {
    console.error('Unexpected error:', err);
  }
})();
