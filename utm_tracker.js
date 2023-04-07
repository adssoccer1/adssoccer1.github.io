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
  let cartToken = getCookieTwo('cart');
  console.log("get uniqueIdentifier ", uniqueIdentifier);
  console.log("get cartToken ", cartToken);

  if (uniqueIdentifier){
    console.log("entered condtonal ");
    // Call checkForCartCookie every 5 seconds to check for new cookies
    const intervalID = setInterval(checkForCartCookie, 2500);
    
    if (cartToken){

        // Proceed to step 5
        const dataSentFlag = localStorage.getItem('data_sent');
        console.log("dataSentFlag dataSentFlag ", dataSentFlag);

        if (!dataSentFlag) {
        // Proceed to step 6
        sendDataToServer(uniqueIdentifier, cartToken);
        clearInterval(intervalID);

        }
    }
}

  async function sendDataToServer(uniqueIdentifier, cartToken) {
    console.log("sendDataToServer now");

    try {
      const response = await fetch('https://6b8f-2603-7000-4340-730a-2866-f7dd-34df-d5d7.ngrok.io/api/save_data?shop=honeypotshopapp.myshopify.com&host=aG9uZXlwb3RzaG9wYXBwLm15c2hvcGlmeS5jb20vYWRtaW4', {
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
        setLocalStorageFlag();
      } else {
        console.error('Error sending data to the server');
      }
    } catch (error) {
      console.error('Error sending data to the server:', error);
    }
  }  

  function checkForCartCookie() {
    cartToken = getCookieTwo('cart');
}
    
function setLocalStorageFlag() {
    localStorage.setItem('data_sent', 'true');
  }
  

// Call checkForCartCookie on page load
window.addEventListener('load', checkForCartCookie);


  window.addEventListener('beforeunload', () => {
    localStorage.removeItem('data_sent');
  });
  