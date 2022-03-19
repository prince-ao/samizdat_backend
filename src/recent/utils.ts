import axios from "axios";
import cheerio from "cheerio";
import net from 'net';
import http from 'http'
import fs from 'fs'
import path from 'path'

export interface scrapedData {
  id: string
  title: string;
  author: string;
  publisher: string;
  year: string;
  language: string;
  format: string;
  size: string;
  pages: string;
  link: string;
  image: string;
  description: string;
  isbm: string
}

const domain = "http://libgen"
const libraryDomain = "http://library.lol/"
const websites = [`${domain}.rs/`, `${domain}.is/`, `${domain}.st/`]

const getPage: () => Promise<any> = async () => {
  let i = 0
  do{
    try{
      const response = await axios.get(`${websites[i]}search.php?mode=last`)
      if(response.status < 400) return response.data
    }catch(e){
      console.log(`there is an error with ${websites[i]}`)
    }
    if(i === 3){
      return "No Data"
    }
    i++
  }while(1);
}

const getRecent = async () => {
  const data = await getPage();
  const $ = cheerio.load(data)
  const recent: [scrapedData] = [{
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
  }]
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
    recent[i] = container
  })
  // future insight: maybe you fill all the nessary data with the library.lol page instead of libgen
  recent.shift()

  for(let i = 0; i < recent.length; i++){
    await axios.get(recent[i].link).then((data) => {
      const $ = cheerio.load(data.data);
      recent[i].image = `${libraryDomain.substring(0,libraryDomain.length-1)}${$('img').attr('src')}` || ""
      recent[i].link = $('h2 > a').attr('href') || ""
      // console.log($('#info > div:eq(1)').text())
      // console.log($('div#info > div:eq(1)').text())
      // console.log($('div:eq(1) > div:eq(1)').text())
      // console.log($('#info > div:eq(0)').text())
      // console.log($('#info > div:eq(2)').text())
      recent[i].description = $('#info > div:eq(2)').text()
      recent[i].title = $('h1').text()
      recent[i].isbm = $('p:eq(2)').text()
    })
  }
  return recent
}

const RecentCache = async () => {
  console.log("it was called");
  let avar: scrapedData[] = await getRecent()
  let stringAvar = JSON.stringify(avar);
  console.log(stringAvar);
  console.log("out of the call");
  if(!fs.existsSync(path.join(__dirname, "/../../data"))){
    fs.mkdirSync(path.join(__dirname, "/../../data"))
  }
  fs.writeFileSync(path.join(__dirname, "/../../data/recent.json"), stringAvar, {flag: 'w+'})
  console.log("created");
}

export default RecentCache