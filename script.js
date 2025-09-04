
const ctaBtn = document.getElementById("ctaBtn");
if (ctaBtn) {
  ctaBtn.addEventListener("click", function () {
    var bookingSection = document.getElementById("booking");
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth" });
    }
  });
}

const navLinks = document.querySelectorAll('nav a[href^="#"]');

navLinks.forEach(function (link) {
  link.addEventListener("click", function (e) {
    e.preventDefault(); // prevent default jump

    const targetId = this.getAttribute("href").substring(1); // remove '#'
    const targetSection = document.getElementById(targetId);

    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  });
})

const services = {
  "dry-cleaning": { name: "Dry Cleaning", price: 200.00 },
  "wash-fold": { name: "Wash & Fold", price: 100.00 },
  "ironing": { name: "Ironing", price: 30.00 },
  "stain-removal": { name: "Stain Removal", price: 500.00 },
  "leather-suede": { name: "Leather & Suede Cleaning", price: 999.00 },
  "wedding-dress": { name: "Wedding Dress Cleaning", price: 2800.00 }
};

var cart = [];
var elCartBody = document.getElementById("cart-items");
var elTotal = document.getElementById("total");


function renderCart() {
  elCartBody.innerHTML = "";

  if (cart.length === 0) {
    var row = document.createElement("tr");
    var cell = document.createElement("td");
    cell.colSpan = 3;
    cell.className = "muted";
    cell.textContent = "No items added yet.";
    row.appendChild(cell);
    elCartBody.appendChild(row);
  } else {
    for (var i = 0; i < cart.length; i++) {
      var item = cart[i];

      var tr = document.createElement("tr");
      var td1 = document.createElement("td");
      var td2 = document.createElement("td");
      var td3 = document.createElement("td");
      td3.className = "right";

      td1.textContent = i + 1;
      td2.textContent = item.name;
      td3.textContent = "₹" + item.price;

      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      elCartBody.appendChild(tr);
    }
  }

  var total = cart.reduce(function (sum, item) {
    return sum + item.price;
  }, 0);
  elTotal.textContent = total;
}


function addService(key) {
  var s = services[key];
  if (!s) return;

  if (cart.find(item => item.name === s.name)) return;

  cart.push({ name: s.name, price: s.price });
  toggleButtons(key, true);
  renderCart();
}


function removeService(key) {
  var s = services[key];
  if (!s) return;

  cart = cart.filter(item => item.name !== s.name);
  toggleButtons(key, false);
  renderCart();
}


function toggleButtons(key, inCart) {
  var addBtn = document.getElementById("add-item-" + key);
  var removeBtn = document.getElementById("remove-item-" + key);

  if (inCart) {
    if (addBtn) addBtn.style.display = "none";
    if (removeBtn) removeBtn.style.display = "inline-block";
  } else {
    if (addBtn) addBtn.style.display = "inline-block";
    if (removeBtn) removeBtn.style.display = "none";
  }
}


for (var key in services) {
  (function (key) {
    var addBtn = document.getElementById("add-item-" + key);
    var removeBtn = document.getElementById("remove-item-" + key);

    if (addBtn) {
      addBtn.addEventListener("click", function () {
        addService(key);
      });
    }

    if (removeBtn) {
      removeBtn.addEventListener("click", function () {
        removeService(key);
      });
      removeBtn.style.display = "none";
    }
  })(key);
}


renderCart();

if (window.emailjs) {
  emailjs.init({ publicKey: "GIxY5lUDQHslKAYYc" });
}

var bookingForm = document.getElementById("bookingForm");
var confirmation = document.getElementById("confirmation");
var bookBtn = document.getElementById("bookBtn");

if (bookingForm) {
  bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (cart.length === 0) {
      confirmation.textContent = "Please add at least one service before booking.";
      confirmation.style.color = "#bb1717";
      return;
    }

    var fullName = document.getElementById("fullName").value.trim();
    var emailId = document.getElementById("emailId").value.trim();
    var phone = document.getElementById("phone").value.trim();

    if (!fullName || !emailId || !phone) {
      confirmation.textContent = "Please fill all details.";
      confirmation.style.color = "#bb1717";
      return;
    }

    var orderLines = "";
    var total = 0;
    for (var i = 0; i < cart.length; i++) {
      orderLines += (i + 1) + ". " + cart[i].name + " - ₹" + cart[i].price + "\n";
      total += cart[i].price;
    }

    var templateParams = {
      user_name: fullName,
      user_email: emailId,
      user_phone: phone,
      order_details: orderLines,
      order_total: "₹" + total
    };

    bookBtn.disabled = true;
    confirmation.style.color = "#118a2f";
    confirmation.textContent = "Processing your booking…";

    emailjs.send("service_5hv637v", "template_txy98nk", templateParams)
      .then(function () {
        confirmation.textContent = "Thank you For Booking the Service. We will get back to you soon!";
        cart = [];
        renderCart();

        // Reset all buttons
        for (var key in services) {
          toggleButtons(key, false);
        }

        bookingForm.reset();
      })
      .catch(function (err) {
        console.log(err);
        confirmation.style.color = "#bb1717";
        confirmation.textContent = "Sorry, something went wrong sending confirmation. Please try again.";
      })
      .finally(function () {
        bookBtn.disabled = false;
      });
  });
}


var newsletterForm = document.getElementById("newsletterForm");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = document.getElementById("newsName").value.trim();
    var email = document.getElementById("newsEmail").value.trim();
    if (!name || !email) return;
    alert("Thanks, " + name + "! You're subscribed with " + email + ".");
    newsletterForm.reset();
  });
}
