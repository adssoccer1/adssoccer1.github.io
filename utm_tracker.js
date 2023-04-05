console.log("utm_tracker loaded successfully");

function getUTMParameters() {
    console.log("getUTMParameters called ");
    const urlParams = new URLSearchParams(window.location.search);
    const utmParameters = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    const utmData = {};
  
    utmParameters.forEach(param => {
        console.log("getUTMParameters -> ", param);

      if (urlParams.has(param)) {
        console.log("make sure the utm param is a honey pot param or youll store every utm code");
        utmData[param] = urlParams.get(param);
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
    console.log("get cook two called ", name);

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  
  const uniqueIdentifier = getCookieTwo('utm_campaign');
  const cartToken = getCookieTwo('cart');
  console.log("get uniqueIdentifier ", uniqueIdentifier);
  console.log("get cartToken ", cartToken);

  if (uniqueIdentifier && cartToken) {
    console.log("entered condtonal ");

    // Proceed to step 5
    const dataSentFlag = localStorage.getItem('data_sent');
    console.log("dataSentFlag dataSentFlag ", dataSentFlag);

    if (!dataSentFlag) {
    // Proceed to step 6
      sendDataToServer(uniqueIdentifier, cartToken);
    }
}

    
  function setLocalStorageFlag() {
    localStorage.setItem('data_sent', 'true');
  }
  

  async function sendDataToServer(uniqueIdentifier, cartToken) {
    console.log("sendDataToServer now");

    try {
      const response = await fetch('https://5e8c-2603-7000-4340-730a-4e1-d942-4b1d-3906.ngrok.io/api/save_data?shop=honeypotshopapp.myshopify.com&host=aG9uZXlwb3RzaG9wYXBwLm15c2hvcGlmeS5jb20vYWRtaW4', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          unique_identifier: uniqueIdentifier,
          cart_token: cartToken,
        }),
      });
  
      console.log("sendDataToServer response ", response);

      if (response.ok) {
        // Proceed to step 7
        setLocalStorageFlag();
      } else {
        console.error('Error sending data to the server');
      }
    } catch (error) {
      console.error('Error sending data to the server:', error);
    }
  }  

  window.addEventListener('beforeunload', () => {
    localStorage.removeItem('data_sent');
  });
  