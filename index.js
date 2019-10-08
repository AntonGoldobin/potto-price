const axios = require('axios');
const cheerio = require('cheerio');

const generalUrl = 'https://youthstore.ru'

const url = 'https://youthstore.ru/c/men/clothes/winter-jackets'

//all data from all pages
let pagesData = []

let nextPageUrl = ''

//infinity cycle while bot can find 'next page' button
function getAllPages(url){

  axios.get(url)
    .then(async responce => {

      let getData = html => {
        const $ = cheerio.load(html, { decodeEntities: false })

        //data for every page
        let data = []

        //try to find 'next page' button, else put empty string for ending cycle
        if($('#pagination').find(".to-next a").attr('href')){
          nextPageUrl = generalUrl + $('#pagination').find(".to-next a").attr('href')
        }
        else{
          nextPageUrl = ''
        }

        //find all items and get title, info and price
        $("#items-holder li").each((i, elem) => {
          data.push({
            title: $(elem).find('.title').text(),
            img: $(elem).find('img').eq(0).attr('src'),
            price: $(elem).find('.price').text(),
            url: generalUrl + $(elem).find('a').attr('href')
          })

        });

        //push current page data to 'allPages' array
        pagesData.push(data)
      }

      //start grabbing
      await getData(responce.data)

      //if bot can find next page, start func again, else show results
      if(nextPageUrl !== ''){
        await getAllPages(nextPageUrl)
      }
      else{
        console.log(pagesData)
      }


    })
    .catch(error =>
    {console.log(error)
    })

}

//First start
getAllPages(url)




