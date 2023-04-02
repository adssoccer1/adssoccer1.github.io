console.log("utm_tracker loaded successfully");

function getUTMParameters() {
    console.log("getUTMParameters called ");
    const urlParams = new URLSearchParams(window.location.search);
    const utmParameters = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    const utmData = {};
  
    utmParameters.forEach(param => {
        console.log("getUTMParameters -> ", param);

      if (urlParams.has(param)) {
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
  

  // Find the checkout form
const checkoutForm = document.querySelector('form[action*="/checkout"]');

if (checkoutForm) {
    console.log("checkoutForm prnt");
  // Intercept the form submission event and prevent the default behavior
  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    appendCookieToOrderNote();
  });
}

function appendCookieToOrderNote() {
    console.log("appendCookieToOrderNote prnt");

  // Find the order note field
  const noteField = checkoutForm.querySelector('textarea[name="note"]');

  const cookieValue = getCookie('utm_campaign');
  console.log("got cook value prnt, ", cookieValue );

  if (cookieValue && noteField) {
    noteField.value = `${noteField.value} (cookie:${cookieValue})`;
  }
  // Submit the form after updating the order note
  checkoutForm.submit();
}

