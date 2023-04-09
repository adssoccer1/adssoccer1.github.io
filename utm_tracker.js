console.log("utm_tracker loaded successfully");

function getUTMParameters() {
    console.log("getUTMParameters called ");
    const urlParams = new URLSearchParams(window.location.search);
    const utmParameters = ['utm_campaign'];
    const utmData = {};
  
    utmParameters.forEach(param => {
        console.log("getUTMParameters -> ", param);

      if (urlParams.has(param)) {
        console.log("make sure the utm param is a honey pot param or youll store every utm code");
        utmData["honeypotutm"] = urlParams.get(param);
      }
    });
  
    return utmData;
  }
  
  const utmData = getUTMParameters();
  console.log("utmData:  ", utmData);

  function setCookie(name, value, days) {
    console.log("setCookie called ");

    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
    console.log("setCookie set " );

  }
  
  function getCookie(name) {
    return document.cookie.split('; ').find(row => row.startsWith(name))?.split('=')[1];
  }
  
  Object.entries(utmData).forEach(([key, value]) => {
    console.log("Objec.entries called ", key , " ", value);

    if (!getCookie(key)) {
        console.log("set a cook ", key , " ", value);

      setCookie(key, value, 30);
    }else{
        console.log("should remove cook and replace w latest - now there may be double.  ", key , " ", value);
        setCookie(key, value, 30);

    }
  });

  /*
  async function updateCartAttributes(attributes) {
    console.log("updateCartAttributes called ", attributes);

    try {
      const response = await fetch('/cart/update.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          attributes,
        }),
      });
  
      const data = await response.json();
      console.log('Cart attributes updated:', data);
    } catch (error) {
      console.error('Error updating cart attributes:', error);
    }
  }
  
  if (Object.keys(utmData).length) {
    updateCartAttributes(utmData);
  }
  */
  function getCookieTwo(name) {
    console.log('getcooktwo called');
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  
  const uniqueIdentifier = getCookieTwo('honeypotutm');
  let cartToken = getCookieTwo('cart');
  console.log('uniqueIdentifier set', uniqueIdentifier);
  console.log('cartToken set', cartToken);

  if (uniqueIdentifier) {
    console.log('uniqueIdentifier condtonal', uniqueIdentifier);
    addAllEventListeners();
    // Create and start the MutationObserver to detect changes to document.cookie
    const observer = new MutationObserver(() => {
      const newCartToken = getCookieTwo('cart');
      if (newCartToken && newCartToken !== cartToken) {
        console.log('MutationObserver detected change');

        cartToken = newCartToken;
        processCartToken(uniqueIdentifier, cartToken);
        observer.disconnect();
      }
    });
  
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['cookie'],
    });
  
    if (cartToken) {
        console.log('cart token detected processcarttoken called');

      processCartToken(uniqueIdentifier, cartToken);
    }
  }
  
  async function sendDataToServer(uniqueIdentifier, cartToken) {
    console.log('sendDataToServer called');

    try {
      const response = await fetch('https://d2d7-2603-7000-4340-730a-9884-bab3-2a18-4d7d.ngrok-free.app/api/save_data?shop=honeypotshopapp.myshopify.com&host=aG9uZXlwb3RzaG9wYXBwLm15c2hvcGlmeS5jb20vYWRtaW4', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          unique_identifier: uniqueIdentifier,
          cart_token: cartToken,
        }),
      });
  
      if (response.ok) {
        setLocalStorageFlag();
      } else {
        console.error('Error sending data to the server');
      }
    } catch (error) {
      console.error('Error sending data to the server:', error);
    }
  }
  
  function setLocalStorageFlag() {
    localStorage.setItem('data_sent', 'true');
  }
  
  function processCartToken(uniqueIdentifier, cartToken) {
    console.log('processCartToken called');

    const dataSentFlag = localStorage.getItem('data_sent');
    console.log('data sent flag gotten',dataSentFlag );

    if (!dataSentFlag) {
        console.log('sendDataToServer called from processCartToken');

      sendDataToServer(uniqueIdentifier, cartToken);
    }
  }
  
  // Call checkForCartCookie on page load
  function addAllEventListeners() {
    console.log('call addAllEventListeners');

    window.addEventListener('load', () => {
    
        console.log(' add addEventListener');

        // Approach 1: Use common classes and attributes
        const addToCartButtons = document.querySelectorAll('.add-to-cart, .addToCart, [name="add"], [type="submit"]');
        addToCartButtons.forEach(button => {
        button.addEventListener('click', fetchCartData);
        });
    
        // Approach 2: Search for form elements
        const addToCartForms = document.querySelectorAll('form[action*="/cart/add"], form[action*="/cart"]');
        addToCartForms.forEach(form => {
        form.addEventListener('submit', fetchCartData);
        });
    
        // Approach 3: Dynamic addition of event listeners
        document.body.addEventListener('click', (event) => {
        if (event.target.matches('.add-to-cart, .addToCart, [name="add"], [type="submit"]')) {
            fetchCartData();
        }
        });
        console.log(' done addEventListener');

    });
   }

  async function fetchCartData() {
    console.log(' called fetchCartData');

    try {
      const response = await fetch('/cart.js', { method: 'GET' });
      const cartData = await response.json();
      console.log('Cart data:', cartData);
      // Process cart data as needed
      if(cartData.cart_token){
        console.log('cart token not null:', cartData.cart_token);
        sendDataToServer(uniqueIdentifier, cartData.cart_token);
      }

    } catch (error) {
      console.error('Error fetching cart data:', error);
    }
  }

  window.addEventListener('beforeunload', () => {
    localStorage.removeItem('data_sent');
  });
  
