const axios = require('axios');
const cheerio = require('cheerio');

const generalUrl = 'https://youthstore.ru'

const url = 'https://youthstore.ru/c/men/clothes/winter-jackets'

let pagesData = []

let nextPageUrl = ''

function getAllPages(url){

  axios.get(url)
    .then(async responce => {

      let getData = html => {
        const $ = cheerio.load(html, { decodeEntities: false })

        let data = []

        if($('#pagination').find(".to-next a").attr('href')){
          nextPageUrl = generalUrl + $('#pagination').find(".to-next a").attr('href')
        }
        else{
          nextPageUrl = ''
        }

        $("#items-holder li").each((i, elem) => {
          data.push({
            title: $(elem).find('.title').text(),
            info: $(elem).find('.info').text(),
            price: $(elem).find('.price').text()
          })

        });


        pagesData.push(data)
      }

      await getData(responce.data)

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

function startGrab(url){
  getAllPages(url)
}

startGrab(url)



