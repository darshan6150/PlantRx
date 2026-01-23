// 📦 Script to Render PlantRx Products from Database API

fetch('/api/products')
  .then(response => response.json())
  .then(products => {
    const container = document.getElementById('product-container');
    
    if (!container) {
      console.error('Product container not found');
      return;
    }

    // Filter for herb/plant products only
    const plantProducts = products.filter(product => 
      product.category === 'herbs' || 
      product.name.toLowerCase().includes('powder') ||
      product.name.toLowerCase().includes('root')
    );

    plantProducts.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';

      // Create image element safely
      const img = document.createElement('img');
      img.src = product.image || '/images/default-product.jpg';
      img.alt = product.name || '';
      img.className = 'product-image';
      card.appendChild(img);

      // Create title element safely
      const title = document.createElement('h3');
      title.className = 'product-title';
      title.textContent = product.name || '';
      card.appendChild(title);

      // Create description element safely
      const description = document.createElement('p');
      description.className = 'product-description';
      description.textContent = product.description || '';
      card.appendChild(description);

      // Create price element safely
      const price = document.createElement('p');
      price.className = 'product-price';
      price.textContent = `£${product.price || '0'}`;
      card.appendChild(price);

      // Create buy button safely
      const buyButton = document.createElement('a');
      buyButton.className = 'product-buy-button';
      buyButton.textContent = 'View Product';
      // Sanitize slug for URL fragment
      const sanitizedSlug = (product.slug || '').replace(/[^a-zA-Z0-9\-_]/g, '');
      buyButton.href = `/store#product-${sanitizedSlug}`;
      card.appendChild(buyButton);

      container.appendChild(card);
    });

    // Add CSS styles if not already present
    if (!document.querySelector('#product-styles')) {
      const style = document.createElement('style');
      style.id = 'product-styles';
      style.textContent = `
        #product-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .product-card {
          border: 1px solid #e5e5e5;
          padding: 20px;
          border-radius: 12px;
          background: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          display: flex;
          flex-direction: column;
        }
        
        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        
        .product-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 8px;
          margin-bottom: 15px;
        }
        
        .product-title {
          font-size: 18px;
          font-weight: bold;
          color: #2d3748;
          margin-bottom: 10px;
          line-height: 1.3;
        }
        
        .product-description {
          font-size: 14px;
          color: #666;
          margin-bottom: 15px;
          flex-grow: 1;
          line-height: 1.5;
        }
        
        .product-price {
          color: #22c55e;
          font-weight: bold;
          font-size: 20px;
          margin-bottom: 15px;
        }
        
        .product-buy-button {
          display: inline-block;
          padding: 12px 20px;
          background: linear-gradient(135deg, #22c55e, #16a085);
          color: white;
          text-decoration: none;
          border-radius: 8px;
          text-align: center;
          font-weight: 600;
          transition: all 0.2s ease;
          border: none;
          cursor: pointer;
        }
        
        .product-buy-button:hover {
          background: linear-gradient(135deg, #16a085, #0d9488);
          transform: translateY(-1px);
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .product-card {
            background: #1f2937;
            border-color: #374151;
            color: white;
          }
          
          .product-title {
            color: white;
          }
          
          .product-description {
            color: #d1d5db;
          }
        }
      `;
      document.head.appendChild(style);
    }
  })
  .catch(error => {
    console.error('Failed to load products:', error);
    const container = document.getElementById('product-container');
    if (container) {
      container.innerHTML = '<p style="text-align: center; color: #666;">Unable to load products at this time.</p>';
    }
  });