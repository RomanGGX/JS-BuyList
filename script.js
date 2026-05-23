var addButton = document.getElementById("add");
var productContainer = document.getElementById("product-container");

addButton.addEventListener("click", function() {
   var addInput = document.getElementById("search").value;
   var newProduct = document.createElement("div");
   var productName = document.createElement("span");
   var amountControls = document.createElement("div");
   var amountProduct = document.createElement("span");
   var decButton = document.createElement("button");
   var incButton = document.createElement("button");
   var productControls = document.createElement("div");
   var boughtBox = document.createElement("span");
   var deleteButton = document.createElement("button");
   var searchInput = document.getElementById("search");

   if (addInput === "") {
        alert("Введіть назву товару!");
        return;
   }

   newProduct.className = "product-item";
   productName.textContent = addInput;
   productName.className = "product-name"

   amountControls.className = "amount-controls";
   amountProduct.textContent = "1";
   amountProduct.className = "amount";
   decButton.className = "dec-btn not-bought";
   incButton.className = "inc-btn";
   decButton.textContent = "-";
   incButton.textContent = "+";
   decButton.dataset.tooltip = "Зменшити к-ть";
   incButton.dataset.tooltip = "Збільшити к-ть";
   productControls.className = "product-controls";
   boughtBox.className = "bought-box";
   deleteButton.className = "cross-btn";
   deleteButton.dataset.tooltip = "Видалити товар";
   boughtBox.textContent = "Куплено";
   deleteButton.textContent = "×";

   deleteButton.addEventListener("click", function() {
       newProduct.remove();
   });
   
   productControls.appendChild(boughtBox);
   productControls.appendChild(deleteButton);

   amountControls.appendChild(decButton);
   amountControls.appendChild(amountProduct);
   amountControls.appendChild(incButton);

   newProduct.appendChild(productName);
   newProduct.appendChild(amountControls);
   newProduct.appendChild(productControls);
   
   productContainer.appendChild(newProduct);

   document.getElementById("search").value = "";
   document.getElementById("search").focus();

   updateStatistics();
});

var deleteButtons = document.getElementsByClassName("cross-btn");

for (let i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].addEventListener("click", function() {
    var productItem = this.closest(".product-item");
    if (productItem) {
        productItem.remove();
        updateStatistics();
    }
});
}

productContainer.addEventListener("click", function() {
    if (event.target.classList.contains("bought-box")) {
        var currentButton = event.target;
        var productItem = currentButton.closest(".product-item");
        var productName = productItem.querySelector(".product-name");
        var amountControls = productItem.querySelector(".amount-controls");
        var incButton = productItem.querySelector(".inc-btn");
        var decButton = productItem.querySelector(".dec-btn");
        var deleteButton = productItem.querySelector(".cross-btn");

        if (currentButton.textContent === "Куплено") {
            currentButton.textContent = "Не куплено";
            
            productName.classList.add("not-bought"); 
            
            incButton.style.display = "none";
            decButton.style.display = "none";
            deleteButton.style.display = "none";

        } else {
            currentButton.textContent = "Куплено";
            
            productName.classList.remove("not-bought");
            incButton.style.display = "inline";
            decButton.style.display = "inline";
            deleteButton.style.display = "inline";
        }
        updateStatistics();
    }
});

productContainer.addEventListener("click", function(event) {
    if (event.target.classList.contains("product-name") && !event.target.classList.contains("not-bought")) {
        var spanName = event.target;
        var currentText = spanName.textContent;
        var inputEdit = document.createElement("input");
        inputEdit.type = "text";
        inputEdit.className = "edit-product-name";
        inputEdit.value = currentText;

        spanName.replaceWith(inputEdit);

        inputEdit.focus();
        inputEdit.select();
    }
});

productContainer.addEventListener("blur", function(event) {
    if (event.target.classList.contains("edit-product-name")) {
        var inputEdit = event.target;
        var newText = inputEdit.value.trim();
        var spanName = document.createElement("span");

        if (newText === "") {
            alert("Назва товару не може бути порожньою!");
            setTimeout(function() {
                inputEdit.focus();
                inputEdit.select();
            }, 0);
            return;
        }

        spanName.className = "product-name";
        spanName.textContent = newText;

        inputEdit.replaceWith(spanName);
        updateStatistics();
    }
}, true);

productContainer.addEventListener("click", function(event) {
    var isPlus = event.target.classList.contains("inc-btn");
    var isMinus = event.target.classList.contains("dec-btn");

    if (isPlus || isMinus) {
        var clickedButton = event.target;
        var productItem = clickedButton.closest(".product-item");
        
        var boughtBox = productItem.querySelector(".bought-box");
        if (boughtBox && boughtBox.textContent !== "Куплено") {
            return;
        }

        var amountSpan = productItem.querySelector(".amount");
        var decButton = productItem.querySelector(".dec-btn");
        var currentAmount = parseInt(amountSpan.textContent);

        if (isPlus) {
            currentAmount += 1;
        } else if (isMinus && currentAmount > 1) {
            currentAmount -= 1;
        }

        amountSpan.textContent = currentAmount;
        if (currentAmount === 1) {
            decButton.classList.add("not-bought");
        } else {
            decButton.classList.remove("not-bought");
        }
        updateStatistics();
    }
});

function updateStatistics() {
    var tagsContainers = document.querySelectorAll(".tags-container");
    var leftToBuyContainer = tagsContainers[0];
    var alreadyBoughtContainer = tagsContainers[1];
    var productItems = document.querySelectorAll(".product-item");

    leftToBuyContainer.textContent = "";
    alreadyBoughtContainer.textContent = "";

    productItems.forEach(function(productItem) {
        var nameSpan = productItem.querySelector(".product-name");
        var productName = "";
        
        if (nameSpan) {
            productName = nameSpan.textContent;
        } else {
            var nameInput = productItem.querySelector(".edit-product-name");
            if (nameInput) {
                productName = nameInput.value.trim();
            }
        }
        
        if (!productName || productName === "Товар без назви") {
            return;
        }

        var amountSpan = productItem.querySelector(".amount");
        var amount = amountSpan ? amountSpan.textContent : "1";

        var boughtBox = productItem.querySelector(".bought-box");
        var isBought = (boughtBox && boughtBox.textContent === "Не куплено");

        var badge = document.createElement("span");
        if (isBought) {
            badge.className = "badge bought";
        } else {
            badge.className = "badge";
        }
        badge.textContent = productName + " "; 
        var badgeNum = document.createElement("span");
        badgeNum.className = "badge-num";
        badgeNum.textContent = amount;

        badge.appendChild(badgeNum);

        if (isBought) {
            alreadyBoughtContainer.appendChild(badge);
        } else {
            leftToBuyContainer.appendChild(badge);
        }
    });
}