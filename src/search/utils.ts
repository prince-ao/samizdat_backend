import axios from 'axios'
import cheerio from 'cheerio'
import { libraryDomain, scrapedData } from '../recent/utils'
import BKTree from 'mnemonist/bk-tree'
import mysql from 'mysql'
import { distance } from 'fastest-levenshtein'

export let t: BKTree<string>

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'everyday',
  database: 'book_titles'
})

export const initializeBKTree = async () => {
  connection.connect()
  connection.query("SELECT * from books", function(err, results){
    if (err){ 
      throw err;
    }
    let s: string[] = results.map((a: any) => {
      return Object.values(JSON.parse(JSON.stringify(a)))[0]
    })
    const tree = BKTree.from(s, distance)
    t = tree
  })
  connection.end()
}

export const getRec = (word: string) => {
  const ans = t.search(word?.length/6, word)
  return ans[0]
}

export const search = async (word: string) => {
  const searchResults: scrapedData[] = []
zed:
  try{
  const page = await axios.get(`http://libgen.rs/search.php?req=${word}`)
  const $ = cheerio.load(page.data)
  if($("table.c > tbody").children().length == 1){
    return searchResults
  }
  $('table.c > tbody > tr').each((i, el) => {
    const container: scrapedData = {
      id: "",
      title: "",
      author: "",
      publisher: "",
      year: "",
      language: "",
      format: "",
      size: "",
      pages: "",
      link: "",
      image: "",
      description: "",
      isbm: ""
    }
    $(el.children).each((i, el) => {
      if($(el).text() === "\n\t\t\t\t"){
        return
      }
      switch(i){
        case 0:
          container.id = $(el).text();
          break;
        case 2:
          container.author = $(el).text();
          break;
        case 4:
          let is = false;
          let potLink: string = ""
          $(el).children().each((i, el) => {
            if(is){
              return
            }
            if($(el).attr('href')?.at(0) === 'b'){
              is = true
              potLink = $(el).attr('href') || ""
            }
          })
          let realLink: string = ""
          for(let i =0; i < potLink.length; i++){
            if(potLink![i] === 'm' && potLink![i+1] === 'd' && potLink![i+2] === '5' && potLink![i+3] === '='){
              realLink = potLink!.substring(i+4, potLink!.length)
              break;
            }
          }
          container.title = $(el).text()
          container.link = `${libraryDomain}main/${realLink}`
          break;
         case 6:
           container.publisher = $(el).text();
          break;
        case 8:
          container.year = $(el).text();
          break;
        case 10:
          container.pages = $(el).text();
          break;
        case 12:
          container.language = $(el).text();
          break;
        case 14:
          container.size = $(el).text();
          break;
        case 16:
          container.format = $(el).text();
          break;
      }
    })
    searchResults[i] = container
  })
}catch(e: any){
  console.log("Error: "+ e)
  return []
}
  searchResults.shift()
  for(let i = 0; i < searchResults.length; i++){
    await axios.get(searchResults[i].link).then((data) => {
      const $ = cheerio.load(data.data);
      searchResults[i].image = `${libraryDomain.substring(0,libraryDomain.length-1)}${$('img').attr('src')}` || ""
      searchResults[i].link = $('h2 > a').attr('href') || ""
      searchResults[i].description = $('#info > div:eq(2)').text()
      searchResults[i].title = $('h1').text()
      searchResults[i].isbm = $('p:eq(2)').text()
    })
  }
  return searchResults
}