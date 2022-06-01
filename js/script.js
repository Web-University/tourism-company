window.addEventListener('DOMContentLoaded', () => {
    // document.querySelector("#home").onclick = () => { location.reload() }
    document.querySelector("#Logo").onclick = () => {
        console.log("Logo");
        loadRegions()
        loadMainCaroucel()
        loadCatalog()
    }


    loadRegions()
    loadMainCaroucel()
    loadCatalog()


    setTimeout(() => {
        setSwipe()
        setInterval(() => { setSwipe() }, 30000)
    }, 2000)



});
function setSwipe() {
    document.querySelectorAll(".carousel-control-next").forEach((i) => {
        setTimeout(() => {
            i.dispatchEvent(new Event("click"))

        }, getRandomArbitrary(4000, 7000))
    })
}
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
function loadCatalog() {
    let CatalogStr = `<a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"data-bs-toggle="dropdown" aria-expanded="false">Каталог</a><ul class="dropdown-menu text-center " aria-labelledby="navbarDropdown">`
    document.querySelector("#burger").innerHTML = ""
    GET("db/regions/regions.json", "json").then(Jregions => {
        Jregions.forEach((i) => {
            document.querySelector("#burger").innerHTML += `<li><a class="" onclick="goToRegion('db/regions/${i.shortnameRegion}');" href="#">${i.shortnameRegion}</a></li>`
            CatalogStr += `<li><a class="dropdown-item " onclick="goToRegion('db/regions/${i.shortnameRegion}');" href="#">${i.shortnameRegion}</a></li>`
        })
        CatalogStr += `</ul></li>`
        document.querySelector("#Catalog").innerHTML = CatalogStr
    })
    window.scrollTo(0, 0)
}

let links = {}
function GET(URI, ContentTypy) {
    return new Promise(function (resolve, reject) {
        if (links[URI]) resolve(links[URI])
        let request = new XMLHttpRequest();
        request.open('GET', URI, true);
        request.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
        // request.setRequestHeader('Accept', 'application/json');
        request.send();
        request.addEventListener('readystatechange', function () {
            if (request.readyState === 4 && request.status === 200) {
                if (ContentTypy == "text") {
                    links[URI] = request.response
                }
                if (ContentTypy == "json") {
                    links[URI] = JSON.parse(request.response)
                }
                resolve(links[URI])
            }
        });
    })
}

function loadRegions() {
    document.querySelector("#Categories").innerHTML = ""
    GET("inserts/region.html", "text").then(region => {
        GET("inserts/region-carousel-item.html", "text").then(carousel_item => {
            GET("db/regions/regions.json", "json").then(Jregions => {
                let index=0;
                Jregions.forEach(i => {
                    let Region = region;
                    GET(`db/regions/${i.shortnameRegion}/places.json`, "json").then(places => {
                        places.forEach(l => {
                            let carouselItemHtml = insertProperty(carousel_item, "img", `db/regions/${i.shortnameRegion}/${l.shortname}/1.jpg`)
                            carouselItemHtml = insertProperty(carouselItemHtml, "active", l.id == 1 ? "active" : "")
                            carouselItemHtml = insertProperty(carouselItemHtml, "alt", l.shortname)
                            Region = insertProperty(Region, "img", carouselItemHtml + (l.id != places[places.length - 1].id ? '{{img}}' : ""))
                        })
                        Region = insertProperty(Region, "textHeader", i.name)
                        Region = insertProperty(Region, "onclick", `onclick="goToRegion('db/regions/${i.shortnameRegion}');"`)
                        Region = insertProperty(Region, "nameRegion", i.shortnameRegion)
                        Region = insertProperty(Region, "text", i.notes)
                        Region = insertProperty(Region, "carouselExampleControls", "carouselExampleControls" + i.id, "g")
                        Region = insertProperty(Region, "flex-row-reverse", index++ % 2 == 0 ? "flex-row-reverse" : "")       
                        document.querySelector("#Categories").innerHTML += Region

                    })
                })
            })
        })
    })
}
function loadMainCaroucel() {
    GET("inserts/main-carousel.html", "text").then(main_carousel => {
        GET("inserts/main-carousel-item.html", "text").then(main_carousel_item => {
            GET("db/regions/regions.json", "json").then(Jregions => {
                Jregions.forEach(i => {
                    let Main_carousel_item = main_carousel_item;
                    GET(`db/regions/${i.shortnameRegion}/places.json`, "json").then(places => {
                        Main_carousel_item = insertProperty(Main_carousel_item, "link", `db/regions/${i.shortnameRegion}/${places[0].shortname}/1.jpg`)
                        Main_carousel_item = insertProperty(Main_carousel_item, "name", places[0].name)
                        Main_carousel_item = insertProperty(Main_carousel_item, "alt", places[0].name)
                        Main_carousel_item = insertProperty(Main_carousel_item, "active", i.id == 1 ? "active" : "")
                        main_carousel = insertProperty(main_carousel, "main-carousel-item", Main_carousel_item + (i.id != Jregions[Jregions.length - 1].id ? '{{main-carousel-item}}' : ""))
                        main_carousel = insertProperty(main_carousel, "mainText", 'Подорожуйте та будьте щасливими!')
                        
                        document.querySelector("#carouselExampleIndicators").innerHTML = main_carousel
                    })
                })
            })
        })
    })
}

function insertProperty(string, propName, PropValue, flag) {
    return string.replace(new RegExp("{{" + propName + "}}", flag), PropValue)
}
function goToRegion(nameRegoin) {
    if (!document.querySelector("#btBurger").classList.contains("collapsed")) {
        document.querySelector("#btBurger").dispatchEvent(new Event("click"))
    }
    window.scrollTo(0, 0)
    loadMainCaroucelRegoin(nameRegoin)
    loadOneRegion(nameRegoin)
}

function loadMainCaroucelRegoin(nameRegoin) {
    GET("db/regions/regions.json", "json").then(Jregions => {
        GET("inserts/main-carousel.html", "text").then(main_carousel => {
            GET("inserts/main-carousel-item.html", "text").then(main_carousel_item => {
                GET(`${nameRegoin}/places.json`, "json").then(places => {
                    places.forEach(i => {
                        let Main_carousel_item = main_carousel_item;
                        Main_carousel_item = insertProperty(Main_carousel_item, "link", `${nameRegoin}/${i.shortname}/1.jpg`)
                        Main_carousel_item = insertProperty(Main_carousel_item, "name", i.name)
                        Main_carousel_item = insertProperty(Main_carousel_item, "alt",  i.name)
                        Main_carousel_item = insertProperty(Main_carousel_item, "active", i.id == 1 ? "active" : "")
                        main_carousel = insertProperty(main_carousel, "main-carousel-item", Main_carousel_item + (i.id != places[places.length - 1].id ? '{{main-carousel-item}}' : ""))
                        main_carousel = insertProperty(main_carousel, "mainText", Jregions.find((i =>
                            i.shortnameRegion == nameRegoin.slice(nameRegoin.lastIndexOf("/") + 1, nameRegoin.length))).name)

                    })
                    document.querySelector("#carouselExampleIndicators").innerHTML = main_carousel
                    document.querySelector("#descriptionText").innerHTML = `<h2>${Jregions.find((i => i.shortnameRegion == nameRegoin.slice(nameRegoin.lastIndexOf("/") + 1, nameRegoin.length))).notes}</h2>`
                })
            })
        })
    })
}
function loadOneRegion(nameRegoin) {
    document.querySelector("#Categories").innerHTML = ""
    GET("inserts/region.html", "text").then(region => {
        GET("inserts/region-carousel-item.html", "text").then(carousel_item => {
            GET(`${nameRegoin}/places.json`, "json").then(places => {
                let index=0;
                places.forEach(i => {
                    let Region = region;
                    let carouselItemHtml

                    for (let l = 1; l <= i.photosAmount; l++) {
                        carouselItemHtml = insertProperty(carousel_item, "img", `${nameRegoin}/${i.shortname}/${l}.jpg`)
                        carouselItemHtml = insertProperty(carouselItemHtml, "active", l == 1 ? "active" : "")
                        carouselItemHtml = insertProperty(carouselItemHtml, "alt", i.name)
                        Region = insertProperty(Region, "img", carouselItemHtml + (l < i.photosAmount ? '{{img}}' : ""))
                    }

                    Region = insertProperty(Region, "carouselExampleControls", "carouselExampleControls" + i.id, "g")
                    Region = insertProperty(Region, "onclick", `onclick="goToLocation('${nameRegoin}/${i.shortname}');"`)
                    Region = insertProperty(Region, "textHeader", i.name)
                    Region = insertProperty(Region, "flex-row-reverse", index++ % 2 == 0 ? "flex-row-reverse" : "")
                    Region = insertProperty(Region, "text", i.description)
                    document.querySelector("#Categories").innerHTML += Region
                })
            })
        })
    })
}
function goToLocation(nameLocation) {
    window.scrollTo(0, 0)

    loadMainCaroucelLocation(nameLocation)
}


function loadMainCaroucelLocation(nameLocation) {
    GET("db/regions/regions.json", "json").then(Jregions => {
        GET("inserts/main-carousel.html", "text").then(main_carousel => {
            GET("inserts/main-carousel-item.html", "text").then(main_carousel_item => {
                let str = nameLocation.slice(0, nameLocation.lastIndexOf("/"))
                let str2 = nameLocation.slice(nameLocation.lastIndexOf("/") + 1, nameLocation.length)

                GET(`${str}/places.json`, "json").then(places => {

                    for (let l = 1; l <= places.find((i => i.shortname == str2)).photosAmount; l++) {
                        let Main_carousel_item = insertProperty(main_carousel_item, "link", `${nameLocation}/${l}.jpg`)
                        Main_carousel_item = insertProperty(Main_carousel_item, "active", l == 1 ? "active" : "")
                        Main_carousel_item = insertProperty(Main_carousel_item, "alt",  str2)
                        Main_carousel_item = insertProperty(Main_carousel_item, "name", "")
                        main_carousel = insertProperty(main_carousel, "main-carousel-item", Main_carousel_item + (l < places.find((i => i.shortname == str2)).photosAmount ? '{{main-carousel-item}}' : ""))
                        main_carousel = insertProperty(main_carousel, "mainText",
                            places.find((i => i.shortname == str2)).name)
                    }
                    document.querySelector("#carouselExampleIndicators").innerHTML = main_carousel
                    document.querySelector("#descriptionText").innerHTML = `<h2>${places.find((i => i.shortname == str2)).description}</h2>`

                    GET(`inserts/iframe.html`, "text").then(iframe => {
                        iframe = insertProperty(iframe, "gmapsRef", places.find((i => i.shortname == str2)).gmapsRef)
                        document.querySelector("#Categories").innerHTML = iframe
                    })
                })
            })
        })
    })
}

