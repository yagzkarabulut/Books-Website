// ! toggle menu
let bookList = [];
let basketList = [];

const toggleModel = ()=>{
    const basketModel = document.querySelector(".basket-model");
    basketModel.classList.toggle("active");
};

const getBooks = () => {
    fetch("./products.json")
    .then((res)=>res.json())
    .then((books) => (bookList=books) )
    .catch((err)=> console.log(err));
}
getBooks()
//! dinamik yıldızlar oluşturduk
const createBookStars = (starRate) => {
    // console.log(starRate);
    let starRateHtml = "";
    for(let i =1 ; i<=5; i++){
        if(Math.round(starRate) >=i){
            starRateHtml +=`<i class="bi bi-star-fill active"></i>`;
        }else{
            starRateHtml += `<i class="bi bi-star-fill"></i>`;
        }
    }
    return starRateHtml;
}

//! html oluşturduk ve bunu içersine kitapları gönderdik
const createBookItemsHtml = ()=> {
    const bookListEl = document.querySelector(".book-list");
    let bookListHtml = "";

    bookList.forEach((book,index)=> {
       bookListHtml += `
       <div class="col-5 ${index %2 == 0 && "offset-2"} my-5">
                <div class="row book-card">
                    <div class="col-6">
                        <img src="${book.imgSource}" alt="" class="img-fluid shadow">
                    </div>
                    <div class="col-6 d-flex flex-column justify-content-center gap-4">
                        <div class="book-detail">
                            <span class="fos gray fs-5">${book.author}</span> <br>
                            <span class="fs-5 fw-bold">${book.name}</span><br>
                            <span class="book-star-rate">
                                ${createBookStars(book.starRate)}
                            </span>
                        </div>
                        <p class="book-description fos gray"> ${book.description}</p>
                        <div>
                            <span class="black fw-bold fs-4 me-2">${book.price}tl</span>
                            <span class="fs-4 fw-bold old-price">${book.oldPrice ? `<span class="fs-4 fw-bold old-price">${book.oldPrice}tl</span>` : ""}</span>
                        </div>
                        <button class="btn-purple" onClick="addBookToBasket(${book.id})">Sepete Ekle</button>
                    </div>
                </div>
            </div>
            `;
            bookListEl.innerHTML = bookListHtml ;
    });
    
};

const BOOK_TYPES = {
    ALL:"Tümü",
    NOVEL:"Roman",
    CHILDREN:"Çocuk",
    HISTORY:"Tarih",
    FINANCE:"Finans",
    SCIENCE:"Bilim",
    SELFIMPROVEMENT:"Kişisel Gelişim"
};
const createBookTypesHtml =()=>{
    const filterEl = document.querySelector(".filter")
    //console.log(filterEl);
    let filterHtml ="";
    // filtre türlerini tutacak "ALL" türüyle başlatışmıştır. 
    let filterTypes = ["ALL"];
    bookList.forEach((book)=> {
        if(filterTypes.findIndex((filter )=>filter == book.type) == -1){
            filterTypes.push(book.type);
        }
    });
        filterTypes.forEach((type,index) => {
            //console.log(type);
            filterHtml += `<li onClick="filterBooks(this)" data-types=${type} class=${index == 0 
                ? "active"
                : null}>${BOOK_TYPES[type] || type }</li>`
        });
    
    filterEl.innerHTML = filterHtml;
};

const filterBooks =(filterEl) =>{
    document.querySelector(".filter .active").classList.remove("active")
    filterEl.classList.add("active");
    let bookType = filterEl.dataset.types;
    // console.log(bookType);
    getBooks();
    if(bookType != "ALL") {
        bookList = bookList.filter(book =>book.type == bookType);
        }
        createBookItemsHtml();
    
};

const listBasketItems = ()=>{
  const basketListEl =  document.querySelector(".basket-list")
  const basketCountEl = document.querySelector(".basket-count")
  const totalQuantity = basketList.reduce((total,item)=>total + item.quantity,0);
  basketCountEl.innerHTML = totalQuantity >0 ? totalQuantity : null;
  const totalPriceEl = document.querySelector(".total-price")
  console.log(totalPriceEl);
  let basketListHtml = "";
  let totalPrice = 0;
  basketList.forEach((item) => {
    totalPrice +=item.product.price * item.quantity ;
    basketListHtml += `
    <li class="basket-item">
                    <img src="${item.product.imgSource}" alt="" width="100" height="100">
                    <div class="basket-item-info">
                        <h3 class="book-name">${item.product.name}</h3>
                        <span class="book-price">${item.product.price}</span> <br>
                        <span class="book-remove" onClick ="removeItemBasket(${item.product.id})">Sepetten Kaldır</span>
                    </div>
                    <div class="book-count">
                        <span class="decrase" onClick = "decreaseItemToBasket(${item.product.id})">-</span>
                        <span class="mx-2">${item.quantity}</span>
                        <span class="increase" onClick ="increaseItemToBasket(${item.product.id})">+</span>
                    </div>
                </li>
                `;
  });
  basketListEl.innerHTML = basketListHtml ? basketListHtml : `<li class="basket-item">Sepette Bir Ürün Ekleyiniz...</li> `;
  totalPriceEl.innerHTML = totalPrice >0 ? "Total:" +totalPrice+"tl" : null

}


// sepete ürün ekleme 
const addBookToBasket =(bookId) => {
    let findedBook = bookList.find(book=>book.id ==bookId);
    // console.log(findedBook);
    if(findedBook){
       const basketAllreadyIndex = basketList.findIndex(
        (basket) => basket.product.id == bookId);
        if (basketAllreadyIndex == -1){
            let addItem = {quantity: 1 ,product : findedBook};
            basketList.push(addItem);
    }else{
        basketList[basketAllreadyIndex].quantity += 1;
    }
   } 
   const btnCheck = document.querySelector(".btCheck");
   btnCheck.style.display = "block"
   listBasketItems();
};

const removeItemBasket = (bookId) =>{
    const findedIndex = basketList.findIndex(
    (basket) => basket.product.id == bookId);
    if(findedIndex != -1){
        basketList.splice(findedIndex,1);
    };
    const btnCheck = document.querySelector(".btCheck");
   btnCheck.style.display = "none"
    listBasketItems();
};
// sepetteki ürünün miktarinı azaltma
const decreaseItemToBasket = (bookId)=>{
   const findedIndex = basketList.findIndex(
    (basket) => basket.product.id == bookId);
    if(findedIndex !=-1 ) {
        if(basketList[findedIndex].quantity != 1){
            basketList[findedIndex].quantity-= 1;
        }else {
            removeItemBasket(bookId)
        }
        listBasketItems()
    };
    listBasketItems();
};
const increaseItemToBasket = (bookId)=>{
   const findedIndex= basketList.findIndex(
    (basket) => basket.product.id == bookId);
    if(findedIndex != -1){
        basketList[findedIndex].quantity+=1
    }
    listBasketItems();
}

// datanın gelmesini bekledik
setTimeout(() => {
    createBookItemsHtml();
    createBookTypesHtml();
}, 100);
